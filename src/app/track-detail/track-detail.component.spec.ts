import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { TrackDetailComponent } from './track-detail.component';
import { GoogleSheetsService, SHEETS_API_KEY } from '../shared/google-sheets.service';
import { TrackEntry } from '../shared/model/track-entry';

const fixtureTrack: TrackEntry = {
  id: '1',
  SessionID: '101',
  Titel: 'Test Session Title',
  Vortragende: '<strong>Speaker Name</strong>',
  Beschreibungstext: '<p>Session description text</p>',
  Slot: '09:00',
  Raum: 'Raum A',
  DigiKomp: '4',
  dkStyle: 'dk4',
  dk4: 1,
  dk8: 0,
  dk12: 0,
  dkP: 0,
  D: 0,
  Tech: 0,
  Vorname: 'Speaker',
  Nachname: 'Name',
  DetailLink: '',
};

function mockRoute(slot: string, room: string) {
  return {
    snapshot: {
      paramMap: {
        get: (key: string) => ({ eventIndex: '0', slot, room }[key] ?? null)
      }
    }
  };
}

describe('TrackDetailComponent', () => {
  describe('when a matching TrackEntry is found', () => {
    beforeEach(async () => {
      const googleSheetsSpy = jasmine.createSpyObj('GoogleSheetsService', ['get']);
      googleSheetsSpy.get.and.returnValue(of([fixtureTrack]));

      await TestBed.configureTestingModule({
        declarations: [TrackDetailComponent],
        providers: [
          { provide: GoogleSheetsService, useValue: googleSheetsSpy },
          { provide: SHEETS_API_KEY, useValue: '' },
          { provide: ActivatedRoute, useValue: mockRoute('09:00', 'Raum A') },
          { provide: Location, useValue: jasmine.createSpyObj('Location', ['back']) },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    it('renders Titel, Raum, Slot, DigiKomp, presenter name and Beschreibungstext', () => {
      const fixture = TestBed.createComponent(TrackDetailComponent);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;

      expect(el.textContent).toContain('Test Session Title');
      expect(el.textContent).toContain('Speaker Name');
      expect(el.textContent).toContain('Raum A');
      expect(el.textContent).toContain('09:00');
      expect(el.innerHTML).toContain('<p>Session description text</p>');
      expect(el.querySelector('.dk4')).toBeTruthy();
    });

    it('renders Beschreibungstext as HTML, not escaped text', () => {
      const fixture = TestBed.createComponent(TrackDetailComponent);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;

      expect(el.innerHTML).toContain('<p>');
      expect(el.innerHTML).not.toContain('&lt;p&gt;');
    });
  });

  describe('when no matching TrackEntry is found', () => {
    beforeEach(async () => {
      const googleSheetsSpy = jasmine.createSpyObj('GoogleSheetsService', ['get']);
      googleSheetsSpy.get.and.returnValue(of([]));

      await TestBed.configureTestingModule({
        declarations: [TrackDetailComponent],
        providers: [
          { provide: GoogleSheetsService, useValue: googleSheetsSpy },
          { provide: SHEETS_API_KEY, useValue: '' },
          { provide: ActivatedRoute, useValue: mockRoute('unknown-slot', 'unknown-room') },
          { provide: Location, useValue: jasmine.createSpyObj('Location', ['back']) },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    it('renders the empty state without crashing', () => {
      const fixture = TestBed.createComponent(TrackDetailComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy();
      expect(fixture.componentInstance.track).toBeNull();
      expect(fixture.nativeElement.textContent).toContain('Session nicht gefunden');
    });
  });
});
