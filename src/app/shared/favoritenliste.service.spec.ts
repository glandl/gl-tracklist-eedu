import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { FavoritenlisteService } from './favoritenliste.service';

const SHEET_A = 'spreadsheet-id-a';
const SHEET_B = 'spreadsheet-id-b';

function storageKey(spreadsheetId: string): string {
  return `favoritenliste_${spreadsheetId}`;
}

describe('FavoritenlisteService', () => {
  let service: FavoritenlisteService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritenlisteService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('localStorage key format', () => {
    it('writes UIDs under favoritenliste_<spreadsheetID>', () => {
      service.add('uid-1', SHEET_A);

      expect(localStorage.getItem(storageKey(SHEET_A))).toBeTruthy();
      expect(JSON.parse(localStorage.getItem(storageKey(SHEET_A))!)).toEqual(['uid-1']);
    });

    it('scopes UIDs to their spreadsheetID', () => {
      service.add('uid-1', SHEET_A);
      service.add('uid-2', SHEET_B);

      expect(service.list(SHEET_A)).toEqual(['uid-1']);
      expect(service.list(SHEET_B)).toEqual(['uid-2']);
    });
  });

  describe('add', () => {
    it('appends a UID', () => {
      service.add('uid-1', SHEET_A);
      expect(service.list(SHEET_A)).toEqual(['uid-1']);
    });

    it('is idempotent for duplicate UIDs', () => {
      service.add('uid-1', SHEET_A);
      service.add('uid-1', SHEET_A);
      service.add('uid-1', SHEET_A);
      expect(service.list(SHEET_A)).toEqual(['uid-1']);
    });

    it('preserves order of distinct UIDs', () => {
      service.add('uid-1', SHEET_A);
      service.add('uid-2', SHEET_A);
      service.add('uid-3', SHEET_A);
      expect(service.list(SHEET_A)).toEqual(['uid-1', 'uid-2', 'uid-3']);
    });
  });

  describe('remove', () => {
    it('removes an existing UID', () => {
      service.add('uid-1', SHEET_A);
      service.add('uid-2', SHEET_A);
      service.remove('uid-1', SHEET_A);
      expect(service.list(SHEET_A)).toEqual(['uid-2']);
    });

    it('is a no-op for an absent UID', () => {
      service.add('uid-1', SHEET_A);
      expect(() => service.remove('uid-does-not-exist', SHEET_A)).not.toThrow();
      expect(service.list(SHEET_A)).toEqual(['uid-1']);
    });

    it('is a no-op when no UIDs exist for the spreadsheet', () => {
      expect(() => service.remove('uid-1', SHEET_A)).not.toThrow();
      expect(service.list(SHEET_A)).toEqual([]);
    });
  });

  describe('contains', () => {
    it('returns true for a stored UID', () => {
      service.add('uid-1', SHEET_A);
      expect(service.contains('uid-1', SHEET_A)).toBe(true);
    });

    it('returns false for an unstored UID', () => {
      expect(service.contains('uid-1', SHEET_A)).toBe(false);
    });

    it('returns false for a UID stored under a different spreadsheet', () => {
      service.add('uid-1', SHEET_A);
      expect(service.contains('uid-1', SHEET_B)).toBe(false);
    });
  });

  describe('list', () => {
    it('returns an empty array when nothing is stored', () => {
      expect(service.list(SHEET_A)).toEqual([]);
    });

    it('returns a copy that cannot mutate internal state', () => {
      service.add('uid-1', SHEET_A);
      const result = service.list(SHEET_A);
      result.push('uid-mutated');
      expect(service.list(SHEET_A)).toEqual(['uid-1']);
    });
  });

  describe('observable', () => {
    it('emits the current list synchronously on subscribe', (done) => {
      service.add('uid-1', SHEET_A);

      service.list$(SHEET_A).pipe(take(1)).subscribe(value => {
        expect(value).toEqual(['uid-1']);
        done();
      });
    });

    it('emits an updated value after add', (done) => {
      const seen: string[][] = [];
      const sub = service.list$(SHEET_A).subscribe(value => seen.push(value));

      service.add('uid-1', SHEET_A);
      service.add('uid-2', SHEET_A);

      sub.unsubscribe();
      expect(seen[seen.length - 1]).toEqual(['uid-1', 'uid-2']);
      done();
    });

    it('emits an updated value after remove', (done) => {
      service.add('uid-1', SHEET_A);
      service.add('uid-2', SHEET_A);

      const seen: string[][] = [];
      const sub = service.list$(SHEET_A).subscribe(value => seen.push(value));

      service.remove('uid-1', SHEET_A);

      sub.unsubscribe();
      expect(seen[seen.length - 1]).toEqual(['uid-2']);
      done();
    });

    it('does not emit on other spreadsheets', (done) => {
      const seenA: string[][] = [];
      const sub = service.list$(SHEET_A).subscribe(value => seenA.push(value));
      const initialCount = seenA.length;

      service.add('uid-1', SHEET_B);

      sub.unsubscribe();
      expect(seenA.length).toBe(initialCount);
      done();
    });

    it('returns the same observable instance for the same spreadsheetID', () => {
      const obs1 = service.list$(SHEET_A);
      const obs2 = service.list$(SHEET_A);
      expect(obs1).toBe(obs2);
    });
  });

  describe('persistence across service instances', () => {
    it('reads existing localStorage on init', () => {
      localStorage.setItem(storageKey(SHEET_A), JSON.stringify(['uid-persisted']));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(FavoritenlisteService);

      expect(freshService.list(SHEET_A)).toEqual(['uid-persisted']);
      expect(freshService.contains('uid-persisted', SHEET_A)).toBe(true);
    });

    it('tolerates corrupt localStorage entries', () => {
      localStorage.setItem(storageKey(SHEET_A), 'not-json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(FavoritenlisteService);

      expect(freshService.list(SHEET_A)).toEqual([]);
    });
  });
});
