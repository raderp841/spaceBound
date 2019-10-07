export class ConvertedDataModel {
  id: number;
  currencyCode: string;
  currencyName: string;
  localAmount: number;
  amountInUSD: number;

  constructor(_id: number, _currencyCode: string, _currencyName: string, _localAmount: number, _amountInUSD: number) {
    this.id = _id;
    this.currencyCode = _currencyCode;
    this.currencyName = _currencyName;
    this.localAmount = _localAmount;
    this.amountInUSD = _amountInUSD;
  }
}
