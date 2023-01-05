import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { PhotoService } from '../services/photo.service';
import { ReactionsService } from '../services/reactions.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.page.html',
  styleUrls: ['./reactions.page.scss'],
})
export class ReactionsPage implements OnInit {
  photo:SafeResourceUrl = false;
  reactions:any = [];
  loading:boolean = false;

  react_selected:any = {
    img:'https://i.pinimg.com/564x/7f/35/b7/7f35b78226adb0c53829250d3a5024ea.jpg'
  }

  constructor(private nav:NavController,private authService:AuthService,private reactionService:ReactionsService,private photoService:PhotoService,private alertController: AlertController,private firebaseService:FirebaseService) {}

  async ngOnInit() {
    this.photo = false;
    await this.authService.getUserState();
    this.getReactions();
  }

  getReactions(){
    this.reactions = this.reactionService.userReactions;
    /*
    this.reactionService.getReactions().subscribe(data=>{
      data.then((data2:any)=>{
        this.reactions = data2;
        this.reactionService.userReactions = data2;
      });
    })
    */
    
  }

  async deleteAlert(reaction:any) {
    const alert = await this.alertController.create({
      header: 'Delete',
      subHeader: 'Do you want to delete this reaction?',
      message: '<img class="img-reaction" src="'+reaction.img+'" style="border-radius: 100% !important;width:50px;height:50px;object-fit:cover;">',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deleteReaction(reaction);
            //this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });

    await alert.present();
  }

  deleteReaction(reaction:any){
    this.loading = true;
    
    let db = getDatabase(this.firebaseService.app);
     //save and redirect
 
      let updates:any = {};
      updates["users/"+this.authService.getUID()+"/reactions/"+reaction.reaction_id] = null;
      
      update(ref(db),updates);
        // ...
      this.nav.back();
    
  }

  async takePhoto(){
    let photo = await this.photoService.takePhoto().then((data:any)=>{
      
      this.photo = data["changingThisBreaksApplicationSecurity"];
    });
    
  }

  saveReaction(){
    this.loading = true;
    this.reactionService.saveReaction(this.photo);
  }

   wait(mil:number){
    return new Promise(resolve=>{
      setTimeout(resolve, mil);
    })
  }

}
