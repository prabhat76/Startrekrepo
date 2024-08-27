import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css'],
  standalone: true, 
  imports: [CommonModule, HttpClientModule]
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
        switchMap(character => {
          const filmRequests = character.films.map((filmUrl: string) => 
            this.http.get(filmUrl).pipe(catchError(() => []))
          );

          const vehicleRequests = character.vehicles.map((vehicleUrl: string) =>
            this.http.get(vehicleUrl).pipe(catchError(() => []))
          );

          const starshipRequests = character.starships.map((starshipUrl: string) =>
            this.http.get(starshipUrl).pipe(catchError(() => []))
          );

          return forkJoin([
            forkJoin(filmRequests),
            forkJoin(vehicleRequests),
            forkJoin(starshipRequests)
          ]).pipe(
            map(([films, vehicles, starships]) => ({
              ...character,
              films,
              vehicles,
              starships
            }))
          );
        }),
        tap(characterWithDetails => this.character$.next(characterWithDetails)),
        catchError(error => {
          console.error('Error fetching character', error);
          this.character$.next(null);
          return [];
        })
      ).subscribe();
    }
  }
}
