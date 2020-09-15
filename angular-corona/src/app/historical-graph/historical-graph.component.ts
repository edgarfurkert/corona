import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { NGXLogger } from 'ngx-logger';

import { GraphService } from '../services/graph.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ef-historical-graph',
  templateUrl: './historical-graph.component.html',
  styleUrls: ['./historical-graph.component.scss']
})
export class HistoricalGraphComponent implements OnInit {
  
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      zoomType: 'xy'
    },
    title: {
      text: '' //data.title
    },
    subtitle: {
      text: '' //data.subTitle
    },
    xAxis: {
      title: {
        text: '' //data.xaxis.title
      },
      categories: [] //data.xaxis.dates
    },
    yAxis: {
      type: 'linear', //data.yaxis.type,
      min: 0, //data.yaxis.min,
      tickAmount: 16,
      title: {
        text: '' //data.yaxis.title
      }
    },
    legend: {
      maxHeight: 95
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: true
      }
    },
    series: [] //data.series
  }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { console.log('chartCallback'); } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  constructor(private logger: NGXLogger, private spinner: NgxSpinnerService, private graphService: GraphService) {
    this.graphService.historicalGraphData$.subscribe(data => {
      if (data !== null) {
        this.logger.debug('HistoricalGraphComponent: data', data);
        this.chartOptions.title.text = <string>data.get('title');
        this.chartOptions.subtitle.text = <string>data.get('subTitle');
        this.chartOptions.series = <Highcharts.SeriesOptionsType[]>data.get('series');

        let xAxis = <Highcharts.XAxisOptions>this.chartOptions.xAxis;
        xAxis.categories = <string[]>(<any>data.get('xaxis')).dates;
        xAxis.title.text = <string>(<any>data.get('yaxis')).title;

        let yAxis = <Highcharts.YAxisOptions>this.chartOptions.yAxis;
        yAxis.min = <number>(<any>data.get('yaxis')).min;
        yAxis.title.text = <string>(<any>data.get('yaxis')).title;
        yAxis.type = <Highcharts.AxisTypeValue>(<any>data.get('yaxis')).type;

        this.updateFlag = true;
        this.spinner.hide('dataLoading');
      }
    });
  }

  ngOnInit(): void {
    this.logger.debug('HistoricalGraphComponent.ngOnInit');
  }

}
