import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUsernamePage } from './edit-username.page';

const routes: Routes = [
  {
    path: '',
    component: EditUsernamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUsernamePageRoutingModule {}
