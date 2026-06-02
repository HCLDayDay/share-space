import type { PolaroidMemory, MenuItem, MessageFeedItem, AppSettings } from '../../src/types.js';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function formatTimestamp(date: Date): string {
  const hours = date.getHours();
  return `${pad(hours % 12 || 12)}:${pad(date.getMinutes())} ${hours >= 12 ? 'PM' : 'AM'}`;
}

export function formatDateKey(date: Date): MessageFeedItem['dateKey'] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  if (diffDays < 7) {
    return target.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  }
  return 'WEEK';
}

export function mapMemory(row: Record<string, unknown>): PolaroidMemory {
  return {
    id: row.id as string,
    title: row.title as string,
    imageUrl: row.image_url as string,
    visibility: row.visibility as PolaroidMemory['visibility'],
    remainingDays: row.remaining_days != null ? (row.remaining_days as number) : undefined,
    author: row.author as PolaroidMemory['author'],
    dateAdded: row.date_added as string,
  };
}

export function mapMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: row.id as string,
    title: row.title as string,
    category: row.category as MenuItem['category'],
    subtitle: row.subtitle as string,
    tag: row.tag as string,
    imageUrl: row.image_url as string,
    author: row.author as MenuItem['author'],
    ingredients: (row.ingredients as string) || undefined,
  };
}

export function mapMessage(row: Record<string, unknown>): MessageFeedItem {
  const createdAt = new Date(row.created_at as string);
  return {
    id: row.id as string,
    timestamp: formatTimestamp(createdAt),
    dateKey: formatDateKey(createdAt),
    sender: row.sender as MessageFeedItem['sender'],
    type: row.type as MessageFeedItem['type'],
    title: row.title as string,
    detailText: (row.detail_text as string) || undefined,
    imageUrl: (row.image_url as string) || undefined,
  };
}

export interface SettingsResponse {
  settings: AppSettings;
  partnerAName: string;
  partnerJName: string;
}

export function mapSettings(row: Record<string, unknown>): SettingsResponse {
  return {
    settings: {
      anniversaryDate: row.anniversary_date as string,
      customQuote: row.custom_quote as string,
    },
    partnerAName: row.partner_a_name as string,
    partnerJName: row.partner_j_name as string,
  };
}
