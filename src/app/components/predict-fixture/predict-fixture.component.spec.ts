import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictFixtureComponent } from './predict-fixture.component';

describe('PredictFixtureComponent', () => {
  let component: PredictFixtureComponent;
  let fixture: ComponentFixture<PredictFixtureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictFixtureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
