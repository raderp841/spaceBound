import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DataServiceService } from '../data-service.service';
import { OriginalDataModel } from '../original-data-model';
import { ConvertedDataModel } from '../converted-data-model';
import { OrderModel } from '../order-model';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.css']
})
export class MainDisplayComponent implements OnInit, OnDestroy {

  isConvert: boolean = false;
  isConvertSub: Subscription;
  isGrouped: boolean = false;
  isGroupedSub: Subscription;
  originalData: OriginalDataModel[] = [];
  originalDataSub: Subscription;
  convertedData: ConvertedDataModel[] = [];
  convertedDataSub: Subscription;
  isOrders = false;
  isOrdersSub: Subscription;
  orders: OrderModel[] = [];
  ordersSub: Subscription;

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.isConvertSub = this.dataService.isConvertSub.subscribe(
      c => this.isConvert = c
    );

    this.originalDataSub = this.dataService.originalDataSub.subscribe(
      d => this.originalData = d
    );

    this.convertedDataSub = this.dataService.convertedDataSub.subscribe(
      d => this.convertedData = d
    );

    this.isOrdersSub = this.dataService.isOrdersSub.subscribe(
      o => this.isOrders = o
    );

    this.ordersSub = this.dataService.ordersSub.subscribe(
      o => this.orders = o
    );
  }

  onGroup() {
    this.dataService.groupData(this.isGrouped);
    this.isGrouped = !this.isGrouped;
  }

  onKeyUpSearch(input: HTMLInputElement) {
    let currentList = 0;
    if (this.isOrders) {
      currentList = 1;
    }
    else if (!this.isOrders && !this.isGrouped && this.isConvert) {
      currentList = 2;
    }
    else if (!this.isOrders && !this.isGrouped && !this.isConvert) {
      currentList = 3;
    }
    this.dataService.searchForCode(input.value, currentList);
  }

  ngOnDestroy() {
    this.isConvertSub.unsubscribe();
    this.convertedDataSub.unsubscribe();
    this.originalDataSub.unsubscribe();
    this.isOrdersSub.unsubscribe();
  }

}
