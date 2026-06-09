# eEducation Tagungsprogramme

A single-page app that displays conference and workshop schedules as pivot tables, sourced from Google Sheets.

## Language

**Event** (Veranstaltung):
A conference or workshop edition with its own schedule, backed by a dedicated Google Spreadsheet. Users select the active Event from a dropdown.
_Avoid_: Conference, schedule, programme

**TrackEntry** (Track):
A single session or talk within an Event, assigned to exactly one Room and one TimeSlot.
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
A user's personal collection of TrackEntries they plan to attend, stored locally in the browser (localStorage). Identified by stable TrackEntry UIDs so entries survive rescheduling.
_Avoid_: Bookmarks, Merkliste, Watchlist, personal track list
