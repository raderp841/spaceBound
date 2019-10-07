import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-display',
  templateUrl: './side-display.component.html',
  styleUrls: ['./side-display.component.css']
})
export class SideDisplayComponent implements OnInit, OnDestroy {

  isConvert: boolean = false;
  convertSub: Subscription;
  constructor(private dataService: DataServiceService) { }
  
  ngOnInit() {
    this.convertSub = this.dataService.isConvertSub.subscribe(
      c => this.isConvert = c
    );
  }

  onConvert() {
    this.dataService.getConvertedData();
    this.dataService.switchToConvert();
  }

  onOriginalData() {
    this.dataService.switchToUnconvert();
  }

  ngOnDestroy() {
    this.convertSub.unsubscribe();
  }

  onFetchData() {
    this.dataService.getOriginalData();
  }
}
