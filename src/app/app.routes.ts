import { Routes } from '@angular/router';
import path from 'path';
import { StarWarsTableComponent } from './star-wars-table/star-wars-table.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';


export const routes: Routes = [
    {path:"", component:StarWarsTableComponent,
    },
    { path: 'characters/:id', component: CharacterDetailComponent },
];
