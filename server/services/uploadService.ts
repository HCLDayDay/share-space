import { randomUUID } from 'crypto';
import { supabase } from '../lib/supabase.js';
import { config } from '../config.js';

export async function uploadImage(
  buffer: Buffer,
  mimeType: string,
  originalName?: string
): Promise<string> {
  const ext = originalName?.split('.').pop() || mimeType.split('/')[1] || 'jpg';
  const path = `uploads/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(config.storageBucket).upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(config.storageBucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadBase64Image(dataUrl: string): Promise<string> {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid base64 data URL');

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  return uploadImage(buffer, mimeType);
}
