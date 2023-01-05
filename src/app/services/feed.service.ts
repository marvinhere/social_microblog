import { Injectable } from '@angular/core';
import { getDatabase, ref,set, onValue, push, Database, serverTimestamp, orderByChild, equalTo, query, get, child, update, orderByKey, limitToLast, limitToFirst} from "firebase/database";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  posts:any;
  hashtags:any;
  constructor(private storageService:StorageService,private settings:SettingsService,private firebaseService:FirebaseService) { }

  //Famous hashtags in area
  getHashtags():Observable<any>{

    let db = getDatabase(this.firebaseService.app);
    const geohashData = this.storageService.getLocation();
   
    //get popular hashtags firsts
    var hashtagsRef = ref(db, 'hashtag_zones/'+geohashData);
    let queryHashtag = query(hashtagsRef,orderByChild("counter"),limitToFirst(10));
    let hashtags = get(queryHashtag).then(snapshot=>{
      let hashtagArray:any = [];
      if(snapshot.val()!=null){

      
        Object.keys(snapshot.val()).forEach((key)=>{
          //Get hashtag and save it into the array
          let data = snapshot.val()[key];
          data["hashtag"] = key;
          hashtagArray.push(data);
        });
      }
      return hashtagArray;
    });
/*
    let data:any = [];
    hashtags.then(datos=>{
      console.log("telarana",datos)
      data = datos;
    })
*/
    return of(hashtags)
  }

  getFeed(hashtags:Array<any>):Observable<any>{
    var allPosts:any = [];
    let q_posts:any = [];
    let postList:any = [];
    var postRegister:any = {};
    hashtags.forEach(hashtag=>{
      let db = getDatabase(this.firebaseService.app);
      var postsIdRef = ref(db, 'hashtags/'+hashtag.hashtag);
      let queryPostsId = query(postsIdRef,orderByChild("timestamp"),limitToFirst(15));
      q_posts = get(queryPostsId).then(snapshot=>{
        //postRegister verifica si algun post existe o no
        
        let c = 0;
        if(snapshot.val()!=null){
          Object.keys(snapshot.val()).forEach(post_id=>{
            if(!postRegister[post_id]){
             
              postRegister[post_id]=true;

              var posts = ref(db, 'posts/'+post_id);
              let postData = get(posts).then(snap=>{
                let data:any = {};
                if(snap.val()!=null){
                  data = snap.val();
                  data["post_id"] = post_id;
                }
                
                //console.log("no existe",hashtag,postRegister,post_id)
                return data;
              });
              
              postData.then(post=>{
                postList.push(post);
              })

              

            }
            
          })
        }
        return postList;
      });

    
    });

   
    
    return of(q_posts)
    

  }
/*
  getFeed():Observable<any>{
   
    let db = getDatabase(this.firebaseService.app);
    const geohashData = this.settings.getLocation();
   
    //get popular hashtags firsts
    var hashtagsRef = ref(db, 'hashtag_zones/'+geohashData);
    let queryHashtag = query(hashtagsRef,orderByChild("counter"),limitToFirst(10));
    let datos = get(queryHashtag).then(snapshot=>{
    
      if(snapshot.val()!=null){
         let hashtagArray:any = [];
         let postsBucket:any = [];
      Object.keys(snapshot.val()).forEach((key)=>{
        //Get hashtag and save it into the array
        let data = snapshot.val()[key];
        data["hashtag"] = key;
        hashtagArray.push(data);

        //Get 5 first posts Id
        var postsIdRef = ref(db, 'hashtags/'+key);
        let queryPostsId = query(postsIdRef,orderByChild("timestamp"),limitToFirst(15));
        let q_posts = get(queryPostsId).then(snap=>{
          let postDataCompleted:any = [];
          if(snap.val()!=null){
            Object.keys(snap.val()).forEach((post_id)=>{
            //Get post data
              var postsRef = ref(db, 'posts/'+post_id);
              
              let post_data = get(postsRef).then(post=>{
               // console.log("post data",post.val())
                
               let arrayPost:any = [];
                if(post.val()!=null){
                    arrayPost = post.val()
                    arrayPost["post_id"] = post_id;
                   // console.log("todos son",post.val())
                   //this.posts.push(post.val());
                   
                }
                return arrayPost
                });

              
              post_data.then(post=>{
               
                postDataCompleted.push(post)
              })

            })

           
          }
          return postDataCompleted
        })

        q_posts.then(postByHashtags=>{
          console.log('info',postByHashtags)
         postsBucket.push(postByHashtags)
        })
       
       
      })
      console.log('mis datos',postsBucket)
      
      this.hashtags = hashtagArray;
      return postsBucket
      }
    })
/*
    this.posts.sort(
      (p1:any, p2:any) => 
      (p1.timestamp < p2.timestamp) ? 1 : (p1.timestamp > p2.timestamp) ? -1 : 0);



      return of(datos)
   

  }
  */
}
