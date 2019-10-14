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
      //this.http.get<OrderModel[]>('https://www.peterlrader.com/api/orders').
      this.http.get<OrderModel[]>('https://localhost:44357/api/orders').
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

  switchFromOrders() {
    this.isOrders = false;
    this.isOrdersSub.next(this.isOrders);
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

  searchForCode(searchInput: string, currentList: number) {
    searchInput = searchInput.toLowerCase();
    if (currentList === 1) { //orders
      let orderCopy = this.orders.slice();
      let matchedOrders: OrderModel[] = [];
      orderCopy.forEach(o => {
        if (o.currencyCode.toLowerCase().includes(searchInput)) {
          matchedOrders.push(o);
        }
      });
      console.log(searchInput);
      this.ordersSub.next(matchedOrders);
    }
    else if (currentList === 2) { //converted
      let convertCopy = this.convertedData.slice();
      let matchedCD: ConvertedDataModel[] = [];
      convertCopy.forEach(cd => {
        if (cd.currencyCode.toLowerCase().includes(searchInput) || cd.currencyName.toLowerCase().includes(searchInput)) {
          matchedCD.push(cd);
        }
      });
      this.convertedDataSub.next(matchedCD);
    }
    else if (currentList === 3) { //original data
      let originalCopy = this.originalData.slice();
      let matchedOG: OriginalDataModel[] = [];
      originalCopy.forEach(og => {
        if (og.currencyCode.toLowerCase().includes(searchInput) || og.currencyName.toLowerCase().includes(searchInput)) {
          matchedOG.push(og);
        }
      });
      this.originalDataSub.next(matchedOG);
    }
  }

  clearData() {
    this.orders.length = 0;
    this.convertedData.length = 0;
    this.convertedDataGrouped.length = 0;
    this.originalData.length = 0;
  }

  updateExchangeRates() {
    this.getExchangeRatesHTTP();
  }

  getExchangeRatesHTTP() {
    this.http.post<OriginalDataModel[]>('https://localhost:44357/api/currencies', '')
      .subscribe(res => {
        this.originalData = res;
        this.originalDataSub.next(this.originalData);
        console.log(res);
      });
  }

  groupData(isGrouped: boolean) {
    if (isGrouped) {
      this.convertedData.length = 0;
      this.convertedData = this.convertData(this.originalData, this.orders);
      this.convertedDataSub.next(this.convertedData);
      
    }
    else {
      let conD = this.convertedData.slice();
      let conDG: ConvertedDataModel[] = []
      conD.forEach(d => {
        if (conDG.some(cd => d.currencyCode === cd.currencyCode)) {
          for (let i = 0; i < conDG.length; i++) {
            if (conDG[i].currencyCode === d.currencyCode) {
              conDG[i].amountInUSD += d.amountInUSD;
              conDG[i].localAmount += d.localAmount;
              break;
            }
          }
        }
        else {
          conDG.push(d);
        }
      });
      conDG.sort((a, b) => (a.amountInUSD < b.amountInUSD) ? 1 : -1);
      this.convertedDataSub.next(conDG);
      console.log(conDG);
    }
  }
}
