# Keep the Tracks sheet as the single joined data source

Issue #12 proposed splitting the `Tracks` worksheet into a content-only tab (keyed by `id`) and a separate TimeSlot+Raum+TrackID schedule-link tab, to be joined at runtime by `AppComponent`/`ScheduleComponent`. The actual restructuring turned out simpler: `Tracks` remains the single, fully-joined sheet (session content is pulled in via spreadsheet formulas). The only change needed for issue #5 (Favoritenliste) was adding a new `SessionID` column to `Tracks`, mapped to a new `TrackEntry.SessionID` field in `track-entry.ts`, alongside the existing `id` field. The two serve different purposes: `id` identifies the Tracks-sheet row (a TimeSlot+Room position), while `SessionID` identifies the session content assigned to that position and stays stable across rescheduling — `SessionID` is therefore the identifier Favoritenliste (#5-#11) must use, not `id`.

A `Beiträge` worksheet exists as the spreadsheet-internal source for those formulas plus a `SessionLink` helper column for the maintainer, but the app never reads it directly, so the `Sessions` entry added to `environment.ts`/`environment.prod.ts` in anticipation of the split was removed.

No data-fetching or pivot-building logic in `ScheduleComponent` changed as a result.
