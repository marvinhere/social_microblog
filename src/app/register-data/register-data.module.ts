import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterDataPageRoutingModule } from './register-data-routing.module';

import { RegisterDataPage } from './register-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterDataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterDataPage]
})
export class RegisterDataPageModule {}
