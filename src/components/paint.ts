import { onColor, parseHex, type CatalogCategory } from '@/core';

// Palette rotation, only for categories the store left without valid colours.
const ROTATION = ['#C62828', '#F2B91B', '#1E49A6', '#2F8F4E'];

const valid = (color: string | null | undefined): string | null => (parseHex(color) ? color!.trim() : null);

/** A category's paint: its own colours from the POS, contrast-guarded. */
export function categoryPaint(category: CatalogCategory | undefined, index = 0) {
  const fill = valid(category?.backgroundColor) ?? ROTATION[index % ROTATION.length];
  const ink = onColor(fill);
  const own = valid(category?.buttonColor);
  const tooth = own && own.toUpperCase() !== fill.toUpperCase() ? own : ink;
  return { fill, ink, tooth };
}
