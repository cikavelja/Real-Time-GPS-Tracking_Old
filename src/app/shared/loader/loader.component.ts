import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderserviceService } from '../loaderservice.service';

@Component({
  selector: 'rtgpsang-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderserviceService) { }

  ngOnInit() {
  }

}
