import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  error:any = false;
  loginForm:any;

  constructor(public authService:AuthService,private loadingCtrl: LoadingController,private userService:UserService,private _builder:FormBuilder, private firebaseService:FirebaseService,private router:Router) {

    this.loginForm = this._builder.group({
      email: ['',Validators.required],
      password:['',Validators.required]
    });
   }

  ngOnInit() {
  }

  login(loginForm:any){
    this.showLoading();
    this.error = false;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        this.router.navigate(["/"])
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.error = errorMessage;
      });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 6000,
    });

    loading.present();
  }


}
