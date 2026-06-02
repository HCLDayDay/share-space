/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PartnerRole = 'A' | 'J';

export interface PartnerProfile {
  id: PartnerRole;
  name: string;
  avatar: string; // lucide class or simple initials
  title: string;
  longName: string;
}

export type MemoryVisibility = 'permanent' | 'temp';

export interface PolaroidMemory {
  id: string;
  title: string;
  imageUrl: string;
  visibility: MemoryVisibility;
  remainingDays?: number; // e.g. 1, 3, 7 days
  author: PartnerRole;
  dateAdded: string; // ISO String
}

export type MenuCategory = 'all' | 'main' | 'dessert' | 'drink';

export interface MenuItem {
  id: string;
  title: string;
  category: Exclude<MenuCategory, 'all'>;
  subtitle: string; // e.g. "Hand-milled Flour, Farm Eggs, Semolina"
  tag: string; // e.g. "分享爱", "传承", "禅意时刻", "午夜"
  imageUrl: string;
  author: PartnerRole;
  ingredients?: string; // List of ingredients/materials needed to prepare the dish
}

export type MessageType = 'surprise' | 'film' | 'menu_update' | 'custom';

export interface MessageFeedItem {
  id: string;
  timestamp: string; // e.g. "10:42 AM"
  dateKey: 'TODAY' | 'YESTERDAY' | 'WEEK' | string; // human-readable header label like "YESTERDAY" or "SATURDAY"
  sender: PartnerRole;
  type: MessageType;
  title: string; // e.g. "J 选择了 [甜点之旅] 作为今日惊喜"
  detailText?: string; // blockquote
  imageUrl?: string; // thumbnail
}

export interface AppSettings {
  anniversaryDate: string; // YYYY-MM-DD
  customQuote: string;
}
