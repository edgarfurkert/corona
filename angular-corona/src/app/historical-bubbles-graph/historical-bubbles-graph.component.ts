import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { NGXLogger } from 'ngx-logger';

import { GraphService } from '../services/graph.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ef-historical-bubbles-graph',
  templateUrl: './historical-bubbles-graph.component.html',
  styleUrls: ['./historical-bubbles-graph.component.scss']
})
export class HistoricalBubblesGraphComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy'
    },
    title: {
      text: '' //data.title
    },
    subtitle: {
      text: '' //data.subTitle
    },
    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. {point.name}, Date: {point.x}, Value: {point.y}, value/day: {point.z}.'
      }
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<table>',
      pointFormat: '<tr><th colspan="2"><h3>{point.territory}</h3></th></tr>' +
        '<tr><th>Date:</th><td>{point.date}</td></tr>' +
        '<tr><th>Value:</th><td>{point.y}</td></tr>' +
        '<tr><th>Day-Value:</th><td>{point.z}</td></tr>',
      footerFormat: '</table>',
      followPointer: true
    },
    legend: {
      maxHeight: 95
    },
    xAxis: {
      gridLineWidth: 1,
      categories: [], //data.xaxis.dates,
      title: {
        text: '' //data.xaxis.title
      }
    },
    yAxis: {
      startOnTick: false,
      endOnTick: false,
      type: 'linear', //data.yaxis.type,
      min: 0, //data.yaxis.min,
      tickAmount: 16,
      title: {
        text: '' //data.yaxis.title
      }
    },
    plotOptions: {
      series: {
        // general options for all series
      },
      bubble: {
        // shared options for all bubble series
        marker: {
          lineColor: '#a0a0a0'
        }
      }
    },
    series: [] //data.series
  }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { 
    console.log('HistoricalBubblesGraphComponent.chartCallback'); 
  } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  constructor(private logger: NGXLogger, private spinner: NgxSpinnerService, private graphService: GraphService) {
    this.graphService.historicalBubblesGraphData$.subscribe(data => {
      if (data !== null) {
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
        this.logger.debug('HistoricalBubblesGraphComponent: data', data);
        this.spinner.hide('dataLoading');
      }
    });
  }

  ngOnInit(): void {
    this.logger.debug('HistoricalBubblesGraphComponent.ngOnInit');
  }

}
