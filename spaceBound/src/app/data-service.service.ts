import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OriginalDataModel } from './original-data-model';
import { ConvertedDataModel } from './converted-data-model';
import { HttpClient } from '@angular/common/http';
import { OrderModel } from './order-model';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  originalData: OriginalDataModel[] = [];
  convertedData: ConvertedDataModel[] = [];
  convertedDataGrouped: ConvertedDataModel[] = [];

  isConvert: boolean = false;
  isConvertSub: Subject<boolean> = new Subject<boolean>();
  isOrders: boolean = false;
  isOrdersSub: Subject<boolean> = new Subject<boolean>();
  originalDataSub: Subject<OriginalDataModel[]> = new Subject<OriginalDataModel[]>();
  convertedDataSub: Subject<ConvertedDataModel[]> = new Subject<ConvertedDataModel[]>();
  orders: OrderModel[] = [];
  ordersSub: Subject<OrderModel[]> = new Subject<OrderModel[]>();

  constructor(private http: HttpClient) { }

  switchToConvert() {
    this.isConvert = true;
    this.isConvertSub.next(this.isConvert);
  }

  switchToUnconvert() {
    this.isConvert = false;
    this.isConvertSub.next(this.isConvert);
  }

  getOriginalData() {
    this.getOriginalDataHttp();
  }

  getConvertedData() {

    if (this.orders = []) {
      this.http.get<OrderModel[]>('https://www.peterlrader.com/api/orders').
        subscribe(res => {
          this.orders = res;
          this.ordersSub.next(this.orders);
          this.convertedData = this.convertData(this.originalData, this.orders);
          this.convertedDataSub.next(this.convertedData);
          console.log('new orders');
        });
    }
    else {
      this.convertedData = this.convertData(this.originalData, this.orders);
      this.convertedDataSub.next(this.convertedData);
      console.log('orders already loaded');
    }
    
  }

  switchToOrders() {
    this.isOrders = true;
    this.isOrdersSub.next(this.isOrders);
    console.log('switch orders');
  }

  getOrdersHttp() {
    //this.http.get<OrderModel[]>('https://www.peterlrader.com/api/orders').   //aws server
    this.http.get<OrderModel[]>('https://localhost:44357/api/orders').         // local
      subscribe(res => {
        this.orders = res;
        this.ordersSub.next(this.orders);
      });
  }

  getOriginalDataHttp() {
    //this.http.get<OriginalDataModel[]>('https://www.peterlrader.com/api/currencies')  //aws server
    this.http.get<OriginalDataModel[]>('https://localhost:44357/api/currencies')  // local
      .subscribe((res) => {
        this.originalData = res;
        this.originalDataSub.next(this.originalData);
      });
  }

  convertData(originalData: OriginalDataModel[], orders: OrderModel[]) {
    let convertedData: ConvertedDataModel[] = [];
    orders.forEach(order => {
      let convert: ConvertedDataModel = new ConvertedDataModel(-1, '','',0,0);
      convert.currencyCode = order.currencyCode;
      convert.currencyName = originalData.find(og => og.currencyCode == order.currencyCode).currencyName;
      convert.localAmount = order.paymentAmount;
      convert.amountInUSD = (order.paymentAmount / (originalData.find(og => og.currencyCode == order.currencyCode)).exchangeRate);
      convertedData.push(convert);
    });
    return convertedData;
  }

  groupData(isGrouped: boolean) {
    if (isGrouped) {
      this.getOriginalData();
    }
    else {
      console.log('logic to group');
      this.convertedData.forEach(d => {
        if (this.convertedDataGrouped.some(cd => d.currencyCode === cd.currencyCode)) {
          for (let i = 0; i < this.convertedDataGrouped.length; i++) {
            if (this.convertedDataGrouped[i].currencyCode === d.currencyCode) {
              this.convertedDataGrouped[i].amountInUSD += d.amountInUSD;
              this.convertedDataGrouped[i].localAmount += d.localAmount;
              break;
            }
          }
        }
        else {
          this.convertedDataGrouped.push(d);
        }
      });
      this.convertedDataGrouped.sort((a, b) => (a.amountInUSD < b.amountInUSD) ? 1 : -1);
      this.convertedDataSub.next(this.convertedDataGrouped);
    }
  }
}
