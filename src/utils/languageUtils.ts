import { LANGUAGES } from '../consts';

export function getLanguageFromKey(languageKey: string): Language {
  return LANGUAGES.find((l) => l.lang === languageKey) || LANGUAGES[0];
}