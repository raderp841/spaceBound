import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OriginalDataModel } from './original-data-model';
import { ConvertedDataModel } from './converted-data-model';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  originalData: OriginalDataModel[] = [
    new OriginalDataModel(1, 'United States Dollar', 'USD', 1, '12/12/1212'),
    new OriginalDataModel(2, 'European Euro', 'ERO', 1.342, '12/12/1212'),
    new OriginalDataModel(3, 'Philipino Peso', 'PHP', 43.2352, '12/12/1212'),
    new OriginalDataModel(4, 'Canadian Dollar', 'CND', 1.22, '12/12/1212'),
  ];

  convertedData: ConvertedDataModel[] = [
    new ConvertedDataModel(1, 'USD', 'United States Dollar', 4212.23, 4212.23),
    new ConvertedDataModel(2, 'CND', 'Canadian Dollar', 45.32, 38.22),
    new ConvertedDataModel(3, 'PHP', 'Philipino Peso', 10534.85, 260.36),
    new ConvertedDataModel(4, 'ERO', 'European Euro', 847.41, 755.03),
  ];

  isConvert: boolean = false;
  isConvertSub: Subject<boolean> = new Subject<boolean>();
  originalDataSub: Subject<OriginalDataModel[]> = new Subject<OriginalDataModel[]>();
  convertedDataSub: Subject<ConvertedDataModel[]> = new Subject<ConvertedDataModel[]>();
  constructor() { }

  switchToConvert() {
    this.isConvert = true;
    this.isConvertSub.next(this.isConvert);
  }

  switchToUnconvert() {
    this.isConvert = false;
    this.isConvertSub.next(this.isConvert);
  }

  getOriginalData() {
    this.originalDataSub.next(this.originalData);
    console.log(this.originalData);
  }

  getConvertedData() {
    this.convertedDataSub.next(this.convertedData);
    console.log(this.convertedData);
  }
  
}
