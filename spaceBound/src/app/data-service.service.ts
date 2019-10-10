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


  originalData: OriginalDataModel[] = [
  ];

  convertedData: ConvertedDataModel[] = [
    new ConvertedDataModel(1, 'USD', 'United States Dollar', 4212.23, 4212.23),
    new ConvertedDataModel(2, 'CND', 'Canadian Dollar', 45.32, 38.22),
    new ConvertedDataModel(3, 'PHP', 'Philipino Peso', 10534.85, 260.36),
    new ConvertedDataModel(4, 'ERO', 'European Euro', 847.41, 755.03),
  ];

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
    this.convertedData = this.convertData(this.originalData, this.orders);
    this.convertedDataSub.next(this.convertedData);
  }

  switchToOrders() {
    this.isOrders = true;
    this.isOrdersSub.next(this.isOrders);
    console.log('switch orders');
  }

  getOrdersHttp() {
    this.http.get<OrderModel[]>('https://www.peterlrader.com/api/orders').
      subscribe(res => {
        this.orders = res;
        console.log('plr');
        this.ordersSub.next(this.orders);
      });
  }

  getOriginalDataHttp() {
    this.http.get<OriginalDataModel[]>('https://www.peterlrader/api/currencies')
      .subscribe((res) => {
        this.originalData = res;
        this.originalDataSub.next(this.originalData);
        console.log(this.originalData);
      });
  }

  convertData(originalData: OriginalDataModel[], orders: OrderModel[]) {
    let convertedData: ConvertedDataModel[] = [];
    orders.forEach(order => {
      let convert: ConvertedDataModel = null;
      convert.currencyCode = order.currencyCode;
      convert.currencyName = originalData.find(og => og.currencyCode == order.currencyCode).currencyName;
      convert.localAmount = order.paymentAmount;
      convert.amountInUSD = (order.paymentAmount * (originalData.find(og => og.currencyCode == order.currencyCode)).exchangeRate);
      convertedData.push(convert);
    });
    return convertedData;
  }
}
