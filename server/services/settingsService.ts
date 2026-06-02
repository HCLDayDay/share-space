import { supabase } from '../lib/supabase.js';
import { mapSettings, type SettingsResponse } from '../lib/mappers.js';
import { seedDatabase } from '../seed.js';

export async function getSettings(): Promise<SettingsResponse> {
  const { data, error } = await supabase
    .from('couple_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    await seedDatabase();
    return getSettings();
  }
  return mapSettings(data);
}

export async function updateSettings(payload: {
  anniversaryDate: string;
  customQuote: string;
  partnerAName: string;
  partnerJName: string;
}): Promise<SettingsResponse> {
  const existing = await getSettings();

  const { data: rows, error: fetchError } = await supabase
    .from('couple_settings')
    .select('id')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const settingsId = rows?.[0]?.id;
  if (!settingsId) throw new Error('No couple settings row found');

  const { data, error } = await supabase
    .from('couple_settings')
    .update({
      anniversary_date: payload.anniversaryDate,
      custom_quote: payload.customQuote,
      partner_a_name: payload.partnerAName,
      partner_j_name: payload.partnerJName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settingsId)
    .select('*')
    .single();

  if (error) throw error;
  return mapSettings(data ?? existing);
}
