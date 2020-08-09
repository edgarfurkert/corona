import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ef-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      console.log('AboutComponent: data = ', data);
    });

    console.log('AboutComponent: data = ', this.activatedRoute.snapshot.data);


    const title = this.activatedRoute.snapshot.data['title'];
    if (title) {
      this.titleService.setTitle(title);
    }
  }

}
