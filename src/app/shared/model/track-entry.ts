export const trackentryAttributesMapping = {
  id: 'id',
  DigiKomp: 'DigiKomp',
  Vortragende: 'Vortragende',
  D: 'D',
  Slot: 'Slot',
  Raum: 'Raum',
  dk4: '4',
  dk8: '8',
  dk12: '12',
  dkP: 'P',
  Tech: 'Tech',
  Vorname: 'Vorname',
  Nachname: 'Nachname',
  Titel: 'Titel',
  DetailLink: 'DetailLink'
};

export interface TrackEntry {
  id: string;
  DigiKomp: string;
  Vortragende: string;
  D: number;
  Slot: string;
  Raum: string;
  dk4: number;
  dk8: number;
  dk12: number;
  dkP: number;
  Tech: number;
  Vorname: string;
  Nachname: string;
  Titel: string;
  DetailLink: string;
}
