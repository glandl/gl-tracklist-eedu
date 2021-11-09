// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Events: [
    {
      Name: 'Fachtagung 2021',
      Tracks: {
        spreadsheetID: '1Nh4XvYK-856hwLOTzgnEtMT4GFvg-l3yeiellUrnoEw',
        worksheetID: 2,
        worksheetName: 'Tracks',
      },
      Rooms: {
        spreadsheetID: '1Nh4XvYK-856hwLOTzgnEtMT4GFvg-l3yeiellUrnoEw',
        worksheetID: 3,
        worksheetName: 'Räume',
      },
      TimeSlots: {
        spreadsheetID: '1Nh4XvYK-856hwLOTzgnEtMT4GFvg-l3yeiellUrnoEw',
        worksheetID: 4,
        worksheetName: 'Slots',
      }
    },
    {
      Name: 'Praxistage 2021',
      Tracks: {
        spreadsheetID: '11iLlWZCC94HeykQbDGpGOx7n--B3BTSDKXYBns-1cSY',
        worksheetID: 2,
        worksheetName: 'Tracks',
      },
      Rooms: {
        spreadsheetID: '11iLlWZCC94HeykQbDGpGOx7n--B3BTSDKXYBns-1cSY',
        worksheetID: 3,
        worksheetName: 'Räume',
      },
      TimeSlots: {
        spreadsheetID: '11iLlWZCC94HeykQbDGpGOx7n--B3BTSDKXYBns-1cSY',
        worksheetID: 4,
        worksheetName: 'Slots',
      },
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
