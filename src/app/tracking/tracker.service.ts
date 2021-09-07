import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONFIGURATION } from '../app.constants';
import { gpsPosition } from './gpsPosition';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json',
    'Authorization':'Bearer ' + localStorage.getItem("access_token"),
    
  })
};
@Injectable({
  providedIn: 'root'
})

export class TrackerService {

  constructor(private http: HttpClient) { }

  addPosition(entity: gpsPosition, token: string): Observable<gpsPosition> {

    httpOptions.headers.set('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    httpOptions.headers.set('Content-Type', 'application/json');
    //this.presentAlert(httpOptions.headers.get("Authorization"))

    return this.http.post<gpsPosition>(CONFIGURATION.baseUrls.server + "api/GetPosition", entity, httpOptions);
  }
  // async presentAlert(err:any) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Error',
  //     subHeader: 'Subtitle',
  //     message: err,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }
}