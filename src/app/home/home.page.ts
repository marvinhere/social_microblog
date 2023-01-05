import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FeedService } from '../services/feed.service';
import { PostService } from '../services/post.service';
import { ReactionsService } from '../services/reactions.service';
import { RoomsService } from '../services/rooms.service';
import { SettingsService } from '../services/settings.service';
import { IonModal, LoadingController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  
  posts:any = null;
  reactions:any;
  tab_selected:any = "posts"
  rooms:any = null
  loading:boolean = false;
  selected:any = null;

  room_name:any;
  room_code:any;
  room_modal:boolean = false;
  modalButton:boolean = false;

  react_modal:boolean = false;
  postToReact:any=null;

  //Modal
  @ViewChild(IonModal) modal: any;
  addGroupOptionsModal:boolean = false;
  groupCodeModal:boolean = false;
  
  

  constructor(private storageService:StorageService,private loadingCtrl: LoadingController, private settings:SettingsService,private roomsService:RoomsService,private authService:AuthService,private reactionService:ReactionsService,private postService:PostService, private router:Router, private feedService:FeedService) {
    this.roomsService.roomState.subscribe(data=>{
      if(data.roomChange == true){
        this.getUserRooms();
        this.roomsService.roomState.next({
          roomChange:false
        })
      }
    })
  }

  /*
  async ngOnInit() {
    await this.authService.getUserState();
    //Siempre llamar a getUserState() en todas las pagina al iniciar porque se encarga de obtener el current UID
    this.settings.setLocation().subscribe(data=>{
      data.then((datos2:any)=>{
        this.settings.geohashData = datos2
        this.getReactions();
        this.getUserRooms();
        this.getPosts();
      })
    });
  }
  */

  async ngOnInit(){
    await this.authService.getUserState();
    

    //validate location
    if(this.storageService.getLocation()==null){
      this.settings.setLocation().subscribe(data=>{
        data.then((datos:any)=>{
          this.storageService.saveLocation(datos);
          
          this.getPosts();
          
          
        })
      });
    }else{
      
      this.getPosts();
      //this.getPosts();
    }
   

  }

  

  

  getUserRooms(){
    if(this.storageService.getRooms()!=null && this.storageService.getRooms()["rooms"].length>0){
      this.rooms = this.storageService.getRooms()["rooms"];
    
      
    }else{
      console.log("leyendo rooms")
      this.roomsService.getCommunityRooms().subscribe(snap=>{
        snap.then(async (data:any)=>{
          let sorting = data.reverse();
          this.rooms = sorting;
          if(await data.length>0){
            this.storageService.saveRooms(data)
          }
          
        })
      })
    }
   
  }

  getReactions(){
    this.reactionService.getReactions().subscribe(data=>{
      data.then((data2:any)=>{
        console.log("yyyyy",data2)
        this.reactions = data2;
        this.reactionService.userReactions = data2;
      });
    })
    
    
  }

  getPosts(){
    var _this = this;
    this.loading = true;

    if(this.storageService.getLocalFeed()!=null && this.storageService.getLocalFeed()["posts"].length>0){
      //Verificar si no hay que actualizar
      if(this.storageService.needToUpdate(this.storageService.getLocalFeed()["time"],"feed")){
        console.log("time to update")
        this.getReactions();
        getData()
      }else{
        console.log("get local posts")
        this.posts = this.storageService.getLocalFeed()["posts"];
        this.getReactions();
        this.getUserRooms();
      }
    }else{
      console.log("load from db")
      getData();
      this.getReactions();
      this.getUserRooms()
      
    }

    function getData(){
      _this.feedService.getHashtags().subscribe(data=>{
        data.then((dat:any)=>{
          console.log("los hashtags son",dat)
          _this.feedService.getFeed(dat).pipe(map(data=>data)).subscribe(postsListen=>{
            console.log("tuts",postsListen)
            postsListen.then((datos:any)=>{
              _this.loading = false;
              if(data.length>0){
                _this.storageService.saveFeed(datos);
              }
             
              console.log("my posts",datos)
              _this.posts=datos;
              _this.getUserRooms();
            })
          },error=>{
            _this.loading = false;
            _this.selected = null;
          })
        })
        
      })
    }
   
    
   
  }

  //Go to post page
  viewPost(post:any){
    this.postService.setPost(post);
    this.router.navigate(["/post"]);
  }


  //Modal
  cancel() {
    this.room_modal = false;
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.room_modal = false;
    this.showLoading();
    await this.roomsService.createRoom(this.room_name)
    this.getUserRooms();
    this.room_name = ""
   // this.modal.dismiss(this.room_name, 'confirm');
  }

  async onWillDismiss(event: Event) {
    
    this.room_modal = false;
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    console.log("aqui",ev.detail)
    if (ev.detail.role === 'confirm') {
      this.showLoading();
      
      //await this.roomsService.createRoom(ev.detail.data)
      //this.getUserRooms();
      console.log(ev.detail.data)
      this.room_name = ev.detail.data;
      
    }
  }

  goToRoom(room:any){
    console.log("gotoroom",room.room_id)
    this.roomsService.setCurrentRoom(room);
    this.router.navigate(["/room-posts/"+room.room_id])
  }

  tabs_click(selection:string){
    this.tab_selected = selection;
  }

  setOpen(isOpen: boolean) {
    this.addGroupOptionsModal = false;
    this.room_modal = isOpen;
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 4000,
    });
   
    loading.present();
  }

  onGroupWillDismiss() {
    this.addGroupOptionsModal = false;
    this.groupCodeModal = false;
    this.room_code = ""
    this.room_name = ""
  }

  openAddGroupOptionsModal(status:boolean){
    this.addGroupOptionsModal =  status;
   }
 
  
 
  openGroupCodeModal(status:boolean){
    this.addGroupOptionsModal = false;
    this.groupCodeModal = status;
  }

  enterToNewRoom(){
    this.roomsService.setCurrentRoom(this.room_code);
    this.router.navigate(["/room-posts/"+this.room_code],{ queryParams: { code: 'true' } })
    this.room_code = "";
  }


  dataConditionModal(ev:any){
    let text = ev.target.value
    if(text.length>4){
      this.modalButton = true;
    }else{
      this.modalButton = false;
    }
    
  }

  openReactModal(ev:any){
    if(ev.post_id!=null){
      this.react_modal = true;
      this.postToReact = ev.post_id
    }
  }

  onReactWillDismiss(ev:any){
    this.react_modal = false;
    this.postToReact = null
  }

  react(reaction:any){
    this.reactionService.reactToPost(reaction,this.postToReact);
    this.postToReact = null;
    this.react_modal = false;
  }
 
}
