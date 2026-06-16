import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const KEY_PREFIX = 'favoritenliste_';

@Injectable({ providedIn: 'root' })
export class FavoritenlisteService {
  private subjects = new Map<string, BehaviorSubject<string[]>>();
  private observables = new Map<string, Observable<string[]>>();

  add(uid: string, spreadsheetId: string): void {
    const current = this.read(spreadsheetId);
    if (current.includes(uid)) {
      return;
    }
    const next = [...current, uid];
    this.write(spreadsheetId, next);
  }

  remove(uid: string, spreadsheetId: string): void {
    const current = this.read(spreadsheetId);
    if (!current.includes(uid)) {
      return;
    }
    const next = current.filter(x => x !== uid);
    this.write(spreadsheetId, next);
  }

  contains(uid: string, spreadsheetId: string): boolean {
    return this.read(spreadsheetId).includes(uid);
  }

  list(spreadsheetId: string): string[] {
    return [...this.read(spreadsheetId)];
  }

  list$(spreadsheetId: string): Observable<string[]> {
    let obs = this.observables.get(spreadsheetId);
    if (!obs) {
      obs = this.subjectFor(spreadsheetId).asObservable();
      this.observables.set(spreadsheetId, obs);
    }
    return obs;
  }

  private subjectFor(spreadsheetId: string): BehaviorSubject<string[]> {
    let subject = this.subjects.get(spreadsheetId);
    if (!subject) {
      subject = new BehaviorSubject<string[]>(this.readFromStorage(spreadsheetId));
      this.subjects.set(spreadsheetId, subject);
    }
    return subject;
  }

  private read(spreadsheetId: string): string[] {
    return this.subjectFor(spreadsheetId).getValue();
  }

  private write(spreadsheetId: string, next: string[]): void {
    localStorage.setItem(this.storageKey(spreadsheetId), JSON.stringify(next));
    this.subjectFor(spreadsheetId).next(next);
  }

  private readFromStorage(spreadsheetId: string): string[] {
    const raw = localStorage.getItem(this.storageKey(spreadsheetId));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private storageKey(spreadsheetId: string): string {
    return `${KEY_PREFIX}${spreadsheetId}`;
  }
}
