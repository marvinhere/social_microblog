import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { equalTo, get, getDatabase, orderByChild, query, ref, update } from 'firebase/database';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-edit-username',
  templateUrl: './edit-username.page.html',
  styleUrls: ['./edit-username.page.scss'],
})
export class EditUsernamePage implements OnInit {
  usernameForm:any;
  loading:boolean = false;
  error:boolean = false;
  uid:any;
  username:any = "test"
  constructor(private nav:NavController,private firebaseService:FirebaseService,private _builder: FormBuilder) { 

    this.usernameForm = this._builder.group({
      username: ['',Validators.required]
    });
  }

  ngOnInit() {

    let auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }


  save(dataForm:any){
    
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
        var userRef = ref(db, 'users/'+this.uid);
        let data = {
          username:dataForm.username
        };

        update(userRef,data);
        this.nav.back();
      }

    })
    
   
  }


}
