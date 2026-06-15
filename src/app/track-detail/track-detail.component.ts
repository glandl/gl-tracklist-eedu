import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleSheetsService } from '../shared/google-sheets.service';
import { FavoritenlisteService } from '../shared/favoritenliste.service';
import { TrackEntry, trackentryAttributesMapping } from '../shared/model/track-entry';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.scss'],
  standalone: false
})
export class TrackDetailComponent implements OnInit {
  track: TrackEntry | null = null;
  loading = true;
  eventName = '';
  isFavorite$: Observable<boolean> = of(false);

  private slot = '';
  private room = '';
  private spreadsheetId = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private googleSheetsService: GoogleSheetsService,
    private favoritenliste: FavoritenlisteService
  ) {}

  ngOnInit(): void {
    const eventIndex = Number(this.route.snapshot.paramMap.get('eventIndex') ?? '0');
    this.slot = this.route.snapshot.paramMap.get('slot') ?? '';
    this.room = this.route.snapshot.paramMap.get('room') ?? '';

    const event = environment.Events[eventIndex];
    if (!event) {
      this.loading = false;
      return;
    }

    this.eventName = event.Name;
    this.spreadsheetId = event.Tracks.spreadsheetID;

    this.googleSheetsService
      .get<TrackEntry>(
        event.Tracks.spreadsheetID,
        event.Tracks.worksheetName,
        trackentryAttributesMapping
      )
      .subscribe({
        next: (tracks) => {
          this.track = tracks.find(t => t.Slot === this.slot && t.Raum === this.room) ?? null;
          this.isFavorite$ = this.track && this.track.SessionID
            ? this.favoritenliste.list$(this.spreadsheetId).pipe(
                map(list => list.includes(this.track!.SessionID))
              )
            : of(false);
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  get digiKompLabel(): string {
    const labels: Record<string, string> = {
      dk4: 'DigiKomp 4',
      dk8: 'DigiKomp 8',
      dk12: 'DigiKomp 12',
      dkP: 'DigiKomp P',
      dkTech: 'DigiKomp Tech',
    };
    return labels[this.track?.dkStyle ?? ''] ?? '';
  }

  get canFavorite(): boolean {
    return !!(this.track && this.track.SessionID);
  }

  toggleFavorite(): void {
    if (!this.track || !this.track.SessionID) return;
    const uid = this.track.SessionID;
    if (this.favoritenliste.contains(uid, this.spreadsheetId)) {
      this.favoritenliste.remove(uid, this.spreadsheetId);
    } else {
      this.favoritenliste.add(uid, this.spreadsheetId);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
