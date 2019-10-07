export class OriginalDataModel {
  id: number;
  currencyName: string;
  currencyCode: string;
  exchangeRate: number;
  lastUpdatedTime: string;

  constructor(_id: number, _currencyName: string, _currencyCode: string, _exchangeRate: number, _lastUpdatedTime: string) {
    this.id = _id;
    this.currencyName = _currencyName;
    this.currencyCode = _currencyCode;
    this.exchangeRate = _exchangeRate;
    this.lastUpdatedTime = _lastUpdatedTime;
  }
}
