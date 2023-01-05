import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  posts:any = null;
  user:any = null;
  constructor(private postService:PostService, private userService:UserService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
    this.getUser();
    this.getPosts();
  }

  async getUser(){
    this.user = await this.userService.userData(this.route.snapshot.paramMap.get('id')).subscribe(data=>{
      data.then((user:any)=>{
        this.user = user;
      })
    })
    /*
    this.user = {
      img:'https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg',
      username:'marvinhere'
    };
    */
  }

  async getPosts(){
    let id = this.route.snapshot.paramMap.get('id');
    await this.postService.getPostsByUser(id);
    this.posts = this.postService.userPosts;
  }

  //Go to post page
  viewPost(post:any){
    this.postService.setPost(post);
    this.router.navigate(["/post"]);
  }

}
