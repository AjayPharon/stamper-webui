import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  ConnectByGET(urlPath: string) {
    const methodName = "ConnectByGET";
    let GETPath = urlPath
    console.log("GET Path = " + GETPath);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'origins': 'localhost:8080/*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    });

    const options = {
      headers: headerOptions
    };
    return this.http.get<any>(
      GETPath,
      options,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      )

  }
  // getData(url: string) : Observable<any> {
  //   const headerOptions = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'origins': 'localhost:8888/*',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  //   });

  //   const options = {
  //     headers: headerOptions
  //   };

  //   return this.http.get<any>(url,options)
  //   // return this.http.get<any>(url)
  // }

  private handleError(error: HttpErrorResponse) {
    const methodName = "handleError";
    console.log("handleError [START]");
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, `
      );
    }
    return throwError(error);

  }
}
