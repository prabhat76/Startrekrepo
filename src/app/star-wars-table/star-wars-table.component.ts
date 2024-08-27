import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface Character {
  id: string;
  name: string;
  birth_year: string;
  species: string[];
  vehicles: string[];
  starships: string[];
}

@Component({
  selector: 'app-star-wars-table',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './star-wars-table.component.html',
  styleUrls: ['./star-wars-table.component.css']
})
export class StarWarsTableComponent implements OnInit, OnDestroy {
  characters$ = new BehaviorSubject<Character[]>([]);
  species$ = new BehaviorSubject<any[]>([]);
  vehicles$ = new BehaviorSubject<any[]>([]);
  starShips$ = new BehaviorSubject<any[]>([]);
  movies$ = new BehaviorSubject<string[]>(['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi']);
  currentPage = 1;
  totalPages = 1;
  filters = {
    movieName: '',
    species: '',
    vehicle: '',
    starShips: '',
    birthYear: 'ALL'
  };
  private subscriptions = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFilterOptions();
    this.subscriptions.add(this.getCharacters().subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchFilterOptions() {
    this.subscriptions.add(
      forkJoin({
        species: this.http.get<any>('https://swapi.dev/api/species/'),
        vehicles: this.http.get<any>('https://swapi.dev/api/vehicles/'),
        starShips: this.http.get<any>('https://swapi.dev/api/starships/')
      }).subscribe(({ species, vehicles, starShips }) => {
        this.species$.next(species.results);
        this.vehicles$.next(vehicles.results);
        this.starShips$.next(starShips.results);
      })
    );
  }

  getCharacters() {
    return this.http.get<any>(`https://swapi.dev/api/people/?page=${this.currentPage}`)
      .pipe(
        map(response => {
          this.totalPages = Math.ceil(response.count / 10);

          // Transform the characters to include necessary fields
          const characters = response.results.map((character: any) => ({
            id: character.url.split('/').slice(-2, -1)[0],
            name: character.name,
            birth_year: character.birth_year,
            species: character.species,
            vehicles: character.vehicles,
            starships: character.starships
          }));

          // Apply the filters
          return this.applyFilters(characters);
        }),
        tap(data => this.characters$.next(data)),
        catchError(error => {
          console.error('Error fetching characters', error);
          this.characters$.next([]);
          return [];
        })
      );
  }

  applyFilters(characters: Character[]): Character[] {
    return characters.filter(character => {
      // Filter by species
      const speciesMatch = this.filters.species ? character.species.includes(this.filters.species) : true;

      // Filter by vehicle
      const vehicleMatch = this.filters.vehicle ? character.vehicles.includes(this.filters.vehicle) : true;

      // Filter by starship
      const starshipMatch = this.filters.starShips ? character.starships.includes(this.filters.starShips) : true;

      // Filter by birth year
      const birthYearMatch = this.filters.birthYear !== 'ALL' ? character.birth_year === this.filters.birthYear : true;

      // Combine all filters
      return speciesMatch && vehicleMatch && starshipMatch && birthYearMatch;
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.subscriptions.add(this.getCharacters().subscribe());
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.subscriptions.add(this.getCharacters().subscribe());
  }

  getSpeciesName(speciesUrls: string[]): string {
    if (!speciesUrls || speciesUrls.length === 0) {
      return 'Unknown';
    }

    return speciesUrls.map(url => url.split('/').slice(-2, -1)[0]).join(', ');
  }

  getCharacter(id: string | null) {
    return this.http.get<Character>(`https://swapi.dev/api/people/${id}/`);
  }
  
}





// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';

// interface Character {
//   id: string;
//   name: string;
//   birth_year: string;
//   species: string[];
// }

// @Component({
//   selector: 'app-star-wars-table',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
//   templateUrl: './star-wars-table.component.html',
//   styleUrls: ['./star-wars-table.component.css']
// })
// export class StarWarsTableComponent implements OnInit, OnDestroy {
//   characters$ = new BehaviorSubject<Character[]>([]);
//   species$ = new BehaviorSubject<any[]>([]);
//   vehicles$ = new BehaviorSubject<any[]>([]);
//   starShips$ = new BehaviorSubject<any[]>([]);
//   movies$ = new BehaviorSubject<string[]>(['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi']);
//   currentPage = 1;
//   totalPages = 1;
//   filters = {
//     movieName: '',
//     species: '',
//     vehicle: '',
//     starShips: '',
//     birthYear: 'ALL'
//   };
//   private subscriptions = new Subscription();

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchFilterOptions();
//     this.subscriptions.add(this.getCharacters().subscribe());
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.unsubscribe();
//   }

//   fetchFilterOptions() {
//     this.subscriptions.add(
//       forkJoin({
//         species: this.http.get<any>('https://swapi.dev/api/species/'),
//         vehicles: this.http.get<any>('https://swapi.dev/api/vehicles/'),
//         starShips: this.http.get<any>('https://swapi.dev/api/starships/')
//       }).subscribe(({ species, vehicles, starShips }) => {
//         this.species$.next(species.results);
//         this.vehicles$.next(vehicles.results);
//         this.starShips$.next(starShips.results);
//       })
//     );
//   }

//   getCharacters() {
//     const queryParams = new URLSearchParams();
//     if (this.filters.birthYear !== 'ALL') {
//       queryParams.append('birth_year', this.filters.birthYear);
//     }

//     return this.http.get<any>(`https://swapi.dev/api/people/?page=${this.currentPage}&${queryParams.toString()}`)
//       .pipe(
//         map(response => {
//           this.totalPages = Math.ceil(response.count / 10);
//           return response.results.map((character: any) => ({
//             id: character.url.split('/').slice(-2, -1)[0],
//             name: character.name,
//             birth_year: character.birth_year,
//             species: character.species
//           }));
//         }),
//         tap(data => this.characters$.next(data)),
//         catchError(error => {
//           console.error('Error fetching characters', error);
//           this.characters$.next([]);
//           return [];
//         })
//       );
//   }

//   onFilterChange() {
//     this.currentPage = 1;
//     this.subscriptions.add(this.getCharacters().subscribe());
//   }

//   onPageChange(page: number) {
//     this.currentPage = page;
//     this.subscriptions.add(this.getCharacters().subscribe());
//   }

//   getSpeciesName(speciesUrls: string[]): string {
//     if (!speciesUrls || speciesUrls.length === 0) {
//       return 'Unknown';
//     }

//     return speciesUrls.map(url => url.split('/').slice(-2, -1)[0]).join(', ');
//   }

//   getCharacter(id: string | null) {
//     return this.http.get<Character>(`https://swapi.dev/api/people/${id}/`);
//   }
// }
