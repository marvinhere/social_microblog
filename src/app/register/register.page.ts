import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { equalTo, get, getDatabase, orderByChild, query, ref } from 'firebase/database';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm:any;
  error:any = false;
  loading:boolean = false;

  constructor(private alertController: AlertController,private loadingCtrl: LoadingController,private userService:UserService,private _builder:FormBuilder, private firebaseService:FirebaseService) { 
    this.registerForm = this._builder.group({
      username: ['',Validators.required],
      email: ['',Validators.required],
      password:['',Validators.required]
    });
  }

  ngOnInit() {

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Username already exist',
      buttons: ['OK'],
    });

    await alert.present();
  }
  createUser(registerForm:any){
    this.loading = true;
    this.error = false;
    const auth = getAuth();
    let db = getDatabase(this.firebaseService.app);

    var referencia = ref(db, 'users');

    let newRef = query(referencia,orderByChild("username"),equalTo(registerForm.username));

    get(newRef).then(snapshot=>{
      if(snapshot.val()!=null){
        //user exists
        this.presentAlert
        this.error = "Username is already exist";
    
        this.loading = false;
      }else{
        this.showLoading();
        createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            this.userService.registerData(registerForm.username,user.photoURL,"users/"+user.uid);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            this.error = error.message;
            // ..
            this.loading = false;
          });
       
      }

    })
    
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 6000,
    });

    loading.present();
  }

}
