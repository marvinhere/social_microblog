import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { ReactionsService } from 'src/app/services/reactions.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post:any;
  @Output() react = new EventEmitter<{post_id:null}>();
  react_modal:boolean = false;
  postToReact:any=null;
  reactions:any = [];
  userReactions:Array<any> = []
  savedReaction:any = null
  constructor(public reactionService:ReactionsService,private postService:PostService,private reactionsService:ReactionsService, private router:Router) { }

  ngOnInit() {
    
  }

  getReactions(postId:any){
    //Obtener las reacciones aqui
    this.reactionsService.getReactionsForPostComponent(postId).subscribe(reactions=>{
      reactions.then((reaction:any)=>{
        this.reactions = reaction;
      })
    })
  }

  

  viewPost(post:any){
    this.postService.setPost(post);
    this.router.navigate(["/post"]);
  }


  reactModal(){
  
      this.react_modal = true;
      this.postToReact = this.post.post_id
      console.log(this.reactionService.userReactions)
    
  }

  onReactWillDismiss(ev:any){
    this.react_modal = false;
    this.postToReact = null
  }

  reactToPost(reaction:any){
    if(this.reactions[0]!=undefined){
      this.savedReaction = this.reactions[0]
    }

    this.reactions[0] = reaction
   
    
   this.reactionService.reactToPost(reaction,this.postToReact);
    this.postToReact = null;
    this.react_modal = false;
  }

  removeReact(){
    if(this.savedReaction!=null){
      this.reactions[0] = this.savedReaction;
    }else{
      delete this.reactions[0]
    }
    
  }
 
}
