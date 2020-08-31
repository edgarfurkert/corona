import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { User } from '../shared/models/model-interfaces';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  originalTitle: string;

  user: User = {};

  constructor(private activatedRoute: ActivatedRoute,
              private titleService: Title) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      console.log(data); // Object {title: "Einstellungen"}
    });

    this.originalTitle = this.titleService.getTitle();
    const title = this.activatedRoute.snapshot.data['title'];
    if (title) {
      this.titleService.setTitle(title);
    }
  }

  ngOnDestroy() {
    this.titleService.setTitle(this.originalTitle);
  }

}
