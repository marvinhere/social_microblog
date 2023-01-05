import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { Observable, of } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user:any;

  constructor(private router:Router,private firebaseService:FirebaseService) { }

  registerData(username:string,img:any,referencia:any){
    
    let data = {
      username:username,
      img:img
    };

    let db = getDatabase(this.firebaseService.app);

    var dbRef = ref(db, referencia);

    set(dbRef,data).then(result=>{
      this.router.navigate(["/home"]);
    }).catch(err=>{

    });


  }

  userData(uid:any):Observable<any>{
    let db = getDatabase(this.firebaseService.app);

    var dbRef = ref(db, "users/"+uid);

    let user =  get(dbRef).then(snapshot=>{
      return snapshot.val();
    })

    return of(user);
  }
}
