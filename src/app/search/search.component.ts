import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search-service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query:string;
  constructor(private searchService:SearchService) { }

  ngOnInit(): void {
    
    this.searchService.sharedMessage.subscribe(query => this.query = query)
  }

}
