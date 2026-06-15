import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleSheetsService } from '../shared/google-sheets.service';
import { TrackEntry, trackentryAttributesMapping } from '../shared/model/track-entry';
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
export class FavoritenlisteComponent implements OnInit, OnDestroy {
  eventIndex = 0;
  eventName = '';
  loading = true;
  entries$: Observable<FavoritenlisteEntry[]> = of([]);
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private googleSheetsService: GoogleSheetsService,
    private favoritenliste: FavoritenlisteService
  ) {}

  ngOnInit(): void {
    this.entries$ = this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.eventIndex = Number(paramMap.get('eventIndex') ?? '0');
        this.loading = true;
        const event = environment.Events[this.eventIndex];
        if (!event) {
          this.loading = false;
          return of([]);
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

        return combineLatest([tracks$, timeslots$, favorites$]).pipe(
          map(([tracks, timeslots, favorites]) => {
            this.loading = false;
            return this.buildEntries(tracks, timeslots, favorites);
          })
        );
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    const entries: FavoritenlisteEntry[] = favorites.map(uid => {
      const track = trackByUid.get(uid);
      return track
        ? { uid, isMissing: false, track }
        : { uid, isMissing: true };
    });

    const orderOf = (entry: FavoritenlisteEntry) =>
      entry.track ? slotOrder.get(entry.track.Slot) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    return entries.sort((a, b) => orderOf(a) - orderOf(b));
  }

  goBack(): void {
    this.location.back();
  }
}
