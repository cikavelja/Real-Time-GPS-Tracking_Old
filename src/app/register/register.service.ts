import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Register } from './register';
import { Observable } from 'rxjs';
import { CONFIGURATION } from '../app.constants';
// import 'rxjs/add/operator/catch'
// import 'rxjs/add/Observable/throw'


const API_URL = CONFIGURATION.baseUrls.server;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(entity: Register): Observable<Register> {
    return this.http.post<Register>(API_URL+"api/register/", entity, httpOptions);
  }

  // errorHandler(error:HttpErrorResponse){
  //   return Observable.throw(error.message)
  // }
}
