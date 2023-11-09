import { CommonService } from '../_services/common.service';

export interface CBDocumentImageInterface {
  documentID:  string;
  imageBase64: string[];
}

export class CBDocumentImage {
  constructor(
    private commonService: CommonService
  ) {}
  public documentID: string = "";
  public imageBase64: string[] = [];

  JSONToCB(jsonData : any) {
    for(let data of jsonData) {
      this.documentID = data.documentID;
      for (let imageData of data.imageBase64) {
        this.imageBase64.push(this.commonService.convertToBase64(imageData));
      }
    }
    
  }

  CBTOJSON(CBDocumentImage : any){
		const result: CBDocumentImageInterface = {} as CBDocumentImageInterface;
    result.documentID = CBDocumentImage.documentID;
    for(let image of CBDocumentImage.imageBase64) {
      result.imageBase64.push(this.commonService.convertToBase64(CBDocumentImage.imageBase64));
    }
    return result;
  }
}

