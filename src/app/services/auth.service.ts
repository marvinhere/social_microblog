import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged, getRedirectResult} from 'firebase/auth';
import { FirebaseError, initializeApp} from 'firebase/app';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uid:any = null;

  constructor(private router:Router,private firebaseService:FirebaseService) { }

  GoogleAuth(){
    
    return this.AuthLogin(new GoogleAuthProvider());
  }


  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    provider.addScope('profile');
    provider.addScope('email');
/*
    this.firebaseService.app.signInWithPopup(provider).then((result:any) => {
      console.log('You have been successfully logged in!');
      console.log(result.user);
      this.router.navigate(["/register-data"]);
    })
    .catch((error:FirebaseError) => {
      console.log(error);
    });
    */
  
    return signInWithPopup(getAuth(),provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
        console.log(result.user);
        this.router.navigate(["/register-data"]);
      })
      .catch((error) => {
        console.log(error);
      });

      


      
  }


  async getUserState(){
    function wait(){
      return new Promise(resolve=>{
        setTimeout(resolve, 1000);
      })
    }

    let auth = getAuth();
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
       this.uid = user.uid;
        // ...
        console.log(this.uid)
      } else{
        this.uid = null;
      }
    });
    await wait()
  }

  getUID(){
    return this.uid;
  }

  

  
 
}
