import { Injectable, EventEmitter } from '@angular/core';
import { GPSData } from '../notify/GPSData';
import { CONFIGURATION } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  // Declare the variables  
  private proxy: any;
  private proxyName: string = 'chatHub';
  private connection: any;
  // create the Event Emitter  
  public messageReceived: EventEmitter<GPSData>;
  public connectionEstablished: EventEmitter<Boolean>;
  public connectionExists: Boolean;
  constructor() {
    //debugger; 
    interface token {
      access_token: string;
    }
    // Constructor initialization  
    this.connectionEstablished = new EventEmitter<Boolean>();
    this.messageReceived = new EventEmitter<GPSData>();
    this.connectionExists = false;
    // create hub connection  
    this.connection = $.hubConnection(CONFIGURATION.baseUrls.server);

    // create new proxy as name already given in top  
    this.proxy = this.connection.createHubProxy(this.proxyName);
    //let p1: token = { access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjMiLCJyb2xlIjoidXNlciIsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImFsbCIsImV4cCI6MTU2ODgwNDUyNSwibmJmIjoxNTY3OTQwNTI1fQ.RG8vgyRsaxg-8omuf6pLlGfe-5Zd5PgvJrqohQl7Cd0" };
    let p1: token = { access_token: localStorage.getItem("access_token") };
    this.connection.qs = p1;

    // register on server events  
    this.registerOnServerEvents();
    // call the connecion start method to start the connection to send and receive events.  
    this.startConnection();
  }
  // method to hit from client  
  public sendTime() {
    // server side hub method using proxy.invoke with method name pass as param  
    this.proxy.invoke('sendCords', "Test");
  }
  // check in the browser console for either signalr connected or not  
  private startConnection(): void {
    this.connection.start().done((data: any) => {
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
      this.connectionEstablished.emit(true);
      this.connectionExists = true;
    }).fail((error: any) => {
      console.log('Could not connect ' + error);
      this.connectionEstablished.emit(false);
    });
  }
  private registerOnServerEvents(): void {
    //debugger;  
    this.proxy.on('cordReceived', (lat: string, lon: string, speed: string) => {
      console.log('received in GPSService: ' + JSON.stringify(lat) + JSON.stringify(lon));
      let gdata = new GPSData();
      gdata.lat = lon;
      gdata.lon = lat;
      gdata.speed=speed;

      this.messageReceived.emit(gdata);
    });
  }
}
