import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { SeriesColumnOptions } from 'highcharts';
import { NGXLogger } from 'ngx-logger';
import { NgxSpinnerService } from 'ngx-spinner';

import { GraphService } from '../services/graph.service';

@Component({
  selector: 'ef-top25-graph',
  templateUrl: './top25-graph.component.html',
  styleUrls: ['./top25-graph.component.scss']
})
export class Top25GraphComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      zoomType: 'y'
    },
    title: {
      text: '' //data.title
    },
    subtitle: {
      text: '' //data.subTitle
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -30,
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
      tickAmount: 16,
      title: {
        text: '' //data.yaxis.title
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<b>{point.y:.1f}</b>'
    },
    colors: [], //data.series.colors,
    plotOptions: {
    },
    series: [{
      name: '', //data.series.title,
      data: [], //data.series.data,
      colorByPoint: true,
      type: 'column',
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '12px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }]
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
    this.graphService.top25GraphData$.subscribe(data => {
      if (data !== null) {
        this.logger.debug('Top25GraphComponent: data', data);
        this.chartOptions.title.text = <string>data.get('title');
        this.chartOptions.subtitle.text = <string>data.get('subTitle');
        //(<PlotColumnOptions>this.chartOptions.plotOptions).colors = <string[]>(<any>data.get('series')).colors;
        let series: Highcharts.SeriesOptionsType = <SeriesColumnOptions>this.chartOptions.series[0];
        series.name = <string>(<any>data.get('series')).title;
        series.data = <any>(<any>data.get('series')).data;
        series.colors = <string[]>(<any>data.get('series')).colors;

        let xAxis = <Highcharts.XAxisOptions>this.chartOptions.xAxis;
        xAxis.title.text = <string>(<any>data.get('xaxis')).title;

        let yAxis = <Highcharts.YAxisOptions>this.chartOptions.yAxis;
        yAxis.title.text = <string>(<any>data.get('yaxis')).title;

        this.updateFlag = true;
        this.spinner.hide('dataLoading');
      }
    });
  }

  ngOnInit(): void {
    this.logger.debug('Top25GraphComponent.ngOnInit');
  }

}
