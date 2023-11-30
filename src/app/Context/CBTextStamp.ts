export interface CBTextStampInterface {
    x: number;
    y: number;
    pageNumber: number;
    documentID: string;
    message: string;
    isVisible: boolean;
}

export class CBTextStamp {
    constructor() { }
    public x: number = -1;
    public y: number = -1;
    public pageNumber: number = -1;
    public documentID: string = '';
    public message: string = '';
    public isVisible: boolean = false;

    JSONToCB(jsonData: any) {
        this.x = jsonData.x;
        this.y = jsonData.y;
        this.pageNumber = jsonData.pageNumber;
        this.documentID = jsonData.documentID;
        this.message = jsonData.message;
    }

    CBTOJSON(CBSign: any) {
        const result: CBTextStampInterface = {} as CBTextStampInterface;
        result.x = CBSign.x;
        result.y = CBSign.y;
        result.pageNumber = CBSign.pageNumber;
        result.documentID = CBSign.documentID;
        result.message = CBSign.message;
        return result;
    }
}
