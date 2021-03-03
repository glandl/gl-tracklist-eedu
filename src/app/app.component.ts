import { Component, OnInit } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Room, roomAttributesMapping } from './shared/model/room';
import { TimeSlot, timeslotAttributesMapping } from './shared/model/time-slot';
import { TrackEntry, trackentryAttributesMapping } from './shared/model/track-entry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title: string = 'eEducation Event Tracklist';
  public displayedColumns: string[] = ['Zeit'];

  public tracks$: Observable<TrackEntry[]>;
  public rooms$: Observable<Room[]>;
  public timeslots$: Observable<TimeSlot[]>;
  public tracksPivot: Record<string,any> = {};
  public arrPivot: any[] = [];


  public roomNames: string[] = [];
  public rooms: Record<string, Room> = {};



  constructor(private googleSheetsDbService: GoogleSheetsDbService) {
    this.rooms$ = this.googleSheetsDbService.get<Room>(environment.Rooms.spreadsheetID, environment.Rooms.worksheetID, roomAttributesMapping);
    this.tracks$ = this.googleSheetsDbService.get<TrackEntry>(environment.Tracks.spreadsheetID, environment.Tracks.worksheetID, trackentryAttributesMapping);
    this.timeslots$ = this.googleSheetsDbService.get<TimeSlot>(environment.Tracks.spreadsheetID, environment.TimeSlots.worksheetID, timeslotAttributesMapping);
  }

  ngOnInit(): void {
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
    () => { this.getTimeSlots(); });
  }

  getTimeSlots(): void{
    this.tracksPivot = {};
    this.timeslots$.subscribe( timeslot => {
      timeslot.forEach(ts => {
        this.tracksPivot[ts['Slot']] = {};
        this.roomNames.forEach(rn => {
          this.tracksPivot[ts['Slot']][rn] = 'NN';
        });
      });
    },
    err => {},
    () => { this.generateTrackPivot(); });
  }

  generateTrackPivot(): void {
    this.tracks$.subscribe(tr => {
      tr.forEach(trElem => {
        this.tracksPivot[trElem.Slot][trElem.Raum] = trElem.Vortragende;
      });
      Object.keys(this.tracksPivot).forEach(k => {
        this.arrPivot.push({Zeit: k, ...this.tracksPivot[k]});
      });
    });
  }
}
