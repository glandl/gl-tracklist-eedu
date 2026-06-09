import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NEVER } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { GoogleSheetsService, SHEETS_API_KEY } from './shared/google-sheets.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('AppComponent', () => {
  let googleSheetsSpy: jasmine.SpyObj<GoogleSheetsService>;

  beforeEach(async () => {
    googleSheetsSpy = jasmine.createSpyObj('GoogleSheetsService', ['get']);
    googleSheetsSpy.get.and.returnValue(NEVER);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'detail/:eventIndex/:slot/:room', component: TrackDetailComponent }
        ]),
        NoopAnimationsModule,
        FormsModule,
        MatTableModule,
        MatToolbarModule,
        MatGridListModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
      ],
      declarations: [AppComponent, TrackDetailComponent],
      providers: [
        { provide: GoogleSheetsService, useValue: googleSheetsSpy },
        { provide: SHEETS_API_KEY, useValue: '' },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should register the detail route for TrackEntry navigation', () => {
    const router = TestBed.inject(Router);
    const detailRoute = router.config.find(
      r => r.path === 'detail/:eventIndex/:slot/:room'
    );
    expect(detailRoute).toBeTruthy();
    expect(detailRoute?.component).toBe(TrackDetailComponent);
  });

  it('should not apply matTooltip to TrackEntry cells', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    // MatTooltipModule sets ng-reflect-message on elements with matTooltip binding
    expect(compiled.querySelectorAll('[ng-reflect-message]').length).toBe(0);
  });
});
