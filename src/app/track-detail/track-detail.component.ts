import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.scss'],
  standalone: false
})
export class TrackDetailComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
