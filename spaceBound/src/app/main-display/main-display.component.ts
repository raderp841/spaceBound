import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DataServiceService } from '../data-service.service';
import { OriginalDataModel } from '../original-data-model';
import { ConvertedDataModel } from '../converted-data-model';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.css']
})
export class MainDisplayComponent implements OnInit, OnDestroy {

  isConvert: boolean = false;
  isConvertSub: Subscription;
  originalData: OriginalDataModel[] = [];
  originalDataSub: Subscription;
  convertedData: ConvertedDataModel[] = [];
  convertedDataSub: Subscription;

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
  }

  ngOnDestroy() {
    this.isConvertSub.unsubscribe();
    this.convertedDataSub.unsubscribe();
    this.originalDataSub.unsubscribe();
  }

}
