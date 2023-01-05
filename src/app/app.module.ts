import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PostComponentModule } from './components/post/post.component.module';
import { environment } from 'src/environments/environment.prod';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
//import { Geolocation } from '@ionic-native/geolocation/ngx';  



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
   ReactiveFormsModule,FormsModule],
  providers: [Geolocation,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
