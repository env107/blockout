/** Turn engine ids (e.g. person.man) into i18n-safe key segments. */
export function idToSlug(id: string): string {
  return id.replace(/\./g, '_')
}

/** Turn camera-move category labels into key segments. */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}
