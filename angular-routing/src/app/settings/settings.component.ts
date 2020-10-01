import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../services/login.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ef-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  readonly = true;

  constructor(private activatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      console.log('SettingsComponent: data = ', data);
    });

    console.log('SettingsComponent: data = ', this.activatedRoute.snapshot.data);

    const user: User = this.activatedRoute.snapshot.data['user'];
    if (user && user.hasRight('change_settings')) {
      console.log('Settings: User is allowed to change settings.');
      this.readonly = false;
    }

    const title = this.activatedRoute.snapshot.data['title'];
    if (title) {
      this.titleService.setTitle(title);
    }
  }

}
