import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.page.html',
  styleUrls: ['./create-comment.page.scss'],
})
export class CreateCommentPage implements OnInit {
  
  post:any;
  commentForm:any;

  constructor(private postService:PostService,private _builder:FormBuilder) { 
    this.commentForm = this._builder.group({
      text: ['',Validators.required]
    });
  }

  ngOnInit() {
    this.getPost();
  }

  getPost(){
    this.post = this.postService.getPost();
    console.log("posts es ",this.post)
  }

  createComment(commentForm:any){
    this.postService.createComment(this.post.post_id,commentForm.text);
  }

}
