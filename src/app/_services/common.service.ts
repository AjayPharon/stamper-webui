import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  convertToBase64(imageBase64: string) {
    return 'data:image/jpeg;base64,'+imageBase64;
  }
}
