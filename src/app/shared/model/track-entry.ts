export const trackentryAttributesMapping = {
  id: 'id',
  SessionID: 'SessionID',
  DigiKomp: 'DigiKomp',
  Vortragende: 'Vortragende',
  D: 'D',
  Slot: 'Slot',
  Raum: 'Raum',
  dk4: 'dk4',
  dk8: 'dk8',
  dk12: 'dk12',
  dkP: 'P',
  Tech: 'Tech',
  Vorname: 'Vorname',
  Nachname: 'Nachname',
  Titel: 'Titel',
  DetailLink: 'DetailLink',
  dkStyle: 'dkStyle',
  Beschreibungstext: 'Beschreibungstext',
  Favorisierbar: 'Favorisierbar',
  Schwerpunkte: 'Schwerpunkte',
};

const digiKompLabels: Record<string, string> = {
  dk4: 'DigiKomp 4',
  dk8: 'DigiKomp 8',
  dk12: 'DigiKomp 12',
  dkP: 'DigiKomp P',
  dkTech: 'DigiKomp Tech',
};

export function getDigiKompLabel(dkStyle: string | undefined): string {
  return digiKompLabels[dkStyle ?? ''] ?? '';
}

export function isFavoritable(track: Pick<TrackEntry, 'Favorisierbar'> | undefined): boolean {
  return track?.Favorisierbar === 'J';
}

export interface TrackEntry {
  id: string;
  SessionID: string;
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
  dkStyle: string;
  Beschreibungstext: string;
  Favorisierbar: string;
  Schwerpunkte: string;
}
