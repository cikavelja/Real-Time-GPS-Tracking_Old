import { Component, OnInit } from '@angular/core';
import  'signalr';
import { CONFIGURATION } from '../app.constants';

declare var $: any;

@Component({
  selector: 'rtgpsang-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

  private connection: SignalR;  
  private proxy: SignalR.Hub.Proxy;

  constructor() { }

  ngOnInit() {


    interface token {
      access_token: string;
    }

    //let p1: token = { access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjMiLCJyb2xlIjoidXNlciIsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImFsbCIsImV4cCI6MTU2ODgwNDUyNSwibmJmIjoxNTY3OTQwNTI1fQ.RG8vgyRsaxg-8omuf6pLlGfe-5Zd5PgvJrqohQl7Cd0" };
    let p1: token = { access_token: localStorage.getItem("access_token")};
    //initialize connection
    this.connection = $.connection;

    this.connection.hub.url = CONFIGURATION.baseUrls.server + "signalr";

    this.connection.hub.qs = p1;

    //to create proxy give your hub class name as parameter. IMPORTANT: notice that I followed camel casing in giving class name
    this.proxy = $.connection.hub.createHubProxy('chatHub');

    //define a callback method for proxy
    this.proxy.on('messageReceived', (latestMsg) => this.onMessageReceived(latestMsg));

    try {
      this.connection.hub.start().done((data: any) => {
        console.log(data);
        this.sendMessage();
      });
    }
    catch (e) {
      console.log(e);
    }

  }
  private onMessageReceived(latestMsg: string) {
    console.log('New message received: ' + latestMsg);
  }

  public sendMessage(): void {
    this.proxy.invoke('sendMessage', 'test');
  }

}
