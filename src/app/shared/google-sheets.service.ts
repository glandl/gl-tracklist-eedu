import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const SHEETS_API_KEY = new InjectionToken<string>('SHEETS_API_KEY');

@Injectable({ providedIn: 'root' })
export class GoogleSheetsService {
  private readonly apiBase = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(
    private http: HttpClient,
    @Inject(SHEETS_API_KEY) private apiKey: string
  ) {}

  get<T>(
    spreadsheetId: string,
    worksheetName: string,
    attributesMapping: Record<string, string>
  ): Observable<T[]> {
    const url = `${this.apiBase}/${spreadsheetId}/values/${encodeURIComponent(worksheetName)}?key=${this.apiKey}`;
    return this.http.get<{ values: string[][] }>(url).pipe(
      map(response => {
        const [headers, ...rows] = response.values ?? [];
        if (!headers) return [];

        // Reverse the mapping: sheetColumnHeader -> modelKey
        const headerToKey: Record<string, string> = {};
        for (const [modelKey, sheetHeader] of Object.entries(attributesMapping)) {
          headerToKey[sheetHeader] = modelKey;
        }

        return rows.map(row => {
          const obj: any = {};
          headers.forEach((header, i) => {
            const key = headerToKey[header];
            if (key !== undefined) {
              obj[key] = row[i] ?? '';
            }
          });
          return obj as T;
        });
      })
    );
  }
}
