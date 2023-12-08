import { CBImage } from "./CBImage";
import { CBLabel } from "./CBLabel";
import { CBText } from "./CBText";

export interface CBCustomStampInterface {
  enableBorder: boolean;
  borderColor: string;
  textStampList: CBText[];
  imageStampList: CBImage[];
  labelStampList: CBLabel[];
}

export class CBCustomStamp {
  public enableBorder: boolean = false;
  public borderColor: string = "#000000";
  public textStampList: CBText[] = [];
  public imageStampList: CBImage[] = [];
  public labelStampList: CBLabel[] = [];

  JSONToCB(jsonData: any) {
    this.enableBorder = jsonData.enableBorder;
    this.borderColor = jsonData.borderColor;
    this.textStampList = jsonData.textStampList;
    this.imageStampList = jsonData.imageStampList;
    this.labelStampList = jsonData.labelStampList;
  }

  CBTOJSON(CBStamp: any) {
    const result: CBCustomStampInterface = {} as CBCustomStampInterface;
    result.enableBorder = CBStamp.enableBorder;
    result.borderColor = CBStamp.borderColor;
    result.textStampList = CBStamp.textStampList;
    result.imageStampList = CBStamp.imageStampList;
    result.labelStampList = CBStamp.labelStampList;
    return result;
  }
}
