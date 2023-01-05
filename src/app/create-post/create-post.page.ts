import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PostService } from '../services/post.service';
import { RoomsService } from '../services/rooms.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  postForm:any;
  room:any = {};
  type:any;
  loading:boolean = false;
  constructor(private loadingCtrl: LoadingController,private roomsService:RoomsService,private _builder:FormBuilder,private postService:PostService, private route:ActivatedRoute) {
    this.postForm = this._builder.group({
      text: ['',Validators.required],
      mood:[]
    });
   }

  ngOnInit() {
    this.route.queryParams
      .subscribe((params:any) => {
        console.log(params); // { orderby: "price" }
        this.type = params.type;
        if(params.type=="room"){
          
          this.room["room_id"] = params.room_id;
          this.room["name"] = params.room_name;
        }else{
          this.type = "simple";
          this.room = null;
          this.postForm.get('mood').addValidators(Validators.required);
        }
      }
    );
  }

  createPost(postForm:any){
    this.loading = true;
    if(this.type=="simple"){
      //Create normal post
      this.showLoading();
      this.postService.createPost(postForm.text,postForm.mood)
    }
    if(this.type=='room'){
      this.showLoading();
      this.roomsService.createPost(postForm.text,this.room.room_id);
    }
    
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 6000,
    });

    loading.present();
  }

}
