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
  isOrders: boolean = false;
  isOrdersSub: Subscription;

  constructor(private dataService: DataServiceService) { }
  
  ngOnInit() {
    this.convertSub = this.dataService.isConvertSub.subscribe(
      c => this.isConvert = c
    );
    this.isOrdersSub = this.dataService.isOrdersSub.subscribe(
      o => this.isOrders = o
    );
  }

  onConvert() {
    this.dataService.getConvertedData();
    this.dataService.switchToConvert();
    this.onHideOrders;
  }

  onOriginalData() {
    this.dataService.switchToUnconvert();
    this.onHideOrders();
  }

  ngOnDestroy() {
    this.convertSub.unsubscribe();
    this.isOrdersSub.unsubscribe();
  }

  onFetchData() {
    this.dataService.getOriginalData();
    this.onHideOrders();
  }

  onShowOrders() {
    this.dataService.switchToOrders();
    this.dataService.getOrdersHttp();
  }

  onHideOrders() {
    this.dataService.switchFromOrders();
  }

  onClearData() {
    this.dataService.clearData();
  }
}
