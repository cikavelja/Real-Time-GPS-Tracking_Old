import { Component, OnInit, NgZone } from '@angular/core';
import { MSGData } from './MSGData';
import { RtgpsService } from './rtgps.service';
import { GPSData } from './GPSData';
import { LoaderService } from '../location/loader.service';
import { gpsPosition } from '../tracking/gpsPosition';
import { TrackerService } from '../tracking/tracker.service';
import { GeolocationService } from '../tracking/geolocation.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import 'rxjs/add/observable/interval';

declare var ol: any;

@Component({
  selector: 'rtgpsang-rtgps',
  templateUrl: './rtgps.component.html',
  styleUrls: ['./rtgps.component.css']
})
export class RtgpsComponent implements OnInit {
  // public variables declaration  
  public currentMessage: GPSData;
  //public allMessages: MSGData;  
  gpsdata: string;
  token: string;
  public lat: string;
  public lon: string;
  latitude: number = 18.5204;
  longitude: number = 73.8567;

  started: boolean = false;

  oLocacation: any;
  map: any;


  public canSendMessage: Boolean;
  // constructor of the class to inject the service in the constuctor and call events.  
  constructor(private _rtgpsService: RtgpsService,private _locationService: LoaderService, private trackerService: TrackerService,private geoLocation: GeolocationService) {
    // this can subscribe for events  
    this.subscribeToEvents();
    // this can check for conenction exist or not.  
    this.canSendMessage = _rtgpsService.connectionExists;
    // this method call every second to tick and respone tansfered to client.  
    // setInterval(() => {  
    //     this._rtgpsService.sendTime();  
    // }, 1000);  
  }




  // private xwatchLocation(): void {
  //   this.geoLocation
  //   .watchPosition()
  //     .pipe(map(p =>
  //     `Latitude:${p.coords.latitude}
  //     Longitude:${p.coords.longitude}`
  //   ));
  // }
  // public location$: Observable<string> = 
  
  // public location$: Observable<string> = this.geoLocation
  // .watchPosition()
  //   .pipe(map(p =>
  //   `Latitude:${p.coords.latitude}
  //   Longitude:${p.coords.longitude}`
  // ));

  private watchLocation(): void {
    this._locationService.getPosition().then(data=>
      {
        //debugger;
        let positionData = new gpsPosition();
        this.gpsdata = data.lat + " / " + data.lng;
        positionData.lat = (data.lat).toString();
        positionData.lon = (data.lng).toString();
        positionData.speed = (data.speed) ? data.speed.toString() : "0" ;
        positionData.recieved = new Date();
        debugger;
        this.trackerService.addPosition(positionData, this.token)
          .subscribe(positionDataRes => { positionData = positionDataRes },
            err => null,
            () => null
          );
         console.log(`Positon: ${data.lng} ${data.lat}`);
      });
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
    if(!this.started){
      this.started = true;
      console.log(+data.lat, +data.lon);
      //this.map.getView().setCenter(ol.proj.fromLonLat([ +this.lon, +this.lat]));
      //this.map.getView().setZoom(10);
debugger;
        this.map.setView(new ol.View({
          center: ol.proj.transform([  +data.lat,+data.lon ],"EPSG:4326","EPSG:3857"), zoom: 11 }));
    };
    this.lat = data.lat;
    this.lon = data.lon;
    console.log('Component: ' + JSON.stringify(this.lat) + JSON.stringify(this.lon));

    // this.map.marker( [21.894860 , 43.309336] )
    //   .bindPopup( '<a href="' + "Url" + '" target="_blank">' + "Description" + '</a>' )
    //   .addTo(this.map);

    // var source = new ol.source.vector({});
    // var layer = new ol.layer.vector({ source: source });
    // this.map.addLayer(layer);
    // var marker = new ol.Feature({
    //   geometry: new ol.geom.Point([21.894860, 43.309336]) // dont worry about coordinate type 0,0 will be in west coast of africa
    // });
    // this.map.addFeature(marker);
    /////////////////////////////
    // const markerSource = new ol.source.Vector();

    // var markerStyle = new ol.style.Style({
    //   image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
    //     anchor: [0.5, 46],
    //     anchorXUnits: 'fraction',
    //     anchorYUnits: 'pixels',
    //     opacity: 0.75,
    //     src: 'https://cdn.mapmarker.io/api/v1/fa/stack?size=28&icon=&color=%23FFFFFF&on=bowling-ball&oncolor=%23373737&hoffset=1&voffset=0&iconsize=20&'
    //   }))
    // });

    // function addMarker(lon, lat) {
    //   console.log('lon:', lon);
    //   console.log('lat:', lat);

    //   var iconFeatures = [];

    //   var iconFeature = new ol.Feature({
    //     geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
    //     name: 'Null Island',
    //     population: 4000,
    //     rainfall: 500
    //   });

    //   iconFeature.setStyle(new ol.style.Style({
    //     image: new ol.style.Icon({
    //       anchor: [0.5, 46],
    //       anchorXUnits: 'fraction',
    //       anchorYUnits: 'pixels',
    //       src: "https://img.icons8.com/small/16/000000/entering-geo-fence.png",
    //     })
    //   }));

    //   //markerSource.addFeature(iconFeature);

    //   var layer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //       features: [
    //         new ol.Feature(iconFeature)
    //       ]
    //     })
    //   });
    //   this.map.addLayer(layer);
    // }

    // this.map.on('singleclick', function (event) {
    //   var lonLat = ol.proj.toLonLat(event.coordinate);
    //   //addMarker(lonLat[0], lonLat[1]);
    //   //addMarkers(lonLat);
    // });

        // iconFeature.setStyle(new ol.style.Style({
    //   image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    //     color: '#8959A8',
    //     crossOrigin: 'anonymous',
    //     src: 'http://pngimg.com/uploads/dot/dot_PNG47.png'
    //   }))
    // }));

    /////////////


    var iconFeatures = [];

    var iconFeature = new ol.Feature({
      //geometry: new ol.geom.Point(ol.proj.fromLonLat([21.894860, 43.309336])),
      geometry: new ol.geom.Point(ol.proj.fromLonLat([+this.lat, +this.lon])),
      name: data.speed,
      population: 4000,
      rainfall: 500,
      label: 'test'
    });


    var svg = '<svg width="120" height="120"  version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<circle cx="30" cy="30" r="15" fill="red"/>'
            + '</svg>';

    var style = new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 1,
        src: 'data:image/svg+xml;utf8,' + svg,
        scale: 0.3
      })
    });

    iconFeature.setStyle(style);

    // iconFeature.setStyle(new ol.style.Style({
    //   image: new ol.style.Icon({
    //     anchor: [0.5, 46],
    //     anchorXUnits: 'fraction',
    //     anchorYUnits: 'pixels',
    //     src: "https://lh3.ggpht.com/hx6IeSRualApBd7KZB9s2N7bcHZIjtgr9VEuOxHzpd05_CZ6RxZwehpXCRN-1ps3HuL0g8Wi=w9-h9",
    //   })
    // }));
    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [iconFeature
        ]
      })
    });
    // var layer1 = new ol.layer.Vector({
    //   source: new ol.source.Vector({
    //     features: [
    //       new ol.Feature({
    //         geometry: new ol.geom.Point(ol.proj.fromLonLat([22.046255, 43.335345])),
    //         name: 'Null Island',
    //         population: 4000,
    //         rainfall: 500
    //       })
    //     ]
    //   })
    // });
    this.map.addLayer(layer);
    //this.map.addLayer(layer1);

    // function addMarkers(lonLat: any): void {
    //   //debugger;  
    //   var layer1 = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //       features: [
    //         new ol.Feature({
    //           geometry: new ol.geom.Point(ol.proj.fromLonLat(22.046255, 43.335345)),
    //           name: 'Null Island',
    //           population: 4000,
    //           rainfall: 500
    //         })
    //       ]
    //     })
    //   });
    //   this.map.addLayer(layer1);
    // };
    ///////////////

    ////////////////////////////////////
    // var style = new ol.style.Style({
    //   image: new ol.style.Icon({
    //     anchor: [0.5, 46],
    //     anchorXUnits: 'fraction',
    //     anchorYUnits: 'pixels',
    //     src: "https://lh3.ggpht.com/hx6IeSRualApBd7KZB9s2N7bcHZIjtgr9VEuOxHzpd05_CZ6RxZwehpXCRN-1ps3HuL0g8Wi=w9-h9",
    //   }),
    //   text: new ol.style.Text({
    //     font: '12px Calibri,sans-serif',
    //     offsetX:10,
    //     offsetY:-40,
    //     fill: new ol.style.Fill({
    //       //color: '#000'
    //     }),
    //     stroke: new ol.style.Stroke({
    //       color: '#fff',
    //       width: 15
    //     })
    //   })
    // });

    // let vectorLayer = new ol.layer.Vector({
    //   source: new ol.source.Vector(),
    //   style: function (feature) {
    //     style.getText().setText(feature.get('label'));
    //     return style;
    //   }
    // });
    // this.map.addLayer(vectorLayer);

    // function add_map_point(lat, lng, label, xthis) {
    //   vectorLayer.getSource().addFeature(
    //     new ol.Feature({
    //       geometry: new ol.geom.Point(ol.proj.fromLonLat([lat, lng])),
    //       label: label
    //     })
    //   )
    //   var overlay = new ol.Overlay({

    //     position: ol.proj.fromLonLat([lat, lng], 'EPSG:4326', 'EPSG:3857'),
    //     element: document.getElementById('overlay')
    //   })
    //   xthis.map.addOverlay(overlay);
    // }
    // add_map_point(21.849986, 43.266360, 'Mix', this);

    /////////////////////////////

  }



  ngOnInit() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        
        //center: ol.proj.fromLonLat([21.895525, 43.310382]),
        //center: ol.proj.fromLonLat([36.803877, -95.009102]),
        center: ol.proj.fromLonLat([-95.009102, 36.803877]),
        zoom: 4
      })
    });
    //this.oLocacation = Observable.interval(1000).subscribe((val) => { 
      this.watchLocation();
    //});  
  }

  



}
