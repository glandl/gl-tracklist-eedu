# Tracklist for eEducation Events

Simple tracklist read from a table hosted on Google Drive (Google Sheets).

# [Demo](https://glandl.github.io/gl-tracklist-eedu/)

## Requirements

- **Node.js**: v20 or newer (Angular 21 requires ≥ 20; v24 LTS is recommended)
- **npm**: bundled with Node
- A public **Google Sheets API key** (see below)

## Running the project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the Google API key

The Google Sheets API key is **not** stored in the repository. It lives in a local `.env` file (git-ignored):

```bash
cp .env.example .env
```

Then fill in the key:

```bash
SHEETS_API_KEY=AIza...
```

To obtain a key:

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials** → *Create Credentials* → **API key**
2. Enable the **Google Sheets API** under **APIs & Services → Enabled APIs**
3. (Recommended) restrict the key to the HTTP Referrer of your deployed site

Before every `start` and `build`, the `prestart`/`prebuild` hooks run `scripts/set-env.js`, which reads the key from `.env` and generates `src/environments/secrets.ts` (also git-ignored). If the key is missing you get a warning — fill in `.env` and run again.

### 3. Start the dev server

```bash
npm start
```

Opens the app at <http://localhost:8080>.

### 4. Unit tests

```bash
npm test
```

(Karma + Jasmine, runs in Chrome.)

## Google Sheets integration

Each event is backed by **one Google Spreadsheet** with up to four worksheets, referenced from `src/environments/environment.ts` (dev) and `environment.prod.ts` (production) via the `Events` array:

| Worksheet        | Provides            | Model              |
| ---------------- | ------------------- | ------------------ |
| `Räume` (Rooms)  | list of rooms       | `Room`             |
| `Slots`          | list of time slots  | `TimeSlot`         |
| `Tracks`         | session entries     | `TrackEntry`       |
| `Schwerpunkte` (optional) | subject/focus areas | `Schwerpunct`      |

Every entry in `Events` looks like this:

```ts
{
  Name: 'Praxisforum 2026',
  Tracks:    { spreadsheetID: '1CKJ...', worksheetName: 'Tracks' },
  Rooms:     { spreadsheetID: '1CKJ...', worksheetName: 'Räume' },
  TimeSlots: { spreadsheetID: '1CKJ...', worksheetName: 'Slots' },
  Schwerpunkte: { spreadsheetID: '1CKJ...', worksheetName: 'Schwerpunkte' },
}
```

Data fetching is done by `GoogleSheetsService` (`src/app/shared/google-sheets.service.ts`), which calls
`https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{worksheet}?key=...`
and maps the sheet's columns onto model properties using the `attributesMapping` objects in `src/app/shared/model/`.

### Adding a new event

1. Create a **publicly readable** Google Spreadsheet ("Anyone with the link can view") with the worksheets `Räume`, `Slots`, `Tracks` (and optionally `Schwerpunkte`).
2. Make sure the column headers in the sheet match the **values** of the `attributesMapping` objects in `src/app/shared/model/`.
3. Add an entry to the `Events` array in **both** `src/environments/environment.ts` and `src/environments/environment.prod.ts` with the sheet's `spreadsheetID` (the long ID from the sheet URL) and worksheet names.

## Production builds

```bash
# GitHub Pages
ng build --configuration=production --base-href "https://glandl.github.io/gl-tracklist-eedu/"
npx angular-cli-ghpages --dir=dist/gl-tracklist-eedu/browser

# eeducation.at
ng build --configuration=production --base-href "https://eeducation.at/tagungsprogramm/"
```
