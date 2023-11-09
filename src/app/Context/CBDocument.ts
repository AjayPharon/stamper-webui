export interface CBDocumentInterface {
    filename: string;
  }
  
  export class CBDocumentImage {
    constructor(
    ) {}
  
    JSONToCB(jsonData : any) {
    }
  
    CBTOJSON(CBScanImage : any){
        const result: CBDocumentInterface = {} as CBDocumentInterface;
      return result;
    }
  }