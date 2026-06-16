export const schwerpunktAttributesMapping = {
  key: 'ID',
  label: 'Bezeichnung',
  color: 'Hintergrundfarbe',
  textColor: 'Textfarbe',
};

export interface Schwerpunkt {
  key: string;
  label: string;
  color: string;
  textColor: string;
}

export function resolveSchwerpunkte(raw: string | null | undefined, catalogue: Schwerpunkt[]): Schwerpunkt[] {
  if (!raw) return [];
  const index = new Map(catalogue.map(s => [s.key, s]));
  return raw
    .split(';')
    .map(k => k.trim())
    .filter(k => k.length > 0)
    .map(k => index.get(k))
    .filter((s): s is Schwerpunkt => s !== undefined)
    .map(s => ({ ...s, textColor: s.textColor?.trim() || '#000000' }));
}
