# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Dev server
npm start

# Run unit tests
npm test

# Production build for GitHub Pages
ng build --configuration=production --base-href "https://glandl.github.io/gl-tracklist-eedu/"
npx angular-cli-ghpages --dir=dist/gl-tracklist-eedu/browser

# Production build for eeducation.at
ng build --configuration=production --base-href "https://eeducation.at/tagungsprogramm/"
```

## Architecture

This is a single-page Angular 11 app with a single component (`AppComponent`) that displays conference/event schedules as a pivot table. There are no routes and no lazy-loaded modules.

### Data Flow

All data comes from Google Sheets via the `ng-google-sheets-db` library. Each event in `environment.Events` points to one Google Spreadsheet with three worksheets:

- **Räume** → list of rooms (`Room` model)
- **Slots** → list of time slots (`TimeSlot` model)
- **Tracks** → session entries (`TrackEntry` model), each assigned to a `Raum` and a `Slot`

At runtime, `AppComponent` fetches these three sheets sequentially (rooms → time slots → tracks), then builds an in-memory pivot: `tracksPivot[Slot][Raum] = TrackEntry`. This pivot is flattened into `arrPivot` (rows of `{Zeit: slotKey, ...roomColumns}`) and bound to a `MatTableDataSource`. Room columns are added dynamically — `displayedColumns` is always just `['Zeit']`; room names are appended at render time via `.concat(roomNames)`.

### Adding a New Event

Add an entry to the `Events` array in both `src/environments/environment.ts` and `src/environments/environment.prod.ts`. Each entry needs a `Name` and three objects (`Tracks`, `Rooms`, `TimeSlots`) each with `spreadsheetID` and `worksheetName`. The Google Spreadsheet must be publicly readable ("Anyone with the link can view").

The column headers in the Google Sheet must match the right-hand values in the `attributesMapping` objects in `src/app/shared/model/`.

### Dependency Notes

- The project uses Angular 21 with `@angular-devkit/build-angular:browser` (webpack-based builder). An optional migration to the newer esbuild-based builder (`@angular/build:application`) is available via `ng update @angular/cli --name use-application-builder`.
