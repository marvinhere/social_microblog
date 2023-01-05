import { Injectable } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Observable, of } from 'rxjs';


var geohash = require('ngeohash');

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  geohashData:any;
  constructor(private geolocation:Geolocation) { }

  setLocation():Observable<any>{

    let geohashData = this.geolocation.getCurrentPosition().then(async (resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      return await geohash.encode(resp.coords.latitude, resp.coords.longitude,4)
     
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
    return of(geohashData);
    //await this.wait(2000);
    
  }

  wait(milliseconds:number){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }

  getLocation(){
    return this.geohashData;
  }
}
