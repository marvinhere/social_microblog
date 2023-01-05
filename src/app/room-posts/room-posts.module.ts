import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomPostsPageRoutingModule } from './room-posts-routing.module';

import { RoomPostsPage } from './room-posts.page';
import { PostComponentModule } from '../components/post/post.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomPostsPageRoutingModule,
    PostComponentModule
  ],
  declarations: [RoomPostsPage]
})
export class RoomPostsPageModule {}
