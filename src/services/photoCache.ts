const photoPreviewCache = new Map<number, string>();

export function getPokemonPhoto(id: number): string | undefined {
  return photoPreviewCache.get(id);
}

export function setPokemonPhoto(id: number, uri: string): void {
  photoPreviewCache.set(id, uri);
}
