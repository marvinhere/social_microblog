import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref,set, onValue, push, Database, serverTimestamp, orderByChild, equalTo, get, child, update, runTransaction, query, orderByKey, startAt, limitToLast, limitToFirst, endBefore} from "firebase/database";
import { FirebaseService } from './firebase.service';

import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private post:any;
  private posts:any;
  private user:any;
  public comments:any = null;
  public userPosts:any;
  //pagination
  private lastItemKey:any = null;
  private lastItemPostKey = null;
  commentCreated: BehaviorSubject<any> = new BehaviorSubject<any>({});
  

  constructor(private storageService:StorageService,private settings:SettingsService,private authService:AuthService,private firebaseService:FirebaseService, private router:Router, private nav:NavController) { }

  init(){
    this.comments = null;
    this.lastItemKey = null;
    
  }

  commentCreatedObserver():Observable<any>{

    return of(this.commentCreated);
  }

  //No connect with db
  setPost(post:any){
    this.post = post;
  }

  getPost(){
    return this.post;
  }


  createPost(text:any,mood:any){

      // resp.coords.latitude
      // resp.coords.longitude

      const geohashData = this.storageService.getLocation();
      let db = getDatabase(this.firebaseService.app);

   

        const uid = this.authService.getUID().toString();
      console.log(uid,"////")
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
            timestamp: serverTimestamp()
          }
  
          const newPostKey = push(child(ref(db), 'posts/')).key;
  
          let updates:any = {};
          updates['/posts/'+ newPostKey] = data;
          updates['/user-posts/' + uid + '/' + newPostKey] = data;

          //get and write hashtags
          findHashtags(text).forEach(hashtag=>{
           
            updates['/hashtags/'+hashtag.slice(1)+"/"+newPostKey] =  {timestamp:serverTimestamp()};
            updates['/hashtag_zones/'+geohashData+"/"+hashtag.slice(1)+"/last_post_t"] =  serverTimestamp();
          })

          update(ref(db), updates).then(data=>{
            //Si se creo el post, updte el contandor de hashtags por zona para los trending by location
            findHashtags(text).forEach(hashtag=>{
              var hashtagRef = ref(db, 'hashtag_zones/'+geohashData+"/"+hashtag.slice(1));
              runTransaction(hashtagRef, (hash) => {
                if (hash) {
                    if(hash.counter){
                      hash.counter++;
                    }else{
                      hash["counter"] = 1;
                    }
                    
                }
                return hash;
              });
            })
            
          })

            this.nav.back();
        });
     
  
    

        function findHashtags(searchText:any):Array<any>{
          var regexp = /\B\#\w\w+\b/g
          let result = searchText.match(regexp);
          if (result) {
              return result;
          } else {
              return [];
          } 
        }
    

    
  }

  //Connect with db
  async getPostsByUser(uid:any){
    let db = getDatabase(this.firebaseService.app);

    var userRef = ref(db, 'user-posts/'+uid);

    /*Pagination*/
    var referencia = null;
    if(this.lastItemPostKey==null){
      referencia = query(userRef,orderByKey(),limitToLast(2));
    }else{
      console.log("last item key",this.lastItemPostKey)
      referencia = query(userRef,orderByKey(),endBefore(this.lastItemPostKey),limitToLast(2))
    }
    

 
   await get(userRef).then(snapshot=>{
      let array:any = [];
      Object.keys(snapshot.val()).forEach((key)=>{
        let data = snapshot.val()[key]
        data["post_id"] = key;
        array.push(data);
      })

      //Invertir array
      array = array.reverse();
      //this.userPosts = array;

      this.lastItemKey = array[array.length-1].post_id
      if(this.userPosts!=null){
        //Add new posts
        this.userPosts = [...this.userPosts,...array];
      }else{
        //set the firsts posts
        this.userPosts = array
      }

    })

   
    



    /*

    let posts = [
      {
        user:{
          username:"marvinhere",
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg"
        },
        id:1,
        text:"Hey everyone, the boss is here! This is my new social project!",
        reactions:[{
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg",
          react:5
        },
        {
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg",
          react:3
        },
        {
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg",
          react:2
        }]
        
      },
      {
        user:{
          username:"lulu99",
          img:"https://i.pinimg.com/236x/f3/51/21/f35121925403eecec69bc82e573b6dbd.jpg"
        },
        id:1,
        text:"I like this new social network",
        reactions:[{
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg",
          react:5
        },
        {
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg",
          react:3
        },
        {
          img:"https://www.cooperativa.cl/noticias/site/artic/20220718/imag/foto_0000000420220718090012.jpg",
          react:2
        }]
        
      }
    ];
    return posts;
    */
  }
  
  createComment(post_id:any,text:string){
    let db = getDatabase(this.firebaseService.app);
    let auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        var userRef = ref(db, 'users/'+uid);
        const newCommentKey = push(child(ref(db), 'comments/'+post_id)).key;
    
        get(userRef).then(snapshot=>{
          let data = {
            user:{
              username:snapshot.val().username,
              img:snapshot.val().img
            },
            uid:uid,
            post_id:post_id,
            c_id:newCommentKey,
            text:text,
            likesCount:0,
            timestamp: serverTimestamp()
          }
          console.log(data)
      
          let updates:any = {};

          
          updates['/comments/' + post_id+"/"+newCommentKey] = data;
  
          update(ref(db),updates);
          this.commentCreated.next(data);
          this.nav.back();
        })
        
   
        // ...
      } else {
        // User is signed out
        // ...

        this.router.navigate(["/login"],{ replaceUrl: true });
      }
    });

  }

  getComments(post_id:string):Observable<any>{
    let db = getDatabase(this.firebaseService.app);
    var userRef = ref(db, 'comments/'+post_id);
    var referencia = null;
    console.log("james",this.lastItemKey)
    if(this.lastItemKey==null){
      referencia = query(userRef,orderByKey(),limitToLast(2));
    }else{
      console.log("last item key",this.lastItemKey)
      referencia = query(userRef,orderByKey(),endBefore(this.lastItemKey),limitToLast(2))
    }
    

    

    let comentarios = get(referencia).then(snapshot=>{
      if(snapshot.val()!=null){
      let array:any = [];
      //contador del array para saber las posiciones de los comentarios, necesario para los likes
     // let counterIdArray = 0;

      Object.keys(snapshot.val()).forEach((key)=>{
        let data = snapshot.val()[key]
        if(snapshot.val()[key].likes==undefined){
          data["likes"] = [];
        }
        //data["position"]=counterIdArray;
        data["user"] = {
          username:snapshot.val()[key].user.username,
          img:snapshot.val()[key].user.img,
        };
        array.push(data);
        //counterIdArray++;
      })
      array = array.reverse();
      this.lastItemKey = array[array.length-1].c_id
      if(this.comments!=null){
        this.comments = [...this.comments,...array];
      }else{
        this.comments = array
      }
    }
      return this.comments;

    })

    return of(comentarios)
  }

  commentLikes(post_id:any,c_id:string){
    const db = getDatabase(this.firebaseService.app);
    const postRef = ref(db, '/comments/'+post_id+"/"+c_id);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        runTransaction(postRef, (comment) => {
          if (comment) {
            if (comment.likes && comment.likes[uid]) {
              comment.likesCount--;
              comment.likes[uid] = null;
            } else {
              comment.likesCount++;
              if (!comment.likes) {
                comment.likes = {};
              }
              comment.likes[uid] = true;
            }
          }
          return comment;
        });
        
     
      } else {
        // User is signed out
        // ...

        this.router.navigate(["/login"],{ replaceUrl: true });
      }
    });
  

  }

  deletePost(post_id:any){
    const db = getDatabase(this.firebaseService.app);
    const postRef = ref(db);

    let updates:any = {}
    updates['/posts/'+ post_id] = null;
    updates['/user-posts/' + this.authService.getUID() + '/' + post_id] = null;
    update(postRef,updates);
  }
}
