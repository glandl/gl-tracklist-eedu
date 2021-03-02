import { Time } from "@angular/common";

export const timeslotAttributesMapping = {
  Datum: 'Datum',
  von: 'von',
  bis: 'bis',
  Slot: 'Slots',
}

export interface TimeSlot {
  Datum: Date;
  von: Time;
  bis: Time;
  Slot: string;
}
