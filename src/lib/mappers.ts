import type { MessageFeedItem } from '../types';

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
