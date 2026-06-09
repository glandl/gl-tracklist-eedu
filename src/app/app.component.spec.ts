import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';

import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { GoogleSheetsService, SHEETS_API_KEY } from './shared/google-sheets.service';

describe('AppComponent', () => {
  let googleSheetsSpy: jasmine.SpyObj<GoogleSheetsService>;

  beforeEach(async () => {
    googleSheetsSpy = jasmine.createSpyObj('GoogleSheetsService', ['get']);
    googleSheetsSpy.get.and.returnValue(NEVER);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: ScheduleComponent },
          { path: 'detail/:eventIndex/:slot/:room', component: TrackDetailComponent }
        ]),
      ],
      declarations: [AppComponent, ScheduleComponent, TrackDetailComponent],
      providers: [
        { provide: GoogleSheetsService, useValue: googleSheetsSpy },
        { provide: SHEETS_API_KEY, useValue: '' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should register the schedule route at the root path', () => {
    const router = TestBed.inject(Router);
    const scheduleRoute = router.config.find(r => r.path === '');
    expect(scheduleRoute).toBeTruthy();
    expect(scheduleRoute?.component).toBe(ScheduleComponent);
  });

  it('should register the detail route for TrackEntry navigation', () => {
    const router = TestBed.inject(Router);
    const detailRoute = router.config.find(
      r => r.path === 'detail/:eventIndex/:slot/:room'
    );
    expect(detailRoute).toBeTruthy();
    expect(detailRoute?.component).toBe(TrackDetailComponent);
  });
});
