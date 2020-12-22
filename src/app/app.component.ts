import { Component } from '@angular/core';
import { ShareDataService } from './services/share-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private shareDataService: ShareDataService) {
    this.shareDataService.setDummyUser();
  }
  

}
