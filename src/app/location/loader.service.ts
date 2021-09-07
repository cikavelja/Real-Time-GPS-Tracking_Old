import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.watchPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude, speed:(resp.coords.speed) ? resp.coords.speed.toString() : "0"});
        },
        err => {
          reject(err);
        });
    });

  }
}
