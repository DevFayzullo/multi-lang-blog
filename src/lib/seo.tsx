export function altLocales(locale: string, path: string) {
  const locales = ['ko', 'en', 'uz'];
  const map: Record<string, string> = {};
  for (const l of locales) map[l] = `/${l}${path}`;
  map['x-default'] = `/ko${path}`;
  return { languages: map };
}