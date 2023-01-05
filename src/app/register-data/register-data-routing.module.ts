import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterDataPage } from './register-data.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterDataPageRoutingModule {}
