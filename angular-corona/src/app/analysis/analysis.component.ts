import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Territory, TerritoryItem } from '../models/model.interfaces';
import { SBChoice } from '../selection-box/selection-box.component';
import { RBChoice } from '../radio-button-group/radio-button-group.component';
import { CheckboxItem } from '../checkbox-list/checkbox-list.component';
import { TerritoryService } from '../services/territory.service';


@Component({
  selector: 'ef-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  maxDate: Date;
  territories: CheckboxItem[] = [];
  regions: CheckboxItem[] = [];

  graphicTypes: SBChoice[] = [
    { id: 's1', title: 'Selection 1' },
    { id: 's2', title: 'Selection 2' },
    { id: 's3', title: 'Selection 3' }
  ];
  graphicTypeSelected = 's1';

  dataTypes: RBChoice[] = [
    { id: 'dt1', title: 'Data Type 1' },
    { id: 'dt2', title: 'Data Type 2' },
    { id: 'dt3', title: 'Data Type 3' }
  ];
  dataTypeSelected = 'dt1';

  dataCategories: RBChoice[] = [
    { id: 'dc1', title: 'Data Category 1' },
    { id: 'dc2', title: 'Data Category 2' },
    { id: 'dc3', title: 'Data Category 3' }
  ];
  dataCategorySelected = 'dc1';

  yAxisTypes: RBChoice[] = [
    { id: 'linear', title: 'linear' },
    { id: 'logarithmic', title: 'logarithmic' }
  ];
  yAxisTypeSelected = 'linear';

  constructor(private router: Router, private route: ActivatedRoute, private territoryService: TerritoryService) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setDate( this.maxDate.getDate() - 1 );
    this.endDate = this.maxDate;

    let tArray: TerritoryItem[] = [];
    this.territoryService.getTerritoryMap().forEach(t => {
      console.log('AnalysisComponent.ngAfterViewInit', t);
      let item = new TerritoryItem(t);
      tArray.push(item);
    });

    this.territories = tArray;
  }

  ngAfterViewInit() {
  }

  selectTerritory(selectedTerritories: Territory[]) {
    console.log('AnalysisComponent.selectTerritory', selectedTerritories);
    let tArray: TerritoryItem[] = [];
    selectedTerritories.forEach(t => {
      t.regions.forEach(r => {
        console.log('AnalysisComponent.selectTerritory', r);
        let item = new TerritoryItem(r);
        console.log('AnalysisComponent.selectTerritory: item', item);
        tArray.push(item);
        });
    });
    this.regions = tArray;
  }

  selectRegion(ev: Territory) {
    console.log('AnalysisComponent.selectRegion: ev', ev);
  }

  update(data) {
    console.log('AnalysisComponent.update: data', data);
    this.routeBySelection(this.graphicTypeSelected);
  }

  selectGraphicType(selection) {
    console.log('AnalysisComponent.selectGraphicType', selection);
    this.graphicTypeSelected = selection;
  }

  selectDataType(selection) {
    console.log('AnalysisComponent.selectDataType', selection);
    this.dataTypeSelected = selection;
  }

  selectDataCategory(selection) {
    console.log('AnalysisComponent.selectDataCategory', selection);
    this.dataCategorySelected = selection;
  }

  selectYAxisType(selection) {
    console.log('AnalysisComponent.selectYAxisType', selection);
    this.yAxisTypeSelected = selection;
  }

  onGraphicActivate(ev) {
    console.log('AnalysisComponent.onGraphicActivate', ev);
  }

  onGraphicDeactivate(ev) {
    console.log('AnalysisComponent.onGraphicDeactivate', ev);
  }

  routeBySelection(selection: string) {
    console.log('AnalysisComponent.routeBySelection', selection);
    this.router.navigate([{outlets: {graphic: [selection]}}], { relativeTo: this.route })
    .then(() => {
      console.log('graphic done');
    })
    .catch(error => {
      console.log('graphic', error);
    });
  }
}
