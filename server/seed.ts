import {
  INITIAL_MEMORIES,
  INITIAL_MENU,
  INITIAL_MESSAGES,
  DEFAULT_SETTINGS,
} from '../src/initialData.js';
import { supabase } from './lib/supabase.js';

export async function seedDatabase(): Promise<void> {
  await supabase.from('messages').delete().neq('id', '');
  await supabase.from('menu_items').delete().neq('id', '');
  await supabase.from('memories').delete().neq('id', '');
  await supabase.from('couple_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { error: settingsError } = await supabase.from('couple_settings').insert({
    partner_a_name: 'Z',
    partner_j_name: 'L',
    anniversary_date: DEFAULT_SETTINGS.anniversaryDate,
    custom_quote: DEFAULT_SETTINGS.customQuote,
  });
  if (settingsError) throw settingsError;

  const { error: memoriesError } = await supabase.from('memories').insert(
    INITIAL_MEMORIES.map(m => ({
      id: m.id,
      title: m.title,
      image_url: m.imageUrl,
      visibility: m.visibility,
      remaining_days: m.remainingDays ?? null,
      author: m.author,
      date_added: m.dateAdded,
    }))
  );
  if (memoriesError) throw memoriesError;

  const { error: menuError } = await supabase.from('menu_items').insert(
    INITIAL_MENU.map(m => ({
      id: m.id,
      title: m.title,
      category: m.category,
      subtitle: m.subtitle,
      tag: m.tag,
      image_url: m.imageUrl,
      author: m.author,
      ingredients: m.ingredients ?? '',
    }))
  );
  if (menuError) throw menuError;

  const now = new Date();
  const messageTimestamps = [
    new Date(now.getTime() - 2 * 60 * 60 * 1000),
    new Date(now.getTime() - 24 * 60 * 60 * 1000),
    new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
  ];

  const { error: messagesError } = await supabase.from('messages').insert(
    INITIAL_MESSAGES.map((m, i) => ({
      id: m.id,
      sender: m.sender,
      type: m.type,
      title: m.title,
      detail_text: m.detailText ?? null,
      image_url: m.imageUrl ?? null,
      created_at: messageTimestamps[i].toISOString(),
    }))
  );
  if (messagesError) throw messagesError;
}
