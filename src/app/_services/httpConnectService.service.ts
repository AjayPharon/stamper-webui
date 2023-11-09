import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpConnectService {
  className: string = "HttpConnectService";
  constructor(
    private http: HttpClient,
  ) {
    const methodName = "constructor";
  }

  ConnectByPOSTFormData(urlPath: string, formData: FormData) {
    const methodName = "ConnectByPOST";
    const headerOptions = new HttpHeaders({
      // 'Accept': 'application/json, text/plain, */*',
      // 'Authorization': 'Bearer ' + ls_BearerToken
    });

    const options = {
      headers: headerOptions,
    };

    return this.http.post<any>(
      urlPath,
      formData,
      options,
    ).pipe(
      catchError(this.handleError)
    );
  }

  ConnectByPOST(urlPath: string, data: HttpParams) {
    const methodName = "ConnectByPOST";
    // const headerOptions = new HttpHeaders();
    // headerOptions.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // headerOptions.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    // headerOptions.append('Access-Control-Allow-Origin', '*');
    // headerOptions.append('Content-Type', 'application/x-www-form-urlencode');
    // //headerOptions.set('Accept', 'application/x-www-form-urlencoded');
    // // headerOptions.set('Content-Type', 'application/json');
    // headerOptions.append('Accept', 'application/x-www-form-urlencoded, application/json , text/plain, */*');


    const headerOptions = new HttpHeaders({
      //'Content-Type': 'application/x-www-form-urlencode',
      'Accept': 'application/x-www-form-urlencoded, application/json , text/plain, */*',
    });


    const options = {
      headers: headerOptions,
      //  withCredentials: false,
      //responseType: 'blob' as 'json'
    };

    //**Angular 7+ ถ้าจะส่งแบบ x-www-form-urlencode ให้ส่ง body เป็น HttpParams และไม่ต้อง set HttpHeader
    //จำเป็นต้องทำแบบนี้ไม่งั้น header มันจะเสีย

    //**http post ไม่ต้องสั่ง unsubscribe มันทำให้เองตอนได้ค่าคืนมาแล้ว**
    return this.http.post<any>(
      urlPath,
      data,
      options,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )
      // .subscribe(
      //   data => {
      //     console.log(" data = " + JSON.stringify(data));
      //   }
      // )
      ;

  }


  ConnectByPOST_JSON(urlPath: string, data: any) {
    const methodName = "ConnectByPOST_JSON";
    // const headerOptions = new HttpHeaders();
    // headerOptions.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // headerOptions.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    // headerOptions.append('Access-Control-Allow-Origin', '*');
    // headerOptions.append('Content-Type', 'application/json');
    // headerOptions.append('Accept', 'application/x-www-form-urlencoded, application/json , text/plain, */*');

    // let ls_BearerToken = this.credentialService.Obj.BearerKey;

    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Accept': 'application/x-www-form-urlencoded, application/json , text/plain, */*',
      // 'Authorization': 'Bearer ' + ls_BearerToken
    });

    const options = {
      headers: headerOptions,
      // withCredentials: false,
      // responseType: 'blob' as 'json'
    };

    //**Angular 7+ ถ้าจะส่งแบบ x-www-form-urlencode ให้ส่ง body เป็น HttpParams และไม่ต้อง set HttpHeader
    //จำเป็นต้องทำแบบนี้ไม่งั้น header มันจะเสีย

    //**http post ไม่ต้องสั่ง unsubscribe มันทำให้เองตอนได้ค่าคืนมาแล้ว**
    return this.http.post<any>(
      urlPath,
      // JSON.stringify(data),
      data,
      options,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )
      // .subscribe(
      //   data => {
      //     console.log(" data = " + JSON.stringify(data));
      //   }
      // )
      ;

  }

  ConnectByPOST_JSON_Bolb(urlPath: string, data: any) {
    const methodName = "ConnectByPOST_JSON_Bolb";
    // const headerOptions = new HttpHeaders();
    // headerOptions.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // headerOptions.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    // headerOptions.append('Access-Control-Allow-Origin', '*');
    // headerOptions.append('Content-Type', 'application/json');
    // headerOptions.append('Accept', 'application/x-www-form-urlencoded, application/json , text/plain, */*');


    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/x-www-form-urlencoded, application/json , text/plain, */*',
    });

    let options = {
      headers: headerOptions,
      withCredentials: false,
      responseType: 'blob' as 'json'
    };

    //**Angular 7+ ถ้าจะส่งแบบ x-www-form-urlencode ให้ส่ง body เป็น HttpParams และไม่ต้อง set HttpHeader
    //จำเป็นต้องทำแบบนี้ไม่งั้น header มันจะเสีย

    //**http post ไม่ต้องสั่ง unsubscribe มันทำให้เองตอนได้ค่าคืนมาแล้ว**
    return this.http.post<Response>(
      urlPath,
      // data.toString(),
      //JSON.stringify(data),
      data,
      //options,
      { headers: headerOptions, observe: 'response', responseType: 'blob' as 'json' },
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )
      // .subscribe(
      //   blobData => {
      //     this.logger.commonLogger(this.classname, methodName, "[BlobData]");
      //     let fileName = blobData.headers.get('Content-Disposition').split(';')[1].split('=')[1].replace(/\"/g, '')
      //     this.logger.commonLogger(this.classname, methodName, "Header Name = " + fileName);

      //     this.commonService.Convert_BlobToBase64(blobData.body).then(res => {
      //       let objectURL = '' + res; // res is base64 now
      //       //this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
      //       this.pdf = objectURL;


      //       const downloadLink = document.createElement("a");
      //       downloadLink.href = this.pdf;
      //       downloadLink.download = fileName;
      //       downloadLink.click();

      //       //ปิด BlockUI Loading
      //       this.commonService.UnblockDocument();
      //       this.logger.commonLogger(this.classname, methodName, "[END]");
      //     });
      //   }
      // )
      ;

  }

  ConnectByGET(urlPath: string, data: any) {
    const methodName = "ConnectByGET";
    // let GETPath = urlPath + "?" + data;
    let GETPath = urlPath
    console.log("GET Path = " + GETPath);
    // let ls_BearerToken = this.credentialService.Obj.BearerKey;

    const headerOptions = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/x-www-form-urlencoded, application/json , text/plain, */*',
      // 'Authorization': 'Bearer ' + ls_BearerToken

      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'origins': 'localhost:8080/*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    });

    const options = {
      headers: headerOptions,
      params: data,
      //withCredentials: false,
    };
    return this.http.get<any>(
      GETPath,
      options,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )

  }


  ConnectByGET_Bolb(urlPath: string, data: any) {
    const methodName = "ConnectByGET_Bolb";
    let GETPath = urlPath + "?" + data;
    console.log("GET Path = " + GETPath);

    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/x-www-form-urlencoded, application/json , text/plain, */*',
    });

    const options = {
      headers: headerOptions,
      withCredentials: false,
      responseType: 'blob' as 'json'
    };

    // this.http.get<any>(
    //   GETPath,
    //   options,
    // ).subscribe(data => {
    //   // console.log(" data = " + data);
    //   // console.log(" id = " + data.id);
    //   console.log(" data = " + JSON.stringify(data));
    //   return data;
    // });


    return this.http.get<any>(
      GETPath,
      options,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )
  }

  ConnectByGET_BYID(urlPath: string, data: any) {
    const methodName = "ConnectByGET";
    // let GETPath = urlPath + "?" + data;
    let GETPath = urlPath + data
    console.log("GET Path = " + GETPath);
    // let ls_BearerToken = this.credentialService.Obj.BearerKey;

    const headerOptions = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/x-www-form-urlencoded, application/json , text/plain, */*',
      // 'Authorization': 'Bearer ' + ls_BearerToken

      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'origins': 'localhost:8080/*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    });

    const options = {
      headers: headerOptions,

      //withCredentials: false,
    };
    return this.http.get<any>(
      GETPath,
      options,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )

  }

  private handleError(error: HttpErrorResponse) {
    const methodName = "handleError";
    console.log("handleError [START]");
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, `
        //  + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    //return throwError('Something bad happened; please try again later.');
    // return throwError(error.error);//return responese จาก webservice ไปให้

    //return HttpErrorResponse ไปให้ เพื่อเอาไปใช้ get Status Code ได้
    //สำหรับกรณีที่ response กลับมากับ error Status จะให้ไปดึง reponse ด้วย error.error ที่หน้าที่ใช้งานอีกทีแทน
    return throwError(error);

  }

}



