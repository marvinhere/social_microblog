import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomPostsPage } from './room-posts.page';

const routes: Routes = [
  {
    path: '',
    component: RoomPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomPostsPageRoutingModule {}
