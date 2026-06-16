import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleSheetsService } from '../shared/google-sheets.service';
import { TrackEntry, trackentryAttributesMapping, getDigiKompLabel } from '../shared/model/track-entry';
import { Schwerpunkt, schwerpunktAttributesMapping, resolveSchwerpunkte } from '../shared/model/schwerpunkt';
import { TimeSlot, timeslotAttributesMapping } from '../shared/model/time-slot';
import { FavoritenlisteService } from '../shared/favoritenliste.service';

export interface FavoritenlisteEntry {
  uid: string;
  isMissing: boolean;
  track?: TrackEntry;
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
  entries$: Observable<FavoritenlisteEntry[]> = of([]);
  schwerpunkte: Schwerpunkt[] = [];

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
      return;
    }
    this.eventName = event.Name;

    if (event.Schwerpunkte) {
      this.googleSheetsService
        .get<Schwerpunkt>(event.Schwerpunkte.spreadsheetID, event.Schwerpunkte.worksheetName, schwerpunktAttributesMapping)
        .pipe(catchError(() => of([] as Schwerpunkt[])))
        .subscribe(list => {
          this.schwerpunkte = list.map(s => ({ ...s, textColor: s.textColor?.trim() || '#000000' }));
        });
    }

    const tracks$ = this.googleSheetsService.get<TrackEntry>(
      event.Tracks.spreadsheetID,
      event.Tracks.worksheetName,
      trackentryAttributesMapping
    ).pipe(
      timeout(10000),
      catchError(() => of([] as TrackEntry[]))
    );
    const timeslots$ = this.googleSheetsService.get<TimeSlot>(
      event.Tracks.spreadsheetID,
      event.TimeSlots.worksheetName,
      timeslotAttributesMapping
    ).pipe(
      timeout(10000),
      catchError(() => of([] as TimeSlot[]))
    );
    const favorites$ = this.favoritenliste.list$(event.Tracks.spreadsheetID);

    this.entries$ = combineLatest([tracks$, timeslots$, favorites$]).pipe(
      map(([tracks, timeslots, favorites]) => this.buildEntries(tracks, timeslots, favorites)),
      catchError(() => of([] as FavoritenlisteEntry[]))
    );
  }

  private buildEntries(
    tracks: TrackEntry[],
    timeslots: TimeSlot[],
    favorites: string[]
  ): FavoritenlisteEntry[] {
    const tracksByUid = new Map<string, TrackEntry[]>();
    for (const t of tracks) {
      if (t.SessionID) {
        const list = tracksByUid.get(t.SessionID);
        if (list) {
          list.push(t);
        } else {
          tracksByUid.set(t.SessionID, [t]);
        }
      }
    }
    const slotOrder = new Map<string, number>();
    timeslots.forEach((ts, i) => slotOrder.set(ts.Slot, i));

    const entries: FavoritenlisteEntry[] = favorites.flatMap(uid => {
      const matchingTracks = tracksByUid.get(uid);
      return matchingTracks
        ? matchingTracks.map((track): FavoritenlisteEntry => ({ uid, isMissing: false, track }))
        : [{ uid, isMissing: true } as FavoritenlisteEntry];
    });

    const orderOf = (entry: FavoritenlisteEntry) =>
      entry.track ? slotOrder.get(entry.track.Slot) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    return entries.sort((a, b) => orderOf(a) - orderOf(b));
  }

  digiKompLabel(track: TrackEntry): string {
    return getDigiKompLabel(track.dkStyle);
  }

  getSchwerpunkte(track: TrackEntry): Schwerpunkt[] {
    return resolveSchwerpunkte(track.Schwerpunkte, this.schwerpunkte);
  }

  goBack(): void {
    this.location.back();
  }
}
