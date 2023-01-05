import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReactionsPage } from './reactions.page';

const routes: Routes = [
  {
    path: '',
    component: ReactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReactionsPageRoutingModule {}
