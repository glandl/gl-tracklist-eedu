import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleSheetsService } from '../shared/google-sheets.service';
import { TrackEntry, trackentryAttributesMapping } from '../shared/model/track-entry';
import { TimeSlot, timeslotAttributesMapping } from '../shared/model/time-slot';
import { FavoritenlisteService } from '../shared/favoritenliste.service';

export interface FavoritenlisteEntry {
  uid: string;
  isMissing: boolean;
  track?: TrackEntry;
  timeSlot?: TimeSlot;
}

@Component({
  selector: 'app-favoritenliste',
  templateUrl: './favoritenliste.component.html',
  styleUrls: ['./favoritenliste.component.scss'],
  standalone: false
})
export class FavoritenlisteComponent implements OnInit {
  eventIndex = 0;
  eventName = '';
  loading = true;
  entries$: Observable<FavoritenlisteEntry[]> = of([]);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private googleSheetsService: GoogleSheetsService,
    private favoritenliste: FavoritenlisteService
  ) {}

  ngOnInit(): void {
    this.eventIndex = Number(this.route.snapshot.paramMap.get('eventIndex') ?? '0');
    const event = environment.Events[this.eventIndex];
    if (!event) {
      this.loading = false;
      return;
    }
    this.eventName = event.Name;

    const tracks$ = this.googleSheetsService.get<TrackEntry>(
      event.Tracks.spreadsheetID,
      event.Tracks.worksheetName,
      trackentryAttributesMapping
    );
    const timeslots$ = this.googleSheetsService.get<TimeSlot>(
      event.Tracks.spreadsheetID,
      event.TimeSlots.worksheetName,
      timeslotAttributesMapping
    );
    const favorites$ = this.favoritenliste.list$(event.Tracks.spreadsheetID);

    this.entries$ = combineLatest([tracks$, timeslots$, favorites$]).pipe(
      map(([tracks, timeslots, favorites]) => {
        this.loading = false;
        return this.buildEntries(tracks, timeslots, favorites);
      })
    );
  }

  private buildEntries(
    tracks: TrackEntry[],
    timeslots: TimeSlot[],
    favorites: string[]
  ): FavoritenlisteEntry[] {
    const trackByUid = new Map<string, TrackEntry>();
    for (const t of tracks) {
      if (t.SessionID) {
        trackByUid.set(t.SessionID, t);
      }
    }
    const slotOrder = new Map<string, number>();
    timeslots.forEach((ts, i) => slotOrder.set(ts.Slot, i));
    const timeslotBySlot = new Map<string, TimeSlot>();
    timeslots.forEach(ts => timeslotBySlot.set(ts.Slot, ts));

    const entries: FavoritenlisteEntry[] = favorites.map(uid => {
      const track = trackByUid.get(uid);
      if (!track) {
        return { uid, isMissing: true };
      }
      return {
        uid,
        isMissing: false,
        track,
        timeSlot: timeslotBySlot.get(track.Slot),
      };
    });

    const missingOrderIndex = Number.MAX_SAFE_INTEGER;
    return entries.sort((a, b) => {
      const ai = a.track ? slotOrder.get(a.track.Slot) ?? missingOrderIndex : missingOrderIndex;
      const bi = b.track ? slotOrder.get(b.track.Slot) ?? missingOrderIndex : missingOrderIndex;
      return ai - bi;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
