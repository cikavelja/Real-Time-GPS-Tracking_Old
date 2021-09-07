import { Component, OnInit } from '@angular/core';
import { polyline } from 'leaflet';
import { GPSData } from '../notify/GPSData';
import { TestService } from './test.service';

declare let L;
declare var ol: any;
//declare let map;

const polilines = [];
@Component({
  selector: 'rtgpsang-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {
  // public variables declaration  
  public currentMessage: GPSData;
  //public allMessages: MSGData;  
  public lat: string;
  public lon: string;
  latitude: number = 18.5204;
  longitude: number = 73.8567;

  public map: any;


  public canSendMessage: Boolean;

  // constructor of the class to inject the service in the constuctor and call events.  
  constructor(private _rtgpsService: TestService) {
    // this can subscribe for events  
    this.subscribeToEvents();
    // this can check for conenction exist or not.  
    this.canSendMessage = _rtgpsService.connectionExists;
    // this method call every second to tick and respone tansfered to client.  
    // setInterval(() => {  
    //     this._rtgpsService.sendTime();  
    // }, 1000);  
  }
  private subscribeToEvents(): void {
    // if connection exists it can call of method.  
    this._rtgpsService.connectionEstablished.subscribe(() => {
      this.canSendMessage = true;
    });
    // finally our service method to call when response received from server event and transfer response to some variable to be shown on the browser.  
    this._rtgpsService.messageReceived.subscribe((data: any) => {
      //debugger;
      let newdata = new GPSData();
      newdata.lat = data.lat;
      newdata.lon = data.lon;
      newdata.speed = data.speed;
      this.updateFields(newdata);

    });
  }
  private updateFields(data: GPSData): void {
    var radius = 1;

    let gdata = {
      "lat": +data.lon,
      "lng": +data.lat
    };

    let circle = L.circle(gdata, {
      color: '#6593f1',
      fillColor: '#6593f1',
      fillOpacity: 1,
      radius: radius
    }).addTo(this.map);

    circle.on('mouseover', function (e) {
      //open popup;

      this.popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(data.speed)
        .openOn(this._map);
    });
    //this.polylines = [];
    // polilines.push(gdata);

    // L.polyline(polilines, { edit_with_drag: true }).addTo(this.map);
    // this.lat = data.Lat;
    // this.lon = data.Lon;
    console.log('Component: ' + JSON.stringify(data.lat) + JSON.stringify(data.lon) + " Speed: " + data.speed);

    // var iconFeatures = [];

    // var iconFeature = new ol.Feature({
    //   //geometry: new ol.geom.Point(ol.proj.fromLonLat([21.894860, 43.309336])),
    //   geometry: new ol.geom.Point(ol.proj.fromLonLat([+this.lat, +this.lon])),
    //   name: 'Null Island',
    //   population: 4000,
    //   rainfall: 500,
    //   label: 'test'
    // });

    // iconFeature.setStyle(new ol.style.Style({
    //   image: new ol.style.Icon({
    //     anchor: [0.5, 46],
    //     anchorXUnits: 'fraction',
    //     anchorYUnits: 'pixels',
    //     src: "https://lh3.ggpht.com/hx6IeSRualApBd7KZB9s2N7bcHZIjtgr9VEuOxHzpd05_CZ6RxZwehpXCRN-1ps3HuL0g8Wi=w9-h9",
    //   })
    // }));
    // var layer = new ol.layer.Vector({
    //   source: new ol.source.Vector({
    //     features: [iconFeature
    //     ]
    //   })
    // });

    //map.addLayer(layer);
  }


  popup: any;
  ngOnInit() {
    this.map = L.map('mapid').setView([43.320632, 21.892965], 10);
    //gmap = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    this.map.on('click', function (event) {
      var radius = 1;
      var circle = L.circle(event.latlng, {
        color: '#6593f1',
        fillColor: '#6593f1',
        fillOpacity: 1,
        radius: radius
      }).addTo(this);
      let currentmap = this;
      circle.on('mouseover', function (e) {
        //open popup;
        //let gmap = this.addCircle();
        this.popup = L.popup()
          .setLatLng(e.latlng)
          .setContent('Popup')
          .openOn(this._map);
      });
      //this.polylines = [];
      polilines.push([event.latlng.lat, event.latlng.lng]);

      L.polyline(polilines, { edit_with_drag: true }).addTo(this.map);
    });
  }

  // addCircle(event) {

  //   return this.map;

  // }
}
