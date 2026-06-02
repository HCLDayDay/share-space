import type { PolaroidMemory } from '../../src/types.js';
import { supabase } from '../lib/supabase.js';
import { mapMemory } from '../lib/mappers.js';

export async function listMemories(): Promise<PolaroidMemory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('date_added', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMemory);
}

export async function createMemory(
  memory: Omit<PolaroidMemory, 'id' | 'dateAdded'> & { id?: string }
): Promise<PolaroidMemory> {
  const id = memory.id ?? `memo_${Date.now()}`;
  const row = {
    id,
    title: memory.title,
    image_url: memory.imageUrl,
    visibility: memory.visibility,
    remaining_days: memory.remainingDays ?? null,
    author: memory.author,
    date_added: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('memories').insert(row).select('*').single();
  if (error) throw error;
  return mapMemory(data);
}

export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase.from('memories').delete().eq('id', id);
  if (error) throw error;
}
