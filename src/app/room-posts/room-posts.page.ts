import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { equalTo, get, getDatabase, limitToFirst, orderByChild, push, query, ref, set, update } from 'firebase/database';
import { FirebaseService } from '../services/firebase.service';
import { PostService } from '../services/post.service';
import { RoomsService } from '../services/rooms.service';
import { AlertController, IonModal, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-room-posts',
  templateUrl: './room-posts.page.html',
  styleUrls: ['./room-posts.page.scss'],
})
export class RoomPostsPage implements OnInit {

  posts:any;
  room:any;
  userRoomData:any;
  loading:boolean = true;
  userSearched:any = null;
  infoModal:boolean = false;
  membersModal:boolean = false;
  @ViewChild(IonModal) modal: any;
  members:any = [];

  //



  constructor(private alertController: AlertController,private firebaseService:FirebaseService,private route:ActivatedRoute, private roomsService:RoomsService,private postService:PostService,private router:Router) { }

  ngOnInit() {
    
    this.room = this.roomsService.getCurrentRoom();
    this.ifIsFirstTime()
    this.getMembers();
    //esto valida si estoy siguiendo el room o si yo lo cree
    this.getUserRoomStatus();
    this.getPosts();
  }

  getMembers(){
    this.roomsService.getMembers(this.room.room_id).subscribe(data=>{
      data.then((datos:any)=>{
        
        this.members = datos;
      })
     
    })
  }

  getPosts(){
    let room_id = this.route.snapshot.paramMap.get('id');
    this.roomsService.getRoomsPost(room_id).subscribe(snapshot=>{
      snapshot.then((data:any)=>{
        this.loading = false;
        this.posts = data;
      });
    })
  }

  viewPost(post:any){
    this.postService.setPost(post);
    this.router.navigate(["/post"]);
  }

  getUserRoomStatus(){
    let room_id = this.route.snapshot.paramMap.get('id');
    this.roomsService.getUserRoomStatus(room_id).subscribe(snapshot=>{
      snapshot.then((data:any)=>{
        this.userRoomData = data;
        console.log(data)
      })
    })
  }

  follow(status:boolean){
    this.roomsService.followRoom(status);
  }

  createNewPost(){
    let data = {
      type:'room',
      room_id:this.room.room_id,
      room_name:this.room.name
    }
    this.router.navigate(["/create-post"],{queryParams: data})
  }

  //Modal Members
  cancelMembersModal() {
    this.membersModal = false;
    this.modal.dismiss(null, 'cancel');
  }

  openMembersModal(){
    this.membersModal = true;
  }

  onMembersWillDismiss(){
    this.membersModal = false;
  }

  

  addUserToCurrentRoom(userId:any){
    let db = getDatabase(this.firebaseService.app);
 
    var userRef = ref(db, 'rooms_members/'+this.room.room_id+"/"+userId);
    set(userRef,true)
  }

  deleteUserFromCurrentRoom(userId:any){
    let db = getDatabase(this.firebaseService.app);
    var userRef = ref(db, 'room_members/'+this.room.room_id+"/"+userId);
    set(userRef,null)
  }


  setInfoOpen(status:boolean){
    this.infoModal = status;
  }


  ifIsFirstTime(){
    this.route.queryParams
    .subscribe((params:any) => {
      console.log(params);
      if(params.code && params.code == true){
        //save in following
        this.follow(true);
      }
    }
  );
  }

  async deleteRoomAlert() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //
          },
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
           //
            this.roomsService.deleteGroup();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }


  removeUser(uid:any,index:number){
    delete this.members[0];
    this.roomsService.removeMember(uid);
  }


}
