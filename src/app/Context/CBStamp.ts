import { CBImageStamp } from "./CBImageStamp"
import { CBTextStamp } from "./CBTextStamp";

export interface CBStampInterface {
    documentID: string;
    imageStampList: CBImageStamp[];
    textStampList: CBTextStamp[];
}

export class CBStamp {
    public documentID: string = '';
    public imageStampList: CBImageStamp[] = [];
    public textStampList: CBTextStamp[] = [];

    JSONToCB(jsonData: any) {
        this.documentID = jsonData.documentID;
        this.imageStampList = jsonData.imageStampList;
        this.textStampList = jsonData.textStampList;
    }

    CBTOJSON(CBSign: any) {
        const result: CBStampInterface = {} as CBStampInterface;
        result.documentID = CBSign.documentID;
        result.imageStampList = CBSign.imageStampList;
        result.textStampList = CBSign.textStampList;
        return result;
    }
}