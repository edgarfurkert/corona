import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { NGXLogger } from 'ngx-logger';

import { GraphService } from '../services/graph.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ef-historical-stacked-areas-graph',
  templateUrl: './historical-stacked-areas-graph.component.html',
  styleUrls: ['./historical-stacked-areas-graph.component.scss']
})
export class HistoricalStackedAreasGraphComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'area',
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
      title: {
        text: '' //data.xaxis.title
      }
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
    tooltip: {
      pointFormat: '<span>{series.name}</span>: <b>{point.y}</b>',
      shared: false
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666'
        }
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
    this.graphService.historicalStackedAreasGraphData$.subscribe(data => {
      if (data !== null) {
        this.logger.debug('HistoricalStackedAreasGraphComponent: data', data);
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
    this.logger.debug('HistoricalStackedAreasGraphComponent.ngOnInit');
  }

}
