import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'ef-graphic1',
  templateUrl: './graphic1.component.html',
  styleUrls: ['./graphic1.component.scss']
})
export class Graphic1Component implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = { series: [{
    data: [1, 2, 3],
    type: 'line'
  }] }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { console.log('chartCallback'); } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false
  
  constructor() { }

  ngOnInit(): void {
    console.log('Graphic1Component.ngOnInit');
  }


}
