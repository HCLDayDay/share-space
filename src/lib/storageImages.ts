/** Supabase Storage public URLs (bucket: shared-space-images) */
const STORAGE_BASE =
  'https://olcfxkuklohkwuwiurda.supabase.co/storage/v1/object/public/shared-space-images';

export function storageImage(filename: string): string {
  return `${STORAGE_BASE}/${encodeURIComponent(filename)}`;
}

export const STORAGE_IMAGES = {
  handsTwined: storageImage('Hands Twined.png'),
  mistyMountains: storageImage('Misty Mountains.png'),
  veniceBalcony: storageImage('Venice Balcony.png'),
  vaseBranch: storageImage('Vase & Branch.png'),
  vintageCamera: storageImage('Vintage Camera.png'),
  wineGlasses: storageImage('Two Wine Glasses.png'),
  polaroids: storageImage('Multiple Polaroids.png'),
  cozyBed: storageImage('Cozy Bed.png'),
} as const;
