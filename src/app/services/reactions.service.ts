import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { child, endBefore, get, getDatabase, limitToLast, orderByKey, push, query, ref as refDB, serverTimestamp, update } from 'firebase/database';
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

import { Observable, bindCallback, of} from 'rxjs';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';



@Injectable({
  providedIn: 'root'
})
export class ReactionsService {

  public userReactions:any;
  private reactionLastKey:any=null;
  private postsReactions:any=[];
  constructor(private authService:AuthService,private firebaseService:FirebaseService, private nav:NavController) { }

  saveReaction(file:any){

    let db = getDatabase(this.firebaseService.app);
    let auth = getAuth();
    

    onAuthStateChanged(auth, (user) => {
      if (user) {
        let uid = user.uid;

        const storage = getStorage();
        const storageRef = ref(storage, 'reactions/'+uid+Math.floor(Date.now() / 1000));
        
        uploadString(storageRef, file, 'data_url').then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            //var userRef = refDB(db, 'users/'+uid+"/reactions");
            const userRef = push(child(refDB(db), 'users/'+uid+"/reactions")).key;
            let data = {
              img:downloadURL,
              timestamp:serverTimestamp()
            };

            let write:any = {};
            write['users/'+uid+"/reactions/"+userRef] = data;
            update(refDB(db), write)
            this.nav.back();
          });
        });

      }});
  }

  getReactions():Observable<any> {
   
    
    let db = getDatabase(this.firebaseService.app);
    let auth = getAuth();
    let uid = this.authService.getUID();
        var userRef = refDB(db, 'users/'+uid+"/reactions");
        let reactions:any = get(userRef).then(snapshot=>{
          let array:any = [];
          if(snapshot.val()!=null){
            Object.keys(snapshot.val()).forEach((key)=>{
              let data = snapshot.val()[key]
              data["reaction_id"] = key;
              array.push(data);
              //counterIdArray++;
            })
          }
         
          return array;
        })
       // console.log("///dfd/f/df",reactions)
        return of(reactions)
  }

  wait(mil:number){
    return new Promise(resolve=>{
      setTimeout(resolve, mil);
    })
  }

  getReactionsForPostComponent(post_id:any):Observable<any>{
    let db = getDatabase(this.firebaseService.app);
    var reactionsRef = refDB(db, 'posts_reactions/'+post_id);
    let reactionQuery = query(reactionsRef,limitToLast(4))
    let reactions = get(reactionsRef).then(snapshot=>{
      let array:any = [];
      Object.keys(snapshot).forEach(reactionKey=>{
        let data:any = {}
        data["img"] = snapshot.val()[reactionKey];
        data["uid"] = reactionKey;
        array.push(data);
      })
      return array;
    });
    return of(reactions);
  }

  getReactionsForPost(post_id:any):Observable<any>{
    let db = getDatabase(this.firebaseService.app);
    var reactionsRef = refDB(db, 'posts_reactions/'+post_id);
    let referencia = null;
    if(this.reactionLastKey==null){
      referencia = query(reactionsRef,orderByKey(),limitToLast(2));
    }else{
      console.log("last item key",this.reactionLastKey)
      referencia = query(reactionsRef,orderByKey(),endBefore(this.reactionLastKey),limitToLast(2))
    }
    
    let reactions = get(referencia).then(snapshot=>{
      //console.log("la lista de reactions",snapshot.val())
      let array:any = [];
      if(snapshot.val()!=null){
        Object.keys(snapshot.val()).forEach(reactionKey=>{
          
            let data:any = {}
          data["img"] = snapshot.val()[reactionKey];
          data["uid"] = reactionKey;
          if(reactionKey!=this.authService.getUID()){
            data["owner"] = false
          }else{
            data["owner"] = "hide"
          }
          
          array.push(data);
          
          
        })
        array = array.reverse()
        this.reactionLastKey= array[array.length-1].uid
        if(this.postsReactions.length==0){
          this.postsReactions = [...this.postsReactions,...array];
        }else{
          this.postsReactions = array
        }
      }
      return array;
    });
  
    return of(reactions);
  }

  reactToPost(reaction:any,post_id:any){
    let db = getDatabase(this.firebaseService.app);
    let data:any = {}
    data['posts_reactions/'+post_id+"/"+this.authService.getUID()]=reaction.img;
    update(refDB(db),data);
    console.log("reaccciono")
  }

  removeReact(post_id:any){
    let db = getDatabase(this.firebaseService.app);
    let data:any = {}
    data['posts_reactions/'+post_id+"/"+this.authService.getUID()]=null;
    update(refDB(db),data);
  }

  getMyReaction(post_id:any):Observable<any>{
    let db = getDatabase(this.firebaseService.app);
    var reactionsRef = refDB(db, 'posts_reactions/'+post_id+"/"+this.authService.getUID());
    let reaction = get(reactionsRef).then(snapshot=>{
      console.log("este es el error ",snapshot.val())
      let data:any = []
      if(snapshot.val()!=null){
        let d:any = {}
        d["img"] = snapshot.val()
        d["owner"]=true
        data.push(d)
      }else{
        data=null;
      }
      return data;
    })

    return of(reaction)
  }

  deleteOldPostsReactions(){
    this.postsReactions = []
  }
}
