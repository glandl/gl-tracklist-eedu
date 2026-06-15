import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { ScheduleComponent } from './schedule.component';
import { GoogleSheetsService, SHEETS_API_KEY } from '../shared/google-sheets.service';
import { FavoritenlisteService } from '../shared/favoritenliste.service';
import { TrackEntry } from '../shared/model/track-entry';
import { Room } from '../shared/model/room';
import { TimeSlot } from '../shared/model/time-slot';
import { environment } from 'src/environments/environment';

const fixtureTrack1: TrackEntry = {
  id: '1',
  SessionID: '101',
  Titel: 'Test Session 1',
  Vortragende: 'Speaker One',
  Beschreibungstext: 'Description 1',
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
  Nachname: 'One',
  DetailLink: '',
};

const fixtureTrack2: TrackEntry = {
  id: '2',
  SessionID: '102',
  Titel: 'Test Session 2',
  Vortragende: 'Speaker Two',
  Beschreibungstext: 'Description 2',
  Slot: '10:00',
  Raum: 'Raum B',
  DigiKomp: '8',
  dkStyle: 'dk8',
  dk4: 0,
  dk8: 1,
  dk12: 0,
  dkP: 0,
  D: 0,
  Tech: 0,
  Vorname: 'Speaker',
  Nachname: 'Two',
  DetailLink: '',
};

const fixtureTrackNoUid: TrackEntry = {
  ...fixtureTrack1,
  SessionID: '',
};

const fixtureRoom: Room = {
  Raum: 'Raum A',
  RaumLink: '',
};

const fixtureTimeSlot: TimeSlot = {
  Datum: new Date(),
  von: { hours: 9, minutes: 0 },
  bis: { hours: 10, minutes: 0 },
  Slot: '09:00',
};

const sheetId = environment.Events[0].Tracks.spreadsheetID;

function mockGoogleSheetsService(tracks: TrackEntry[], rooms: Room[], timeslots: TimeSlot[]) {
  const service = jasmine.createSpyObj('GoogleSheetsService', ['get']);
  service.get.and.callFake((_spreadsheetId: string, _worksheetName: string, _mapping: any) => {
    if (_worksheetName.includes('Tracks')) {
      return of(tracks);
    } else if (_worksheetName.includes('Rooms')) {
      return of(rooms);
    } else {
      return of(timeslots);
    }
  });
  return service;
}

describe('ScheduleComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  async function setup(tracks: TrackEntry[] = [fixtureTrack1, fixtureTrack2]): Promise<void> {
    const rooms = [fixtureRoom];
    const timeslots = [fixtureTimeSlot];

    const googleSheetsSpy = mockGoogleSheetsService(tracks, rooms, timeslots);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      providers: [
        { provide: GoogleSheetsService, useValue: googleSheetsSpy },
        { provide: SHEETS_API_KEY, useValue: '' },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }

  describe('basic component behavior', () => {
    it('should create the component', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should initialize with spreadsheetId from the selected event', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.spreadsheetId).toBe(sheetId);
    });

    it('should update spreadsheetId when event changes', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      fixture.componentInstance.selectedEvent = 0;
      fixture.componentInstance.OnEventChanged();
      fixture.detectChanges();

      expect(fixture.componentInstance.spreadsheetId).toBe(sheetId);
    });
  });

  describe('favorite star toggle on Pivot Table cells', () => {
    it('should render a star_border icon for a cell with SessionID not in favorites', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      const starIcons = fixture.nativeElement.querySelectorAll('mat-icon');
      const starBorderIcons = Array.from(starIcons).filter((el: HTMLElement) =>
        el.textContent.includes('star_border')
      );
      expect(starBorderIcons.length).toBeGreaterThan(0);
    });

    it('should render a star icon for a cell with SessionID in favorites', async () => {
      await setup();
      const favoritenliste = TestBed.inject(FavoritenlisteService);
      favoritenliste.add('101', sheetId);

      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      const starIcons = fixture.nativeElement.querySelectorAll('mat-icon');
      const filledStarIcons = Array.from(starIcons).filter((el: HTMLElement) =>
        el.textContent.includes('star') && !el.textContent.includes('star_border')
      );
      expect(filledStarIcons.length).toBeGreaterThan(0);
    });

    it('isFavorite should return true when SessionID is in Favoritenliste', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      const favoritenliste = TestBed.inject(FavoritenlisteService);

      favoritenliste.add('101', sheetId);
      fixture.detectChanges();

      expect(fixture.componentInstance.isFavorite('101')).toBe(true);
      expect(fixture.componentInstance.isFavorite('102')).toBe(false);
    });

    it('isFavorite should return false when SessionID is not in Favoritenliste', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.isFavorite('101')).toBe(false);
    });

    it('toggleFavorite should add SessionID when not in favorites', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      const favoritenliste = TestBed.inject(FavoritenlisteService);
      fixture.detectChanges();

      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
      fixture.componentInstance.toggleFavorite('101', mockEvent as unknown as MouseEvent);

      expect(favoritenliste.contains('101', sheetId)).toBe(true);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('toggleFavorite should remove SessionID when already in favorites', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      const favoritenliste = TestBed.inject(FavoritenlisteService);

      favoritenliste.add('101', sheetId);
      fixture.detectChanges();

      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
      fixture.componentInstance.toggleFavorite('101', mockEvent as unknown as MouseEvent);

      expect(favoritenliste.contains('101', sheetId)).toBe(false);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not render star button for cells without SessionID', async () => {
      await setup([fixtureTrackNoUid]);
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      const starButtons = fixture.nativeElement.querySelectorAll('.favorite-star');
      expect(starButtons.length).toBe(0);
    });

    it('should call stopPropagation on star click to prevent cell navigation', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
      fixture.componentInstance.toggleFavorite('101', mockEvent as unknown as MouseEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('toolbar star button with badge', () => {
    it('should render a star button in the toolbar', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      const toolbarStar = fixture.nativeElement.querySelector('mat-toolbar button[mat-icon-button]');
      expect(toolbarStar).toBeTruthy();
      const icon = toolbarStar?.querySelector('mat-icon');
      expect(icon?.textContent).toContain('star');
    });

    it('should have a badge with the favorite count', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      const favoritenliste = TestBed.inject(FavoritenlisteService);

      favoritenliste.add('101', sheetId);
      favoritenliste.add('102', sheetId);
      fixture.detectChanges();

      const toolbarStar = fixture.nativeElement.querySelector('mat-toolbar button[matBadge]');
      expect(toolbarStar).toBeTruthy();
    });

    it('should hide badge when count is zero', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      fixture.detectChanges();

      const toolbarStar = fixture.nativeElement.querySelector('mat-toolbar button[matBadgeHidden]');
      expect(toolbarStar).toBeTruthy();
    });

    it('navigateToFavorites should navigate to /favorites/:selectedEvent', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      const router = TestBed.inject(Router);
      fixture.detectChanges();

      fixture.componentInstance.selectedEvent = 0;
      fixture.componentInstance.navigateToFavorites();

      expect(router.navigate).toHaveBeenCalledWith(['/favorites', 0]);
    });

    it('favoriteCount$ should emit the current count of favorites', async () => {
      await setup();
      const fixture = TestBed.createComponent(ScheduleComponent);
      const favoritenliste = TestBed.inject(FavoritenlisteService);
      fixture.detectChanges();

      let count: number | undefined;
      fixture.componentInstance.favoriteCount$.subscribe(c => count = c);

      expect(count).toBe(0);

      favoritenliste.add('101', sheetId);
      expect(count).toBe(1);

      favoritenliste.add('102', sheetId);
      expect(count).toBe(2);

      favoritenliste.remove('101', sheetId);
      expect(count).toBe(1);
    });
  });
});
