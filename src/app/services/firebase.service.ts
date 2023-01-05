import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public app:any;

  constructor() { }

  init(){
    this.app = initializeApp(environment.firebaseConfig);
  }
}
