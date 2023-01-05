import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /*
  * Guardar datos principales como hashtags, feed
  */

  saveLocation(location:string){
    localStorage.setItem("location",location);
  }

  getLocation(){
    return localStorage.getItem("location") || null;
  }

  saveAppSettings(){

  }

  savePopularHashtags(hashtags:Array<any>){
    let data = {
      hashtags:hashtags,
      time:Date.now()
    }

    localStorage.setItem("hashtags",JSON.stringify(data))
  }

  saveFeed(posts:Array<any>){
    let data = {
      posts:posts,
      time:Date.now()
    }
    localStorage.setItem("feed",JSON.stringify(data))
  }

  getLocalFeed(){
    let data:any = localStorage.getItem("feed");
    return JSON.parse(data) || null;
  }

  getLocalPopularHashtags(){
    let data:any = localStorage.getItem("hashtags");
    return JSON.parse(data) || null;
  }

  needToUpdate(lastTime:any,dataName:any):boolean{
    function getMinDiff(startDate:any, endDate:any) {
      const msInMinute = 60 * 1000;
    
      return Math.round(
        Math.abs(endDate - startDate) / msInMinute
      );
    }

    let times:any = environment.dataStorageUpdateTime;

   
    if(getMinDiff(lastTime,Date.now())>times[dataName]){
      return true;
    }
    return false;

    
  }

  saveRooms(rooms:Array<any>){
    let data = {
      rooms:rooms,
      time: Date.now()
    }
    localStorage.setItem("rooms",JSON.stringify(data));
  }

  getRooms(){
    let data:any = localStorage.getItem("rooms")
    return JSON.parse(data) || null;
  }
}
