import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { PolaroidMemory, MenuItem, MessageFeedItem, AppSettings, PartnerRole, MessageType } from '../types';
import {
  DEFAULT_SETTINGS,
  INITIAL_MEMORIES,
  INITIAL_MENU,
  INITIAL_MESSAGES,
} from '../initialData';

export function useAppData() {
  const [memories, setMemories] = useState<PolaroidMemory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [messages, setMessages] = useState<MessageFeedItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [userCredentials, setUserCredentials] = useState({
    isLoggedIn: true,
    partnerAName: 'Z',
    partnerJName: 'L',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsData, memoriesData, menuData, messagesData] = await Promise.all([
        api.getSettings(),
        api.getMemories(),
        api.getMenu(),
        api.getMessages(),
      ]);
      setSettings(settingsData.settings);
      setUserCredentials({
        isLoggedIn: true,
        partnerAName: settingsData.partnerAName,
        partnerJName: settingsData.partnerJName,
      });
      setMemories(memoriesData);
      setMenuItems(menuData);
      setMessages(messagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
      setMemories(INITIAL_MEMORIES);
      setMenuItems(INITIAL_MENU);
      setMessages(INITIAL_MESSAGES);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveSettings = useCallback(async () => {
    const data = await api.updateSettings({
      settings,
      partnerAName: userCredentials.partnerAName,
      partnerJName: userCredentials.partnerJName,
    });
    setSettings(data.settings);
    setUserCredentials(prev => ({
      ...prev,
      partnerAName: data.partnerAName,
      partnerJName: data.partnerJName,
    }));
  }, [settings, userCredentials.partnerAName, userCredentials.partnerJName]);

  const addMemory = useCallback(async (memory: Omit<PolaroidMemory, 'id' | 'dateAdded'>) => {
    const created = await api.createMemory(memory);
    setMemories(prev => [created, ...prev]);
    return created;
  }, []);

  const addMenuItem = useCallback(async (item: Omit<MenuItem, 'id'>) => {
    const created = await api.createMenuItem(item);
    setMenuItems(prev => [created, ...prev]);
    return created;
  }, []);

  const updateMenuItem = useCallback(async (id: string, item: Partial<MenuItem>) => {
    const updated = await api.updateMenuItem(id, item);
    setMenuItems(prev => prev.map(m => (m.id === id ? updated : m)));
    return updated;
  }, []);

  const removeMenuItem = useCallback(async (id: string) => {
    await api.deleteMenuItem(id);
    setMenuItems(prev => prev.filter(m => m.id !== id));
  }, []);

  const pushNotificationToFeed = useCallback(
    async (
      type: MessageType,
      title: string,
      detailText?: string,
      imageUrl?: string,
      sender: PartnerRole = 'J'
    ) => {
      const created = await api.createMessage({
        sender,
        type,
        title,
        detailText,
        imageUrl,
      });
      setMessages(prev => [created, ...prev]);
      return created;
    },
    []
  );

  const sendMessage = useCallback(
    async (payload: {
      sender: PartnerRole;
      type: MessageType;
      title: string;
      detailText?: string;
      imageUrl?: string;
    }) => {
      const created = await api.createMessage(payload);
      setMessages(prev => [created, ...prev]);
      return created;
    },
    []
  );

  const resetAppData = useCallback(async () => {
    await api.resetAppData();
    await refresh();
  }, [refresh]);

  return {
    memories,
    menuItems,
    messages,
    settings,
    setSettings,
    userCredentials,
    setUserCredentials,
    loading,
    error,
    refresh,
    saveSettings,
    addMemory,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    pushNotificationToFeed,
    sendMessage,
    resetAppData,
  };
}
