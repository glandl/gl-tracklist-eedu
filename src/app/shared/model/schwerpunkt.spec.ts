import { resolveSchwerpunkte, Schwerpunkt } from './schwerpunkt';

const catalogue: Schwerpunkt[] = [
  { key: 'ki', label: 'Künstliche Intelligenz', color: '#E53935', textColor: '#FFFFFF' },
  { key: 'datenschutz', label: 'Datenschutz', color: '#1E88E5', textColor: '#FFFFFF' },
  { key: 'notext', label: 'Kein Textfarbe', color: '#AAAAAA', textColor: '' },
];

describe('resolveSchwerpunkte', () => {
  it('returns matching Schwerpunkte for known keys', () => {
    const result = resolveSchwerpunkte('ki', catalogue);
    expect(result.length).toBe(1);
    expect(result[0].key).toBe('ki');
    expect(result[0].label).toBe('Künstliche Intelligenz');
  });

  it('resolves multiple semicolon-separated keys', () => {
    const result = resolveSchwerpunkte('ki;datenschutz', catalogue);
    expect(result.length).toBe(2);
    expect(result.map(s => s.key)).toEqual(['ki', 'datenschutz']);
  });

  it('silently drops unknown keys', () => {
    const result = resolveSchwerpunkte('ki;unknown;datenschutz', catalogue);
    expect(result.length).toBe(2);
    expect(result.map(s => s.key)).toEqual(['ki', 'datenschutz']);
  });

  it('returns empty array for blank string', () => {
    expect(resolveSchwerpunkte('', catalogue)).toEqual([]);
  });

  it('returns empty array for null', () => {
    expect(resolveSchwerpunkte(null, catalogue)).toEqual([]);
  });

  it('returns empty array for undefined', () => {
    expect(resolveSchwerpunkte(undefined, catalogue)).toEqual([]);
  });

  it('returns empty array when no keys match the catalogue', () => {
    expect(resolveSchwerpunkte('foo;bar', catalogue)).toEqual([]);
  });

  it('trims whitespace around keys', () => {
    const result = resolveSchwerpunkte(' ki ; datenschutz ', catalogue);
    expect(result.map(s => s.key)).toEqual(['ki', 'datenschutz']);
  });

  it('defaults textColor to #000000 when blank in catalogue', () => {
    const result = resolveSchwerpunkte('notext', catalogue);
    expect(result[0].textColor).toBe('#000000');
  });

  it('preserves textColor when it is set', () => {
    const result = resolveSchwerpunkte('ki', catalogue);
    expect(result[0].textColor).toBe('#FFFFFF');
  });

  it('returns empty array for a string of only semicolons', () => {
    expect(resolveSchwerpunkte(';;;', catalogue)).toEqual([]);
  });
});
