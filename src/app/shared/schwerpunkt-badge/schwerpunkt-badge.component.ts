import { Component, Input } from '@angular/core';
import { Schwerpunkt } from '../model/schwerpunkt';

@Component({
  selector: 'app-schwerpunkt-badge',
  templateUrl: './schwerpunkt-badge.component.html',
  styleUrls: ['./schwerpunkt-badge.component.scss'],
  standalone: false
})
export class SchwerpunktBadgeComponent {
  @Input() schwerpunkte: Schwerpunkt[] = [];
}
