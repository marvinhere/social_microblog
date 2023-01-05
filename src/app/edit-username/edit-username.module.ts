import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUsernamePageRoutingModule } from './edit-username-routing.module';

import { EditUsernamePage } from './edit-username.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUsernamePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditUsernamePage]
})
export class EditUsernamePageModule {}
