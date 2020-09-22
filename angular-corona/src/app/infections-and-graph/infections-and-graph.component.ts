import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { NGXLogger } from 'ngx-logger';

import { GraphService } from '../services/graph.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ef-infections-and-graph',
  templateUrl: './infections-and-graph.component.html',
  styleUrls: ['./infections-and-graph.component.scss']
})
export class InfectionsAndGraphComponent implements OnInit {

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
    yAxis: [
      {
        type: 'linear', //data.yaxis.type,
        min: 0, //data.yaxis.min1,
        tickAmount: 16,
        title: {
          text: '' //data.yaxis.title1
        }
      }, {
        type: 'linear', //data.yaxis.type,
        min: 0, //data.yaxis.min2,
        tickAmount: 16,
        title: {
          text: '' //data.yaxis.title2
        },
        opposite: true
      }
    ],
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
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { 
    setTimeout(function () {
      chart.reflow();
    }, 0);
  } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  constructor(private logger: NGXLogger, private spinner: NgxSpinnerService, private graphService: GraphService) {
    this.graphService.infectionsAndGraphData$.subscribe(data => {
      if (data !== null) {
        this.logger.debug('InfectionsAndGraphComponent: data', data);
        this.chartOptions.title.text = <string>data.get('title');
        this.chartOptions.subtitle.text = <string>data.get('subTitle');
        this.chartOptions.series = <Highcharts.SeriesOptionsType[]>data.get('series');

        let xAxis = <Highcharts.XAxisOptions>this.chartOptions.xAxis;
        xAxis.categories = <string[]>(<any>data.get('xaxis')).dates;
        xAxis.title.text = <string>(<any>data.get('yaxis')).title;

        let yAxis = <Highcharts.YAxisOptions[]>this.chartOptions.yAxis;
        yAxis[0].min = <number>(<any>data.get('yaxis')).min1;
        yAxis[0].title.text = <string>(<any>data.get('yaxis')).title1;
        yAxis[0].type = <Highcharts.AxisTypeValue>(<any>data.get('yaxis')).type;
        yAxis[1].min = <number>(<any>data.get('yaxis')).min2;
        yAxis[1].title.text = <string>(<any>data.get('yaxis')).title2;
        yAxis[1].type = <Highcharts.AxisTypeValue>(<any>data.get('yaxis')).type;

        this.updateFlag = true;
        this.spinner.hide('dataLoading');
      }
    });
  }

  ngOnInit(): void {
    this.logger.debug('InfectionsAndGraphComponent.ngOnInit');
  }

}
