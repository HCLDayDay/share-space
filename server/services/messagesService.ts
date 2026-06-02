import type { MessageFeedItem, MessageType, PartnerRole } from '../../src/types.js';
import { supabase } from '../lib/supabase.js';
import { mapMessage } from '../lib/mappers.js';

export async function listMessages(): Promise<MessageFeedItem[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

export async function createMessage(payload: {
  id?: string;
  sender: PartnerRole;
  type: MessageType;
  title: string;
  detailText?: string;
  imageUrl?: string;
}): Promise<MessageFeedItem> {
  const id = payload.id ?? `msg_${Date.now()}`;
  const row = {
    id,
    sender: payload.sender,
    type: payload.type,
    title: payload.title,
    detail_text: payload.detailText ?? null,
    image_url: payload.imageUrl ?? null,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('messages').insert(row).select('*').single();
  if (error) throw error;
  return mapMessage(data);
}
