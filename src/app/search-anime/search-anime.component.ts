import { Component, OnInit } from '@angular/core';
import{SearchAnimeService} from '../services/search-anime.service';
import { Anime } from '../models/anime';
import { Observable } from 'rxjs';
import {FormGroup, FormControl} from "@angular/forms";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-anime',
  templateUrl: './search-anime.component.html',
  styleUrls: ['./search-anime.component.sass']
})
export class SearchAnimeComponent implements OnInit 
{
  animes: Anime[] = [];
  searched: Boolean
  page = 1
  pageSize = 10
  collectionSize: number
  searchTerm: string


  constructor(private s: SearchAnimeService) 
  { 
  }
  ngOnInit(): void
  {
    this.searched = false
  }

  searchForm = new FormGroup({
   name: new FormControl(''),
  });


  onSubmit() {
    console.log(this.searchForm.value)
    this.searchTerm = this.searchForm.controls.name.value
    this.s.getAnime(this.searchTerm).subscribe(
      (data: any) => {
        data.list.forEach((anime: Anime) => {
          anime.name = JSON.parse(anime.name)
          anime.synopsis = JSON.parse(anime.synopsis)
          anime.logo = JSON.parse(anime.logo)
          this.animes.push(anime);
        });
        this.searched = true;
        this.collectionSize = data.totalCount
      }
    );
  }

  pageChange() {
    this.s.getAnimeOffset(this.searchTerm, (this.page * 10) - 10).subscribe(
      (data: any) => {
        this.animes = [];
        data.list.forEach((anime: Anime) => {
          anime.name = JSON.parse(anime.name)
          anime.synopsis = JSON.parse(anime.synopsis)
          anime.logo = JSON.parse(anime.logo)
          this.animes.push(anime);
        });
      }
    );
  }
  
  onClick(anime: Anime): void {
    this.s.saveAnime(anime)
  }
}
