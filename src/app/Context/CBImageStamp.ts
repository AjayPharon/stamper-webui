export interface CBImageStampInterface {
  x: number;
  y: number;
  signContent: string;
  signWidth: number;
  signHeight: number;
  pageNumber: number;
  documentID: string;
  textStamp: string;
}

export class CBImageStamp {
  constructor() { }
  public signContent: string = '';
  public signWidth: number = -1;
  public signHeight: number = -1;
  public x: number = -1;
  public y: number = -1;
  public pageNumber: number = -1;
  public documentID: string = '';
  public textStamp: string = '';

  JSONToCB(jsonData: any) {
    this.signContent = jsonData.signContent;
    this.signWidth = jsonData.signWidth;
    this.signHeight = jsonData.signHeight;
    this.x = jsonData.x;
    this.y = jsonData.y;
    this.pageNumber = jsonData.pageNumber;
    this.documentID = jsonData.documentID;
    this.textStamp = jsonData.textStamp;
  }

  CBTOJSON(CBSign: any) {
    const result: CBImageStampInterface = {} as CBImageStampInterface;
    result.signContent = CBSign.signContent;
    result.signWidth = CBSign.signWidth;
    result.signHeight = CBSign.signHeight;
    result.x = CBSign.x;
    result.y = CBSign.y;
    result.pageNumber = CBSign.pageNumber;
    result.documentID = CBSign.documentID;
    result.textStamp = CBSign.textStamp;
    return result;
  }
}
