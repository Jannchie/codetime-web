
import languageIdentifiers from '../data/LanguageIdentifiers.json'
const entries = Object.entries(languageIdentifiers)
const languageIdentifiersMap = new Map(entries)

export default function getLanguageName (languageIdentifier: string): string {
  return languageIdentifiersMap.get(languageIdentifier) ?? languageIdentifier
}
