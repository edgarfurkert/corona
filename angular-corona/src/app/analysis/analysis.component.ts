import { Component, OnInit } from '@angular/core';

import { Territory } from '../models/model.interfaces';

@Component({
  selector: 'ef-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  maxDate: Date;

  constructor() { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate() - 1 );
    this.endDate = this.maxDate;
  }

  selectTerritory(ev: Territory[]) {
    console.log('AnalysisComponent.selectTerritory: ev', ev)
  }

  selectRegion(ev: Territory) {
    console.log('AnalysisComponent.selectRegion: ev', ev)
  }

  update(data) {
    console.log('AnalysisComponent.update: data', data)
  }
}
