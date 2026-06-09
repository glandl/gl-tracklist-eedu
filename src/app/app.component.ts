import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GoogleSheetsService } from './shared/google-sheets.service';
import { Observable } from 'rxjs';
import { last } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Room, roomAttributesMapping } from './shared/model/room';
import { TimeSlot, timeslotAttributesMapping } from './shared/model/time-slot';
import { TrackEntry, trackentryAttributesMapping } from './shared/model/track-entry';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit{
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

  public arrPivot: any[] = [];
  public tableDS = new MatTableDataSource([]);
  public arrEvents: any[] = environment.Events;
  public selectedEvent: number = 0;

  constructor(private googleSheetsService: GoogleSheetsService) {}

  ngOnInit(): void {
    this.rooms$ = this.googleSheetsService.get<Room>(environment.Events[this.selectedEvent].Rooms.spreadsheetID, environment.Events[this.selectedEvent].Rooms.worksheetName, roomAttributesMapping);
    this.tracks$ = this.googleSheetsService.get<TrackEntry>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].Tracks.worksheetName, trackentryAttributesMapping);
    this.timeslots$ = this.googleSheetsService.get<TimeSlot>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].TimeSlots.worksheetName, timeslotAttributesMapping);
    this.getRooms();
  }

  getRooms(): void {
    this.roomNames = [];
    this.rooms$.subscribe(r => {
      r.forEach(element => {
        this.roomNames.push(element['Raum']);
        this.rooms[element['Raum']] = element
      });
    },
    err => {},
    () => {
      this.allColumns = ['Zeit', ...this.roomNames];
      this.getTimeSlots();
    });
  }

  getTimeSlots(): void{
    this.tracksPivot = {};
    this.timeslots$.subscribe( timeslot => {
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
    this.tracks$.pipe(last(),).subscribe(tr => {
      this.arrTracks = tr;
      this.filterTable();
    },
    err => {},
    () => {
      this.tableDS = new MatTableDataSource(this.arrPivot);
      this.table.renderRows();
    });
  }

  filterTable(): void{
    this.arrTracks.forEach(trElem => {
      this.tracksPivot[trElem.Slot][trElem.Raum] = trElem;
    });
    Object.keys(this.tracksPivot).forEach(k => {
      this.arrPivot.push({Zeit: k, ...this.tracksPivot[k]});
    });
  }

  OnEventChanged(){
    this.arrPivot = [];
    this.arrTracks = [];
    this.roomNames = [];
    this.allColumns = ['Zeit'];
    this.rooms$ = this.googleSheetsService.get<Room>(environment.Events[this.selectedEvent].Rooms.spreadsheetID, environment.Events[this.selectedEvent].Rooms.worksheetName, roomAttributesMapping);
    this.tracks$ = this.googleSheetsService.get<TrackEntry>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].Tracks.worksheetName, trackentryAttributesMapping);
    this.timeslots$ = this.googleSheetsService.get<TimeSlot>(environment.Events[this.selectedEvent].Tracks.spreadsheetID, environment.Events[this.selectedEvent].TimeSlots.worksheetName, timeslotAttributesMapping);
    this.getRooms();
  }
}
