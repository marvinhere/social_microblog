import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReactionsPageRoutingModule } from './reactions-routing.module';

import { ReactionsPage } from './reactions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactionsPageRoutingModule
  ],
  declarations: [ReactionsPage]
})
export class ReactionsPageModule {}
