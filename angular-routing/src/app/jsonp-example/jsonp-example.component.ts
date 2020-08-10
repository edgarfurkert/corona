import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'ef-jsonp-example',
  templateUrl: './jsonp-example.component.html',
  styleUrls: ['./jsonp-example.component.css']
})
export class JsonpExampleComponent implements OnInit {

  searchResults$: Observable<any[]>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  search(query): Observable<any[]> {
    const url = `https://api.flickr.com/services/feeds/photos_public.gne?tags=${query}&format=json&jsoncallback=JSONP_CALLBACK`;
    this.searchResults$ = this.http.jsonp<any>(url, 'JSONP_CALLBACK').pipe(map(data => data.items));

    return this.searchResults$;
  }

}
