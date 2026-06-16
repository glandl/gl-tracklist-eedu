import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { FavoritenlisteComponent } from './favoritenliste.component';
import { GoogleSheetsService, SHEETS_API_KEY } from '../shared/google-sheets.service';
import { FavoritenlisteService } from '../shared/favoritenliste.service';
import { TrackEntry } from '../shared/model/track-entry';
import { TimeSlot } from '../shared/model/time-slot';
import { environment } from 'src/environments/environment';

function makeTrack(overrides: Partial<TrackEntry>): TrackEntry {
  return {
    id: '',
    SessionID: '',
    DigiKomp: '',
    Vortragende: '',
    D: 0,
    Slot: '',
    Raum: '',
    dk4: 0,
    dk8: 0,
    dk12: 0,
    dkP: 0,
    Tech: 0,
    Vorname: '',
    Nachname: '',
    Titel: '',
    DetailLink: '',
    dkStyle: '',
    Beschreibungstext: '',
    Favorisierbar: 'J',
    Schwerpunkte: '',
    ...overrides,
  };
}

function makeTimeslot(slot: string): TimeSlot {
  return {
    Slot: slot,
    Datum: new Date('2026-06-15') as any,
    von: { hours: 0, minutes: 0 } as any,
    bis: { hours: 0, minutes: 0 } as any,
  } as TimeSlot;
}

const tracks: TrackEntry[] = [
  makeTrack({ id: '1', SessionID: 'uid-A', Titel: 'Track A', Vorname: 'Speaker', Nachname: 'A', Vortragende: 'Speaker A', DigiKomp: '4', dkStyle: 'dk4', Slot: '10:00', Raum: 'Raum 1' }),
  makeTrack({ id: '2', SessionID: 'uid-B', Titel: 'Track B', Vorname: 'Speaker', Nachname: 'B', Vortragende: 'Speaker B', DigiKomp: '8', dkStyle: 'dk8', Slot: '09:00', Raum: 'Raum 2' }),
  makeTrack({ id: '3', SessionID: 'uid-C', Titel: 'Track C', Vorname: 'Speaker', Nachname: 'C', Vortragende: 'Speaker C', DigiKomp: '12', dkStyle: 'dk12', Slot: '11:00', Raum: 'Raum 3' }),
];

const timeslots: TimeSlot[] = [
  makeTimeslot('09:00'),
  makeTimeslot('10:00'),
  makeTimeslot('11:00'),
];

function configure(favorites: string[]) {
  const googleSheetsSpy = jasmine.createSpyObj<GoogleSheetsService>('GoogleSheetsService', ['get']);
  googleSheetsSpy.get.and.callFake((spreadsheetId: string, worksheet: string) => {
    if (worksheet === environment.Events[0].Tracks.worksheetName) {
      return of(tracks) as any;
    }
    if (worksheet === environment.Events[0].TimeSlots.worksheetName) {
      return of(timeslots) as any;
    }
    return of([]) as any;
  });

  const favoritenliste = new FavoritenlisteService();
  const spreadsheetId = environment.Events[0].Tracks.spreadsheetID;
  for (const uid of favorites) {
    favoritenliste.add(uid, spreadsheetId);
  }

  const route = {
    snapshot: {
      paramMap: { get: (k: string) => (k === 'eventIndex' ? '0' : null) }
    }
  };

  return TestBed.configureTestingModule({
    declarations: [FavoritenlisteComponent],
    providers: [
      { provide: GoogleSheetsService, useValue: googleSheetsSpy },
      { provide: SHEETS_API_KEY, useValue: '' },
      { provide: ActivatedRoute, useValue: route },
      { provide: Location, useValue: jasmine.createSpyObj('Location', ['back']) },
      { provide: FavoritenlisteService, useValue: favoritenliste },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
}

describe('FavoritenlisteComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders entries sorted in TimeSlot sheet order, not lexicographic', async () => {
    await configure(['uid-A', 'uid-C', 'uid-B']);
    const fixture = TestBed.createComponent(FavoritenlisteComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const titles = Array.from(fixture.nativeElement.querySelectorAll('.favorite .title'))
      .map((el: any) => el.textContent.trim());

    expect(titles).toEqual(['Track B', 'Track A', 'Track C']);
  });

  it('renders a struck-through placeholder for a UID not present in current sheet data', async () => {
    await configure(['uid-A', 'uid-ghost']);
    const fixture = TestBed.createComponent(FavoritenlisteComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const missing = fixture.nativeElement.querySelector('.favorite.missing');
    expect(missing).toBeTruthy();
    expect(missing.textContent).toContain('uid-ghost');
  });

  it('shows an empty state message when the Favoritenliste has no entries', async () => {
    await configure([]);
    const fixture = TestBed.createComponent(FavoritenlisteComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty-state');
    expect(empty).toBeTruthy();
    expect(empty.textContent.trim().length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('.favorite')).toBeNull();
  });

  it('renders Titel, Vortragende, DigiKomp, TimeSlot and Raum for each entry', async () => {
    await configure(['uid-A']);
    const fixture = TestBed.createComponent(FavoritenlisteComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Track A');
    expect(el.textContent).toContain('Speaker A');
    expect(el.textContent).toContain('10:00');
    expect(el.textContent).toContain('Raum 1');
    expect(el.querySelector('.digikomp-badge')?.textContent?.trim()).toBe('DigiKomp 4');
  });

  it('sets a routerLink on a non-missing entry pointing to the detail route', async () => {
    await configure(['uid-A']);
    const fixture = TestBed.createComponent(FavoritenlisteComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const entry = fixture.nativeElement.querySelector('.favorite:not(.missing)') as HTMLElement;
    expect(entry).toBeTruthy();
    const componentInstance = fixture.componentInstance;
    expect(componentInstance.eventIndex).toBe(0);
  });
});
