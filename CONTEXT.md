# eEducation Tagungsprogramme

A single-page app that displays conference and workshop schedules as pivot tables, sourced from Google Sheets.

## Language

**Event** (Veranstaltung):
A conference or workshop edition with its own schedule, backed by a dedicated Google Spreadsheet. Users select the active Event from a dropdown.
_Avoid_: Conference, schedule, programme

**TrackEntry** (Track):
A single session or talk within an Event, assigned to exactly one Room and one TimeSlot. Sourced entirely from the `Tracks` worksheet, which already joins schedule assignment (Slot, Raum) with session content (Titel, Vortragende, etc.) via spreadsheet formulas. Each TrackEntry has two distinct identifiers: `id` (the identity of the Tracks-sheet row itself, i.e. this TimeSlot+Room position) and `SessionID` (the identity of the session assigned to that position, stable across rescheduling — see Favoritenliste).
_Avoid_: Session, talk, item, slot (ambiguous with TimeSlot)

**Room** (Raum):
A named location where TrackEntries take place. May carry an optional URL link.
_Avoid_: Location, venue, column

**TimeSlot** (Slot):
A named time block in an Event's schedule. Defines the rows of the pivot table.
_Avoid_: Time, period, row

**Pivot Table**:
The main view — rows are TimeSlots, columns are Rooms, each cell is a TrackEntry (or empty).
_Avoid_: Table, grid, schedule view

**Vortragende**:
Pre-formatted HTML listing the presenter(s) of a TrackEntry, used for compact display in the pivot table cell.
_Avoid_: Presenter, speaker, author

**Beschreibungstext**:
The full HTML description of a TrackEntry, intended for the detail view. Previously only surfaced as a tooltip.
_Avoid_: Description, abstract, detail text

**DigiKomp**:
An Austrian digital competency framework. Each TrackEntry is tagged with one or more DigiKomp levels (4, 8, 12, P), surfaced as a CSS style class (`dkStyle`) and numeric fields (`dk4`, `dk8`, `dk12`, `dkP`).
_Avoid_: Category, tag, competency level

**Favoritenliste**:
A user's personal collection of TrackEntries they plan to attend, stored locally in the browser (localStorage). Identified by each TrackEntry's `SessionID` (not `id`), so entries survive rescheduling — a TrackEntry's `id` changes if it moves to a different TimeSlot/Room row, but its `SessionID` does not.
_Avoid_: Bookmarks, Merkliste, Watchlist, personal track list

**Favorisierbar**:
A per-TrackEntry flag (`"J"`/`"N"`, blank treated as `"N"`) sourced from the Tracks sheet, marking whether a TrackEntry may be added to the Favoritenliste at all — e.g. a Pause is not Favorisierbar. When a TrackEntry is not Favorisierbar, the Pivot Table cell shows no star toggle and is not a link to the detail view. Entries already in someone's Favoritenliste are unaffected even if later marked not Favorisierbar.
_Avoid_: favoritable, favoritierbar, toggleable

**Schwerpunkt** (pl. Schwerpunkte):
A named topic tag that can be assigned to any TrackEntry, surfaced as a colored badge. Each Schwerpunkt has a `Schlüssel` (short key used for assignment), a `Bezeichnung` (display label), a `Farbe` (background hex color), and a `Textfarbe` (text hex color, defaults to `#000000` if blank). Schwerpunkte are defined per Event in a dedicated `Schwerpunkte` worksheet in the same Google Spreadsheet. Multiple Schwerpunkte may be assigned to one TrackEntry via a semicolon-separated list of Schlüssel values in the `Schwerpunkte` column of the Tracks sheet. Unknown Schlüssel values are silently ignored.
_Avoid_: Topic, tag, category, label, theme

**Schwerpunkt-Badge**:
A colored chip rendered directly below the Titel of a TrackEntry, using the Schwerpunkt's `Farbe` as background and `Textfarbe` as text color, showing the `Bezeichnung`. Appears in the Pivot Table cell, the detail view, and the Favoritenliste. A TrackEntry with multiple Schwerpunkte shows multiple badges.
_Avoid_: Tag chip, label, pill, marker

**Schwerpunkt-Filter**:
A row of Schwerpunkt-Badges shown in the header area of the Pivot Table. When no filter is active, all badges are visible. Clicking a badge activates it as the sole filter: only that badge remains visible in the header, and TimeSlot rows where no TrackEntry carries that Schwerpunkt are hidden. Clicking the active badge deactivates the filter and restores all badges. Only one Schwerpunkt can be active at a time. The filter applies to the Pivot Table only — the Favoritenliste and detail view are unaffected.
_Avoid_: Tag filter, topic selector, filter bar
