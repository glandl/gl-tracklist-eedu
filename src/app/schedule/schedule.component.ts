import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GoogleSheetsService } from '../shared/google-sheets.service';
import { FavoritenlisteService } from '../shared/favoritenliste.service';
import { Observable } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Room, roomAttributesMapping } from '../shared/model/room';
import { TimeSlot, timeslotAttributesMapping } from '../shared/model/time-slot';
import { TrackEntry, trackentryAttributesMapping, isFavoritable as isTrackFavoritable } from '../shared/model/track-entry';
import { Schwerpunkt, schwerpunktAttributesMapping } from '../shared/model/schwerpunkt';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
    standalone: false
})
export class ScheduleComponent implements OnInit {
  title: string = 'eEducation Event Tracklist';
  public displayedColumns: string[] = ['Zeit'];
  @ViewChild(MatTable) table: MatTable<any>;

  public tracks$: Observable<TrackEntry[]>;
  public arrTracks: TrackEntry[] = [];
  public rooms$: Observable<Room[]>;
  public timeslots$: Observable<TimeSlot[]>;
  public tracksPivot: Record<string,any> = {};

  public roomNames: string[] = [];
  public allColumns: string[] = ['Zeit'];
  public rooms: Record<string, Room> = {};
  public schwerpunkte: Schwerpunkt[] = [];

  public arrPivot: any[] = [];
  public tableDS = new MatTableDataSource([]);
  public arrEvents: any[] = environment.Events;
  public selectedEvent: number = 0;
  public spreadsheetId: string = '';
  public favoriteCount$: Observable<number>;

  constructor(
    private googleSheetsService: GoogleSheetsService,
    private favoritenliste: FavoritenlisteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateSpreadsheetId();
    this.rooms$ = this.googleSheetsService.get<Room>(environment.Events[this.selectedEvent].Rooms.spreadsheetID, environment.Events[this.selectedEvent].Rooms.worksheetName, roomAttributesMapping);
    this.tracks$ = this.googleSheetsService.get<TrackEntry>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].Tracks.worksheetName, trackentryAttributesMapping);
    this.timeslots$ = this.googleSheetsService.get<TimeSlot>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].TimeSlots.worksheetName, timeslotAttributesMapping);
    this.loadSchwerpunkte();
    this.getRooms();
  }

  loadSchwerpunkte(): void {
    const event = environment.Events[this.selectedEvent];
    if (!event.Schwerpunkte) return;
    this.googleSheetsService.get<Schwerpunkt>(
      event.Schwerpunkte.spreadsheetID,
      event.Schwerpunkte.worksheetName,
      schwerpunktAttributesMapping
    ).subscribe(list => {
      this.schwerpunkte = list.map(s => ({ ...s, textColor: s.textColor?.trim() || '#000000' }));
    });
  }

  getRooms(): void {
    this.roomNames = [];
    this.rooms$.subscribe(r => {
      r.forEach(element => {
        this.roomNames.push(element['Raum']);
        this.rooms[element['Raum']] = element;
      });
    },
    err => {},
    () => {
      this.allColumns = ['Zeit', ...this.roomNames];
      this.getTimeSlots();
    });
  }

  getTimeSlots(): void {
    this.tracksPivot = {};
    this.timeslots$.subscribe(timeslot => {
      timeslot.forEach(ts => {
        this.tracksPivot[ts['Slot']] = {};
        this.roomNames.forEach(rn => {
          this.tracksPivot[ts['Slot']][rn] = {} as TrackEntry;
        });
      });
    },
    err => {},
    () => { this.generateTrackPivot(); });
  }

  generateTrackPivot(): void {
    this.tracks$.pipe(last()).subscribe(tr => {
      this.arrTracks = tr;
      this.filterTable();
    },
    err => {},
    () => {
      this.tableDS = new MatTableDataSource(this.arrPivot);
      this.table?.renderRows();
    });
  }

  filterTable(): void {
    this.arrTracks.forEach(trElem => {
      if (!this.tracksPivot[trElem.Slot] || !(trElem.Raum in this.tracksPivot[trElem.Slot])) {
        return;
      }
      if (trElem.SessionID === '#N/A') {
        return;
      }
      this.tracksPivot[trElem.Slot][trElem.Raum] = trElem;
    });
    Object.keys(this.tracksPivot).forEach(k => {
      this.arrPivot.push({Zeit: k, ...this.tracksPivot[k]});
    });
  }

  updateSpreadsheetId(): void {
    const event = environment.Events[this.selectedEvent];
    this.spreadsheetId = event?.Tracks?.spreadsheetID ?? '';
    this.favoriteCount$ = this.favoritenliste.list$(this.spreadsheetId).pipe(
      map(list => list.length)
    );
  }

  OnEventChanged(): void {
    this.arrPivot = [];
    this.arrTracks = [];
    this.roomNames = [];
    this.allColumns = ['Zeit'];
    this.schwerpunkte = [];
    this.updateSpreadsheetId();
    this.rooms$ = this.googleSheetsService.get<Room>(environment.Events[this.selectedEvent].Rooms.spreadsheetID, environment.Events[this.selectedEvent].Rooms.worksheetName, roomAttributesMapping);
    this.tracks$ = this.googleSheetsService.get<TrackEntry>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].Tracks.worksheetName, trackentryAttributesMapping);
    this.timeslots$ = this.googleSheetsService.get<TimeSlot>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].TimeSlots.worksheetName, timeslotAttributesMapping);
    this.loadSchwerpunkte();
    this.getRooms();
  }

  isFavorite(uid: string): boolean {
    return this.favoritenliste.contains(uid, this.spreadsheetId);
  }

  isFavoritable(track: TrackEntry | undefined): boolean {
    return isTrackFavoritable(track);
  }

  toggleFavorite(uid: string, $event: MouseEvent): void {
    $event.stopPropagation();
    if (this.favoritenliste.contains(uid, this.spreadsheetId)) {
      this.favoritenliste.remove(uid, this.spreadsheetId);
    } else {
      this.favoritenliste.add(uid, this.spreadsheetId);
    }
  }

  navigateToFavorites(): void {
    this.router.navigate(['/favorites', this.selectedEvent]);
  }
}
