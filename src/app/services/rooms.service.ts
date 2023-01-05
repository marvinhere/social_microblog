import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { getDatabase, ref,set, onValue, push, Database, serverTimestamp, orderByChild, equalTo, get, child, update, runTransaction, query, orderByKey, startAt, limitToLast, limitToFirst, endBefore} from "firebase/database";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  public roomState:BehaviorSubject<any> = new BehaviorSubject<any>({
    "roomChange":false
  });

  private currentRoom:any;
  members:any = [];

  constructor(private storageService:StorageService,private settings:SettingsService,private firebaseService:FirebaseService,private authService:AuthService, private nav:NavController) { }

  appRooms(){
    let rooms = [
      {
        name:"Happy",
        emoji:"😀",
        id:"happy"
      },
      {
        name:"Funny",
        emoji:"😀",
        id:"funny"
      }
    ];

    return rooms;
  }

  getCommunityRooms():Observable<any>{
    let uid = this.authService.getUID()
    let db = getDatabase(this.firebaseService.app);
    var roomsRef = ref(db, 'following_rooms/'+uid);

    let datos = get(roomsRef).then(snapshot=>{
      var array:any = [];
      if(snapshot.val()!=null){
        
        Object.keys(snapshot.val()).forEach((key)=>{
          //Get info for each group following
          let room_id = key;
          var roomInfo = ref(db, 'rooms/'+room_id);
          get(roomInfo).then(data=>{
            if(data!=null){
              let mydata = data.val();
              mydata["room_id"] = room_id;
              array.push(mydata);
            }else{
              let deleteR:any = {}
              deleteR['following_rooms/'+uid] = null
              update(ref(db),deleteR)
            }
           
          })
        })
      }
      console.log("////////////",array)
      let reverse = array.sort(
        (p1:any, p2:any) => 
        (p1 < p2) ? 1 : (p1 > p2) ? -1 : 0);
      return reverse;
    })
    return of(datos);
    
  }

  

  /*
  * CREATE ROOM
  */

  async createRoom(name:string){
    let data = {
      name:name,
      uid:this.authService.getUID(),
      timestamp:serverTimestamp()
    }
    let db = getDatabase(this.firebaseService.app);
    

    const newRoomKey = push(child(ref(db), 'rooms')).key;
  
    let updates:any = {};
    updates['/rooms/'+ newRoomKey] = data;
    updates['/user_rooms/'+this.authService.getUID()+"/"+newRoomKey] = true;
    updates['/following_rooms/'+this.authService.getUID()+"/"+newRoomKey] = true;
    updates['/room_members/'+newRoomKey+"/"+this.authService.getUID()]=true;
    await update(ref(db), updates);
  }

  /*
  * GET ROOM POSTS
  */


  getRoomsPost(room_id:any):Observable<any>{

    let db = getDatabase(this.firebaseService.app);
    var roomsRef = ref(db, 'room_posts/'+room_id);

    let datos = get(roomsRef).then(snapshot=>{
      let array:any = [];
      if(snapshot.val()!=null){
        Object.keys(snapshot.val()).forEach((key)=>{
          let data = snapshot.val()[key]
          data["post_id"] = key;
          array.push(data);
        })
      }
      console.log("service posts room",snapshot.val())
      return array;
    })
    return of(datos);
  }


  setCurrentRoom(room:any){
    this.currentRoom = room;
  }

  getCurrentRoom(){
    return this.currentRoom;
  }

  getUserRoomStatus(room_id:any):Observable<any>{
    let db = getDatabase(this.firebaseService.app);
    var roomsRef = ref(db, 'following_rooms/'+this.authService.getUID()+"/"+room_id);
    //If 
   
    let userData = get(roomsRef).then(snapshot=>{
    
      var generalData:any = {
        owner:false,
        following:false
      }
     
      if(snapshot.val()!=null){
        generalData["following"]=true;
      }
      
      
      if(this.currentRoom.uid == this.authService.getUID()){
        generalData["owner"]=true;
      }
      return generalData;
    })
    
    return of(userData);
  }

  followRoom(status:boolean):boolean{
    let db = getDatabase(this.firebaseService.app);
  
    let updates:any = {};
    if(!status){
     //Unfollow
      updates["following_rooms/"+this.authService.getUID()+"/"+this.currentRoom.room_id] = null;
      updates['/room_members/'+this.currentRoom+"/"+this.authService.getUID()]=null;
      update(ref(db),updates);
    }else{
      //Follow

      updates["following_rooms/"+this.authService.getUID()+"/"+this.currentRoom.room_id] = true;
      updates['/room_members/'+this.currentRoom+"/"+this.authService.getUID()]=true;
      update(ref(db),updates);
    }
    return status;
  
  }

  createPost(text:any,room_id:any){
      const geohashData = this.storageService.getLocation();
      let db = getDatabase(this.firebaseService.app);

        const uid = this.authService.getUID().toString();
        var userRef = ref(db, 'users/'+uid);
        console.log("datos",userRef)
    
        get(userRef).then(snapshot => {
          let user = snapshot.val();
          let data = {
            user:{
              username:user.username,
              img:user.img
            },
            uid:uid,
            text:text,
            location:geohashData,
            timestamp: serverTimestamp(),
            in_group:true
          }
  
          const newPostKey = push(child(ref(db), 'posts/'+geohashData)).key;
  
          let updates:any = {};
          updates['/posts/'+geohashData+"/" + newPostKey] = data;
          updates['/room_posts/' + room_id + '/' + newPostKey] = data;
        
          update(ref(db), updates);
  
            this.nav.back();
        });
     
  
    

  }

  getMembers(roomId:any):Observable<any>{


    let db = getDatabase(this.firebaseService.app);
    var usersRoomRef = ref(db, 'room_members/'+roomId);
    
    
    let allData = get(usersRoomRef).then(snapshot=>{
      console.log("los miembros id son",snapshot.val())
      if(snapshot.val()!=null){
        //members exists
        var members:any = [];
        Object.keys(snapshot.val()).forEach(key=>{
          let userData = get(ref(db,'users/'+key)).then(user=>{
            let datos:any = {}
            if(user.val()!=null){
              datos = user.val();
              datos["uid"] = key;
              
            }else{
              //User ya no tiene cuenta entonce se elimina
              set(ref(db,'room_members/'+roomId+"/"+key),null);
            }
            return datos;
          })
          
          userData.then(datos=>{
            members.push(datos);
          })

         
          
        })
      }

      return members;
     
    })

    return of(allData);

  }

  removeMember(uid:any){
    let db = getDatabase(this.firebaseService.app);
    var usersRoomRef = ref(db, 'room_members/'+this.currentRoom.roomId+"/"+uid);
    set(usersRoomRef,null);
  }

  deleteGroup(){
    let db = getDatabase(this.firebaseService.app);
 
    let updates:any = {};
    updates['/rooms/'+ this.currentRoom.room_id] = null;
    updates['/user_rooms/'+this.authService.getUID()+"/"+this.currentRoom.room_id] = null;
    updates['/following_rooms/'+this.authService.getUID()+"/"+this.currentRoom.room_id] = null;
    updates['/room_members/'+this.currentRoom.room_id+"/"+this.authService.getUID()] = null;
    updates['/room_posts/'+this.currentRoom.room_id] = null;
    console.log("updates",updates)
    update(ref(db),updates)

    this.roomState.next({
      roomChange:true
    })
    this.nav.back();
   
  }
}
