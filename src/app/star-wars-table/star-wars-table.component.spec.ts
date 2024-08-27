import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarWarsTableComponent } from './star-wars-table.component';

describe('StarWarsTableComponent', () => {
  let component: StarWarsTableComponent;
  let fixture: ComponentFixture<StarWarsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarWarsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarWarsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
