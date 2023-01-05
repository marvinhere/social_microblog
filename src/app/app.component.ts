import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private firebase:FirebaseService, private settings:SettingsService) {
    
    this.firebase.init();
  }

  async ngOnInit(){
    //await this.settings.setLocation();
  }

}
