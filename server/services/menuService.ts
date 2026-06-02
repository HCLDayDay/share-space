import type { MenuItem } from '../../src/types.js';
import { supabase } from '../lib/supabase.js';
import { mapMenuItem } from '../lib/mappers.js';

export async function listMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMenuItem);
}

export async function createMenuItem(
  item: Omit<MenuItem, 'id'> & { id?: string }
): Promise<MenuItem> {
  const id = item.id ?? `meal_${Date.now()}`;
  const row = {
    id,
    title: item.title,
    category: item.category,
    subtitle: item.subtitle,
    tag: item.tag,
    image_url: item.imageUrl,
    author: item.author,
    ingredients: item.ingredients ?? '',
  };

  const { data, error } = await supabase.from('menu_items').insert(row).select('*').single();
  if (error) throw error;
  return mapMenuItem(data);
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (item.title != null) row.title = item.title;
  if (item.category != null) row.category = item.category;
  if (item.subtitle != null) row.subtitle = item.subtitle;
  if (item.tag != null) row.tag = item.tag;
  if (item.imageUrl != null) row.image_url = item.imageUrl;
  if (item.author != null) row.author = item.author;
  if (item.ingredients != null) row.ingredients = item.ingredients;

  const { data, error } = await supabase
    .from('menu_items')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapMenuItem(data);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}
