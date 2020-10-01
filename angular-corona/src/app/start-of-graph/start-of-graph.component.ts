import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { SeriesColumnOptions } from 'highcharts';
import { NGXLogger } from 'ngx-logger';
import { NgxSpinnerService } from 'ngx-spinner';

import { GraphService } from '../services/graph.service';

@Component({
  selector: 'ef-start-of-graph',
  templateUrl: './start-of-graph.component.html',
  styleUrls: ['./start-of-graph.component.scss']
})
export class StartOfGraphComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      zoomType: 'xy'
    },
    title: {
      text: '' //data.title
    },
    subtitle: {
      text: '' //data.subTitle
    },
    xAxis: {
      categories: [], //data.xaxis.dates,
      labels: {
        rotation: -90,
        style: {
          fontSize: '12px',
          fontFamily: 'Verdana, sans-serif'
        }
      },
      title: {
        text: '' //data.xaxis.title
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '' //data.yaxis.title
      }
    },
    legend: {
      maxHeight: 95
    },
    tooltip: {
      pointFormat: '<span>{series.name}</span>: <b>{point.y}</b>',
      shared: false
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: [] //data.series
  }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { 
    setTimeout(function () {
      chart.reflow();
    }, 0);
  } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  constructor(private logger: NGXLogger, private spinner: NgxSpinnerService, private graphService: GraphService) {
    this.graphService.startOfGraphData$.subscribe(data => {
      if (data !== null) {
        this.logger.debug('StartOfGraphComponent: data', data);
        this.chartOptions.title.text = <string>data.get('title');
        this.chartOptions.subtitle.text = <string>data.get('subTitle');
        this.chartOptions.series = <Highcharts.SeriesOptionsType[]>data.get('series');

        let xAxis = <Highcharts.XAxisOptions>this.chartOptions.xAxis;
        xAxis.title.text = <string>(<any>data.get('xaxis')).title;
        xAxis.categories = <string[]>(<any>data.get('xaxis')).dates;

        let yAxis = <Highcharts.YAxisOptions>this.chartOptions.yAxis;
        yAxis.title.text = <string>(<any>data.get('yaxis')).title;

        this.updateFlag = true;
        this.spinner.hide('dataLoading');
      }
    });
  }

  ngOnInit(): void {
    this.logger.debug('StartOfGraphComponent.ngOnInit');
  }

}
