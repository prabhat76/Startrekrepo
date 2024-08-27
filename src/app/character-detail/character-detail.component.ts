// character-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css'],
  standalone: true, 
  imports:[CommonModule, HttpClientModule]
})
export class CharacterDetailComponent implements OnInit {
  character$ = new BehaviorSubject<any>(null);
  private apiUrl = 'https://swapi.dev/api/people/';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`${this.apiUrl}${id}/`).pipe(
        tap(character => this.character$.next(character)),
        catchError(error => {
          console.error('Error fetching character', error);
          this.character$.next(null);
          return [];
        })
      ).subscribe();
    }
  }
}
