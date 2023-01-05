import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { getDatabase, ref, set, onValue, orderByChild,query, equalTo, get } from "firebase/database";


import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-register-data',
  templateUrl: './register-data.page.html',
  styleUrls: ['./register-data.page.scss'],
})
export class RegisterDataPage implements OnInit {

  usernameForm:any;
  error:boolean = false;
  loading:boolean = false;
  
  constructor(private _builder: FormBuilder,private userService:UserService,private firebaseService:FirebaseService,private router:Router) { 
    this.usernameForm = this._builder.group({
      username: ['',Validators.required]
    });

  }

  ngOnInit() {
  }


  save(dataForm:any){
    let auth = getAuth();
    
    this.loading = true;
    this.error = false;
    //Validate if username is already in use
    let db = getDatabase(this.firebaseService.app);

    var referencia = ref(db, 'users');

    let newRef = query(referencia,orderByChild("username"),equalTo(dataForm.username));

    get(newRef).then(snapshot=>{
      if(snapshot.val()!=null){
        //user exists
        this.error = true;
        this.loading = false;
      }else{
        //save and redirect
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            this.userService.registerData(dataForm.username,user.photoURL,"users/"+uid);
            // ...
          } else {
            // User is signed out
            // ...
          }
        });

       
      }

    })
    
   
  }

}
