import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { HomePageModule } from 'src/app/home/home.module';
import { ProfilePageModule } from 'src/app/profile/profile.module';
import { PostComponent } from './post.component';


@NgModule({
  imports: [
   IonicModule,
   CommonModule
  ],
  declarations: [PostComponent],
  exports:[PostComponent]
})
export class PostComponentModule {}
