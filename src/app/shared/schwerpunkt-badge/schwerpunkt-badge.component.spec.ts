import { TestBed } from '@angular/core/testing';
import { SchwerpunktBadgeComponent } from './schwerpunkt-badge.component';
import { Schwerpunkt } from '../model/schwerpunkt';

const fixtureSchwerpunkte: Schwerpunkt[] = [
  { key: 'ki', label: 'Künstliche Intelligenz', color: '#E53935', textColor: '#FFFFFF' },
  { key: 'datenschutz', label: 'Datenschutz', color: '#1E88E5', textColor: '#000000' },
];

describe('SchwerpunktBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchwerpunktBadgeComponent],
    }).compileComponents();
  });

  it('renders one badge per Schwerpunkt', () => {
    const fixture = TestBed.createComponent(SchwerpunktBadgeComponent);
    fixture.componentInstance.schwerpunkte = fixtureSchwerpunkte;
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll('.schwerpunkt-badge');
    expect(badges.length).toBe(2);
  });

  it('renders the Bezeichnung as badge text', () => {
    const fixture = TestBed.createComponent(SchwerpunktBadgeComponent);
    fixture.componentInstance.schwerpunkte = [fixtureSchwerpunkte[0]];
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.schwerpunkt-badge');
    expect(badge.textContent.trim()).toBe('Künstliche Intelligenz');
  });

  it('applies background-color and color as inline styles', () => {
    const fixture = TestBed.createComponent(SchwerpunktBadgeComponent);
    fixture.componentInstance.schwerpunkte = [fixtureSchwerpunkte[0]];
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.schwerpunkt-badge');
    expect(badge.style.backgroundColor).toBeTruthy();
    expect(badge.style.color).toBeTruthy();
  });

  it('renders no badges when schwerpunkte is empty', () => {
    const fixture = TestBed.createComponent(SchwerpunktBadgeComponent);
    fixture.componentInstance.schwerpunkte = [];
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll('.schwerpunkt-badge');
    expect(badges.length).toBe(0);
  });

  it('renders no wrapper element when schwerpunkte is empty', () => {
    const fixture = TestBed.createComponent(SchwerpunktBadgeComponent);
    fixture.componentInstance.schwerpunkte = [];
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('.schwerpunkt-badges');
    expect(wrapper).toBeNull();
  });
});
