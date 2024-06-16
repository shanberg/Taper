import { describe, test, expect } from 'vitest';
import { formatRowText } from '../src/utils';

describe('formatRowText', () => {
    const row = { dose: 50, daysForDose: 5 };
    const rowStartDate = new Date('2024-06-01');
    const rowEndDate = new Date('2024-06-05');
  
    test('formats text for English language', () => {
      const result = formatRowText({ row, rowStartDate, rowEndDate, index: 0, selectedLanguageKey: 'English' });
      expect(result).toBe('Take 50mg daily for 5 days (Jun 1 - Jun 5)');
    });
  
    test('formats text for Spanish language', () => {
      const result = formatRowText({ row, rowStartDate, rowEndDate, index: 1, selectedLanguageKey: 'Spanish' });
      expect(result).toBe('Después tome 50mg cada día durante 5 días (1 jun - 5 jun)');
    });
  
    test('formats text for Haitian Creole language', () => {
      const result = formatRowText({ row, rowStartDate, rowEndDate, index: 0, selectedLanguageKey: 'Haitian Creole' });
      expect(result).toBe('Pran 50mg chak jou pou 5 jou (Jun 1 - Jun 5)');
    });
  
    test('formats text for Mandarin language', () => {
      const result = formatRowText({ row, rowStartDate, rowEndDate, index: 1, selectedLanguageKey: 'Mandarin' });
      expect(result).toBe('然后服用 50毫克，每天服用5 天 (6月1日 - 6月5日)');
    });
  
    test('formats text for Swahili language', () => {
    const result = formatRowText({ row, rowStartDate, rowEndDate, index: 0, selectedLanguageKey: 'Swahili' });
    expect(result).toBe('Kutoka 50mg kwa saa 5 siku (1 Jun - 5 Jun)');
    });

    test('formats text for Arabic language', () => {
    const result = formatRowText({ row, rowStartDate, rowEndDate, index: 1, selectedLanguageKey: 'Arabic' });
    expect(result).toBe('في ذلك الحين تحتاج 50mg كل يوم 5 يوم (٥ يونيو - ١ يونيو)');
    });

    test('throws error for unknown language', () => {
    expect(() => {
        formatRowText({ row, rowStartDate, rowEndDate, index: 0, selectedLanguageKey: 'Unknown' });
    }).toThrow('Unknown language: Unknown');
    });
});
    