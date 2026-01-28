/**
 * @fileoverview Language lookup by key.
 */
import { LANGUAGES } from '../consts';

/**
 * Returns the Language object for the given language key, or the first language if not found.
 * @param languageKey - Language key (e.g. 'en', 'es')
 * @returns Language object
 */
export function getLanguageFromKey(languageKey: string): Language {
  return LANGUAGES.find((l) => l.lang === languageKey) || LANGUAGES[0];
}