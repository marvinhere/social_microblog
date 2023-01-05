import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
//import { Filesystem, Directory } from '@capacitor/filesystem';
//import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private sanitizer:DomSanitizer) { }

  public async takePhoto() {
  // Take a photo
  const capturedPhoto:any = await Camera.getPhoto({
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    quality: 100
  });
  //console.log(capturedPhoto)
  //return capturedPhoto.webPath
  //return this.sanitizer.bypassSecurityTrustStyle(capturedPhoto.webPath);
  return this.sanitizer.bypassSecurityTrustResourceUrl(capturedPhoto && (capturedPhoto.dataUrl))
}
}
