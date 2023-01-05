import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { ReactionsService } from '../services/reactions.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  post:any;
  comments:any =false;
  //likes
  uid:any;
  likesState:any = {};
  //end likes

  commentCreated:any = null;
  reactions:any = [];
  
  constructor(private authService:AuthService,private postService:PostService, private router:Router,private reactionsService:ReactionsService) {

    this.postService.commentCreated.subscribe(data=>{
      this.commentCreated = data;
      console.log("este es",data)
    })
   }

  ngOnInit() {
    this.postService.init()
    this.commentCreated = null;
    this.uid = this.authService.getUID();
    this.getPost();
    this.getReactions();
  }

  getPost(){
    this.post = this.postService.getPost();
    this.getComments();
  }

  getComments(){
    this.postService.getComments(this.post.post_id).subscribe(snapshot=>{
      snapshot.then((data:any)=>{
        this.comments = data;
      })
    })
    //this.comments = this.postService.comments;
    console.log("////",this.comments)
  }

  nFormatter(num:number, digits:number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  like(postId:any,c_id:string,like:boolean,position:number){
    
    if(like){
      this.likesState[c_id] = false;
      this.comments[position]["likesCount"]--
      delete this.comments[position].likes[this.uid];
    }

    if(!like){
      this.likesState[c_id] = true;
      this.comments[position]["likesCount"]++
      this.comments[position]['likes'][this.uid] = true;
    }
    console.log("likes son", this.likesState)
    this.postService.commentLikes(postId,c_id);
  }

  onIonInfinite(ev:any) {
    this.getComments();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  getReactions(){
    this.reactionsService.getReactionsForPost(this.post.post_id).subscribe(data=>{
      data.then((datos:any)=>{
        this.reactions = datos;
        console.log("lista",this.reactions)
        this.getMyReaction();
      })
    })
  }

  getMyReaction(){
    this.reactionsService.getMyReaction(this.post.post_id).subscribe(data=>{
      data.then((datos:any)=>{
        if(datos!=null){
          this.reactions = [...datos,...this.reactions]
          console.log("reactions son",datos)
        }
        
      })
    })
  }

  removeMyReaction(){
    this.reactions.shift()
    this.reactionsService.removeReact(this.post.post_id);
  }
}
