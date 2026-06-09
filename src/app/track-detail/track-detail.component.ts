import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GoogleSheetsService } from '../shared/google-sheets.service';
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

  private slot = '';
  private room = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private googleSheetsService: GoogleSheetsService
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

    this.googleSheetsService
      .get<TrackEntry>(
        event.Tracks.spreadsheetID,
        event.Tracks.worksheetName,
        trackentryAttributesMapping
      )
      .subscribe({
        next: (tracks) => {
          this.track = tracks.find(t => t.Slot === this.slot && t.Raum === this.room) ?? null;
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

  goBack(): void {
    this.location.back();
  }
}
