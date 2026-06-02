/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Settings,
  Plus,
  User,
  Camera,
  UtensilsCrossed,
  MessageSquare,
  Sparkles,
  RefreshCw,
  X,
  PlusCircle,
  Clock,
  Unlock,
  Lock,
  ChevronRight,
  LogOut,
  Paperclip,
  Share2,
  Upload
} from 'lucide-react';

import {
  PRELOAD_AESTHETIC_IMAGES,
  PRESET_PROMPTS
} from './initialData';

import { PolaroidMemory, MenuItem, PartnerRole, MessageType } from './types';
import { resolveImageUrl } from './lib/api';
import { useAppData } from './hooks/useAppData';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'messages' | 'mine'>('home');

  // Interactive Couple Role Selection
  const [currentRole, setCurrentRole] = useState<PartnerRole>('J');

  const {
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
  } = useAppData();

  // Interactivity States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isSendRitualOpen, setIsSendRitualOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<PolaroidMemory | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // States for Image Upload and Snapshots for dishes
  const [menuAddImageUrl, setMenuAddImageUrl] = useState<string>('');
  const [menuEditImageUrl, setMenuEditImageUrl] = useState<string>('');
  const [imageSourceType, setImageSourceType] = useState<'preset' | 'custom'>('preset');
  const [editImageSourceType, setEditImageSourceType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string>(PRELOAD_AESTHETIC_IMAGES[10].url);

  // States for Polaroid memory uploads and snapshots
  const [memoryAddImageUrl, setMemoryAddImageUrl] = useState<string>('');
  const [memoryImageSourceType, setMemoryImageSourceType] = useState<'preset' | 'custom'>('preset');
  const [selectedMemoryPresetUrl, setSelectedMemoryPresetUrl] = useState<string>(PRELOAD_AESTHETIC_IMAGES[0].url);

  const handleMemoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setMemoryAddImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuImageUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (mode === 'add') {
            setMenuAddImageUrl(reader.result);
          } else {
            setMenuEditImageUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // States for sending massage card / rituals with photo option
  const [ritualImageUrl, setRitualImageUrl] = useState<string>('');
  const [ritualImageSourceType, setRitualImageSourceType] = useState<'none' | 'preset' | 'custom'>('none');
  const [selectedRitualPresetUrl, setSelectedRitualPresetUrl] = useState<string>(PRELOAD_AESTHETIC_IMAGES[0].url);

  const handleRitualImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRitualImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Home Page Interaction
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Floating Heart Interactive Sparks
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Menu Category Filtering
  const [selectedMealCategory, setSelectedMealCategory] = useState<'all' | 'main' | 'dessert' | 'drink'>('all');

  const partnerName = currentRole === 'J' ? userCredentials.partnerJName : userCredentials.partnerAName;

  const notifyFeed = async (
    type: MessageType,
    title: string,
    detailText?: string,
    imageUrl?: string
  ) => {
    await pushNotificationToFeed(type, title, detailText, imageUrl, currentRole);
  };

  // Anniversary date calculator
  const calculateDaysTogether = (anniversaryDate: string) => {
    const start = new Date(anniversaryDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    // Absolute difference in days
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysCount = calculateDaysTogether(settings.anniversaryDate);

  // Trigger floating hearts micro-interaction top-left
  const handleLogoHeartClick = (e: React.MouseEvent) => {
    const nextHeart = {
      id: Date.now(),
      x: e.clientX || 40,
      y: e.clientY || 40
    };
    setFloatingHearts(prev => [...prev, nextHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== nextHeart.id));
    }, 1500);
  };

  // Switch role simulation feedback
  const toggleRole = () => {
    const nextRole = currentRole === 'J' ? 'A' : 'J';
    setCurrentRole(nextRole);
  };

  const handleDrawPrompt = () => {
    let nextIdx = currentPromptIndex;
    while (nextIdx === currentPromptIndex) {
      nextIdx = Math.floor(Math.random() * PRESET_PROMPTS.length);
    }
    setCurrentPromptIndex(nextIdx);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary font-sans">
        <div className="text-center space-y-3">
          <Heart className="w-8 h-8 fill-primary text-primary animate-pulse mx-auto" />
          <p className="text-sm text-secondary">正在加载你们的共享空间...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-fixed selection:text-primary min-h-screen relative overflow-x-hidden custom-scrollbar">
      {/* Floating Heart Animations */}
      <AnimatePresence>
        {floatingHearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.5, x: heart.x - 10, y: heart.y - 10 }}
            animate={{ opacity: 0, scale: 1.8, x: heart.x + (Math.random() * 80 - 40), y: heart.y - 120 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="fixed text-red-500 font-bold z-[100] pointer-events-none text-2xl select-none"
          >
            ♥
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between text-xs text-red-700">
          <span>数据加载失败：{error}（已显示本地预览数据）</span>
          <button onClick={() => refresh()} className="underline font-medium">重试</button>
        </div>
      )}

      {/* FIXED TOP APP BAR */}
      <header className={`fixed left-0 right-0 w-full z-50 backdrop-blur-xl bg-surface/80 border-b border-outline-variant/10 flex justify-between items-center px-6 md:px-20 py-4 ${error ? 'top-8' : 'top-0'}`}>
        {/* Intimate Microtouch Trigger Container */}
        <button
          onClick={handleLogoHeartClick}
          className="flex items-center gap-1.5 text-primary hover:opacity-75 transition-opacity duration-300 md:active:scale-90"
          id="heart-touch-trigger"
          title="点击发送一份专属爱意心碎特效"
        >
          <Heart className="w-5 h-5 fill-primary text-primary animate-pulse" />
        </button>

        <h1 className="font-serif text-2xl font-medium tracking-widest text-primary">
          {userCredentials.partnerJName} &amp; {userCredentials.partnerAName}
        </h1>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center text-primary hover:opacity-75 transition-opacity duration-300 active:scale-95"
          id="app-settings-trigger"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* CORE PARTNER ROLE SIMULATION TOGGLE BAR */}
      <div className="fixed top-[57px] left-0 right-0 bg-surface-container-low border-b border-outline-variant/20 z-45 py-1 px-4 text-center">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-secondary-61 text-on-surface-variant font-sans px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            <span>当前身份：</span>
            <span className="font-serif font-semibold text-primary">
              {currentRole === 'J' ? userCredentials.partnerJName : userCredentials.partnerAName}
            </span>
          </div>
          <button
            onClick={toggleRole}
            className="px-3 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all font-sans font-medium hover:scale-105 active:scale-95"
          >
            切换身份为 {currentRole === 'J' ? userCredentials.partnerAName : userCredentials.partnerJName}
          </button>
        </div>
      </div>

      {/* MAIN APPLICATION VIEW CHASSIS */}
      <main className="pt-28 pb-32 px-6 md:px-12 max-w-[850px] mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Journey Title Segment */}
              <section className="text-center pt-8 space-y-3">
                <span className="font-sans text-xs text-secondary uppercase tracking-[0.2em] block">我们的旅程</span>
                <h2 className="font-serif text-4xl text-primary font-light">
                  第 <span className="underline decoration-outline-variant/40 underline-offset-8 font-medium">{daysCount}</span> 天
                </h2>
                <div className="w-12 h-[1px] bg-outline-variant/50 mx-auto pt-1"></div>
                <p className="font-serif italic text-base text-on-surface-variant max-w-sm mx-auto leading-relaxed pt-2">
                  {settings.customQuote}
                </p>
              </section>

              {/* Home highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Highlight Card 1: Menu */}
                <div
                  onClick={() => setActiveTab('menu')}
                  className="group cursor-pointer bg-surface-container-low p-5 rounded-2xl polaroid-shadow transition-all duration-500 hover:scale-[1.01]"
                >
                  <div className="aspect-[4/5] bg-white p-2.5 mb-5 overflow-hidden relative">
                    <img
                      class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      alt="Today's wine selection"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOHahm6mC8E9rFp2AyfM6visbiEUYsCtVYecoIqcwAJKG-gf0aljG739sZkXUF1b3_5X7uvchc8EjTSo0EErTDxlzlHogXLjwQeZOIEbHLRw5YM1aZWRcFtN09ybxiFKPPXKGM06nHTnDocdVu0wbw0HvaE2OzLnhY2zEf-0XT3kaSZey8gXmDwmywBlAqQ8BQCdS3xkMH3e_UPkXAPhxnuMPSIR3IXX64APQL9PHLOUFbTt0UnLm3874l7rMi08b64IfW0roChWMV"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg text-primary">今日菜单</h3>
                      <UtensilsCrossed className="w-4 h-4 text-outline" />
                    </div>
                    <p className="text-xs text-secondary tracking-wider uppercase font-sans">
                      我们的厨房 • {menuItems.length} 道佳肴蓄势待发
                    </p>
                    <div className="pt-3 w-full h-[1px] bg-outline-variant/30 group-hover:bg-primary/30 transition-colors" />
                  </div>
                </div>

                {/* Highlight Card 2: Polaroid Deck */}
                <div
                  onClick={() => setActiveTab('mine')}
                  className="group cursor-pointer bg-surface-container-low p-5 rounded-2xl polaroid-shadow transition-all duration-500 hover:scale-[1.01] md:mt-10"
                >
                  <div className="aspect-[4/5] bg-white p-2.5 mb-5 overflow-hidden relative">
                    <img
                      class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      alt="Polaroid Memories Collection"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeBSgkXuc6t_uSW10GxskfiegIpnL_l37C8A30GIIyceekFCUUTUSKtdNdVq9u8KrxbF5JWgD4GsQgVcZZ2CSTc7YWPOs5icy99ZmpYZew1wpnsc-uFCWQ4XzTjkOw63VDWLP8JV5OCUPIdaZtWOBzo0UNqxWCB9ShtgYjhCKjb083B3lNx0Txt2ah07_078u8O1WNydIa2zoKgTRsZjena7EM_mrmgLyCy6QDarTULqHJNWpXzliBnKGbo7CZkX9SZv76mbaomPCE"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg text-primary">瞬时胶卷</h3>
                      <Camera className="w-4 h-4 text-outline" />
                    </div>
                    <p className="text-xs text-secondary tracking-wider uppercase font-sans">
                      捕捉到的仪式感 • {memories.length} 个珍贵记忆
                    </p>
                    <div className="pt-3 w-full h-[1px] bg-outline-variant/30 group-hover:bg-primary/30 transition-colors" />
                  </div>
                </div>
              </div>


            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Hero Title Section */}
              <section className="text-center pt-8">
                <p className="font-sans text-xs text-secondary tracking-[0.2em] uppercase mb-3">我们的餐桌</p>
                <h2 className="font-serif text-3xl md:text-4xl text-primary font-light italic">今日菜单</h2>
                
                {/* Category navigation horizontal slider */}
                <nav className="flex justify-center items-center gap-6 md:gap-8 mt-8 overflow-x-auto no-scrollbar py-2 border-b border-outline-variant/10">
                  {(['all', 'main', 'dessert', 'drink'] as const).map(cat => {
                    const labelMap: Record<string, string> = { all: '全部', main: '主菜', dessert: '甜点', drink: '饮品' };
                    const isSelected = selectedMealCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedMealCategory(cat)}
                        className="relative pb-2 flex flex-col items-center group transition-colors"
                      >
                        <span className={`font-serif text-lg italic cursor-pointer transition-opacity ${isSelected ? 'text-primary' : 'text-secondary font-light opacity-60 hover:opacity-100'}`}>
                          {labelMap[cat]}
                        </span>
                        {isSelected ? (
                          <motion.div layoutId="activeCategoryLine" className="absolute -bottom-[1px] w-8 h-[1px] bg-primary" />
                        ) : (
                          <div className="absolute -bottom-[1px] w-0 h-[1px] bg-primary group-hover:w-4 transition-all duration-300" />
                        )}
                      </button>
                    );
                  })}
                </nav>
                <div className="w-12 h-[1px] bg-outline-variant mx-auto my-6"></div>
              </section>

              {/* Menu Container lists grouped logic */}
              <div className="space-y-12">
                {/* Filtering active menu based on category selection */}
                {(() => {
                  const filtered = menuItems.filter(item => selectedMealCategory === 'all' || item.category === selectedMealCategory);
                  
                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-16 text-secondary font-serif italic text-sm">
                        今日此品类下还没有佳作，点击右下角 [+] 纽，添加你为爱烹饪的美味吧 🍽️
                      </div>
                    );
                  }

                  // Group items by category for aesthetic grouping line structure
                  const grouped: Record<string, MenuItem[]> = {};
                  filtered.forEach(item => {
                    const catLabel = item.category === 'main' ? '主菜与副菜' : item.category === 'dessert' ? '甜点' : '饮品';
                    if (!grouped[catLabel]) grouped[catLabel] = [];
                    grouped[catLabel].push(item);
                  });

                  return Object.entries(grouped).map(([categoryName, items]) => (
                    <div key={categoryName} className="flex flex-col">
                      {/* Section elegant grouping boundary line */}
                      <div className="flex items-center justify-between mb-8">
                        <span className="font-sans text-xs text-on-surface-variant font-medium tracking-widest uppercase">
                          {categoryName}
                        </span>
                        <span className="flex-grow ml-8 h-[0.5px] bg-outline-variant/30"></span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map(dish => (
                          <article key={dish.id} className="group flex flex-col justify-between bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-xs hover:shadow-md transition-all duration-300 relative">
                            <div>
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-full overflow-hidden border border-outline-variant/10 shadow-xs bg-white">
                                  <img
                                    alt={dish.title}
                                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                                    src={dish.imageUrl}
                                  />
                                </div>
                                <div className="flex-grow min-w-0">
                                  <div className="flex items-center justify-between gap-1 flex-wrap">
                                    <h3 className="font-serif text-lg text-on-surface font-semibold truncate leading-snug">{dish.title}</h3>
                                    <span className="text-[9px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full uppercase truncate">
                                      {dish.author === 'J' ? userCredentials.partnerJName : userCredentials.partnerAName} 专属
                                    </span>
                                  </div>
                                  <p className="text-xs text-on-surface-variant/70 italic font-sans truncate mt-0.5">{dish.subtitle}</p>
                                  <div className="mt-1">
                                    <span className="font-sans text-[10px] text-secondary italic opacity-75 bg-surface-container px-2 py-0.5 rounded text-outline font-medium">
                                      #{dish.tag}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Ingredients list segment */}
                              <div className="bg-surface-container-low/40 p-3 rounded-xl border border-outline-variant/10 text-xs mt-2 mb-4">
                                <p className="font-sans font-semibold text-primary mb-1 flex items-center gap-1.5 text-[11px]">
                                  <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
                                  <span>制作所配食材：</span>
                                </p>
                                <p className="text-xs text-on-surface-variant leading-relaxed font-sans opacity-95">
                                  {dish.ingredients || '主厨正在保密神秘浪漫配料中...'}
                                </p>
                              </div>
                            </div>

                            {/* Menu action bar */}
                            <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3 mt-auto">
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const senderName = partnerName;
                                  const orderTitle = `${senderName} 点餐了今日佳肴：【${dish.title}】 🍝`;
                                  const orderDetailText = `“亲爱的，今天我想和你一起享用这道菜！期待我们的美味晚餐时光。”\n所需食材也已经备妥：${dish.ingredients || '以温存的海誓山盟作为调料'}`;

                                  try {
                                    await notifyFeed('surprise', orderTitle, orderDetailText, dish.imageUrl);
                                    handleLogoHeartClick(e as React.MouseEvent);
                                    alert(`✨ 【${dish.title}】点餐成功！此份点餐详情已同步发送至“消息”版面，期待你们的温馨晚宴吧！`);
                                    setActiveTab('messages');
                                  } catch (err) {
                                    alert(err instanceof Error ? err.message : '点餐同步失败');
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-xs rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer font-sans font-medium"
                              >
                                <Heart className="w-3 h-3 fill-white text-white" />
                                <span>点餐预约</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingMenuItem(dish);
                                  setMenuEditImageUrl(dish.imageUrl);
                                  setEditImageSourceType(dish.imageUrl && dish.imageUrl.startsWith('data:') ? 'custom' : 'preset');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 border border-outline text-primary text-xs rounded-full hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans font-medium"
                              >
                                <span>编辑菜品</span>
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Header section */}
              <section className="mb-4">
                <h2 className="font-serif text-3xl text-primary font-light italic">我们的消息</h2>
                <div className="h-[1px] w-12 bg-outline-variant mt-3"></div>
              </section>

              {/* Chronological Message feed items render list */}
              <div className="space-y-8">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-secondary font-serif italic text-sm">
                    这里空空如也，点下方的 [Send a ritual] 发送你们的第一条浪漫私密语吧。
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    // Decide background decorator or date division separator
                    const showDateHeader = index === 0 || messages[index - 1].dateKey !== msg.dateKey;
                    
                    return (
                      <div key={msg.id} className="space-y-3">
                        {showDateHeader && (
                          <div className="flex items-center gap-4 text-secondary/60 mt-4">
                            <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-outline/80">
                              {msg.dateKey === 'TODAY' ? '今天' : msg.dateKey === 'YESTERDAY' ? '昨天' : '过往的誓言'}
                            </span>
                            <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
                          </div>
                        )}

                        <article className="relative flex flex-col gap-2 group transition-all p-2 rounded-xl hover:bg-surface-container-low/10">
                          <div className="flex items-center gap-2 text-secondary mb-1 justify-between">
                            <span className="text-[11px] uppercase tracking-tighter text-outline">{msg.timestamp}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-outline-variant/15 text-on-surface scale-90">
                              From {msg.sender === 'J' ? userCredentials.partnerJName : userCredentials.partnerAName}
                            </span>
                          </div>

                          <div className="flex items-start gap-4">
                            {/* Message Indicator dot */}
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                            
                            <div className="flex-grow space-y-3">
                              {/* Message summary title */}
                              <p className="font-sans text-base leading-relaxed text-on-surface">
                                {msg.title}
                              </p>

                              {/* Formatted detail textbox blockquote if exists */}
                              {msg.detailText && (
                                <div className="p-4 bg-surface-container-lowest border border-outline-variant/20 italic font-serif text-on-surface-variant text-sm leading-loose rounded-xl relative">
                                  <span className="absolute -top-2 left-4 text-xs font-serif text-outline bg-surface-container-lowest px-1 opacity-60">"</span>
                                  {msg.detailText}
                                </div>
                              )}

                              {/* Dynamic attached thumbnail rendered inside message block if exists */}
                              {msg.imageUrl && (
                                <div className="relative bg-surface-container-low p-4 rounded-xl shadow-xs max-w-sm border border-outline-variant/10">
                                  <div className="aspect-[4/5] overflow-hidden mb-2 bg-surface-dim">
                                    <img
                                      alt="Message attachment"
                                      className="w-full h-full object-cover rounded-lg"
                                      src={msg.imageUrl}
                                    />
                                  </div>
                                  <p className="font-serif text-[11px] italic text-center text-primary-container py-1 bg-primary/5 rounded">
                                    ✨ 恋人专属珍贵附件
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sent raw custom ritual composers placeholder */}
              <div className="mt-8 pt-8 text-center">
                <button
                  onClick={() => setIsSendRitualOpen(true)}
                  className="inline-flex flex-col items-center gap-2.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full border border-outline-variant/40 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-xs uppercase tracking-widest text-secondary opacity-60 group-hover:opacity-100">
                    Send a ritual / 互传浪漫消息
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'mine' && (
            <motion.div
              key="mine-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Minimalist Profile/Join Section */}
              <section className="text-center flex flex-col items-center py-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/15 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-4 text-outline">
                  <User className="w-8 h-8 text-outline" />
                </div>

                <h2 className="font-serif text-2xl text-primary mb-1">
                  {userCredentials.partnerJName} &amp; {userCredentials.partnerAName}
                </h2>
                <p className="font-sans text-xs text-emerald-600 mb-4 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                  ✓ 连结存储云生效中 • 已记录 {daysCount} 天爱意细节
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-4 py-1.5 border border-outline text-primary rounded-full font-sans text-xs hover:bg-surface-variant/10 transition-all font-medium cursor-pointer"
                  >
                    账户契约设定
                  </button>
                </div>
              </section>

              {/* Divider with label */}
              <div className="flex items-center gap-4 mb-stack-gap-md opacity-30">
                <div className="h-[1px] flex-grow bg-outline"></div>
                <span className="font-sans text-xs uppercase tracking-widest text-[#1d1b1a]">您的收藏</span>
                <div className="h-[1px] flex-grow bg-outline"></div>
              </div>

              {/* Collection Content Segment text */}
              <header className="text-center md:text-left space-y-1.5">
                <h3 className="font-serif text-3xl text-primary font-light">瞬时胶卷</h3>
                <p className="font-sans text-xs text-secondary max-w-sm">
                  捕捉发生的每一刻。有些永恒，有些渐成回忆。
                </p>
              </header>

              {/* Asymmetric / Masonry feed structure list of polaroids */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                {memories.map((memo, index) => {
                  const isVeryRecent = memo.remainingDays !== undefined && memo.remainingDays <= 3;
                  
                  // Generates organic beautiful slight tilt styling
                  const tiltAngle = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-2' : '-rotate-2';
                  
                  return (
                    <div
                      key={memo.id}
                      onClick={() => setSelectedMemory(memo)}
                      className={`flex flex-col gap-2 animate-fade-in group pointer-events-auto cursor-zoom-in`}
                    >
                      <div className={`polaroid-frame bg-white p-3 shadow-md hover:shadow-lg transition-transform transition-shadow duration-500 rounded-sm transform ${tiltAngle}`}>
                        <div className="aspect-square bg-surface-container overflow-hidden relative group">
                          <img
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                            alt="Couple Polaroid Snapshot"
                            src={memo.imageUrl}
                          />

                          {/* Top right visibility countdown label */}
                          <div className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider text-white shadow-sm ${memo.visibility === 'permanent' ? 'bg-primary/90' : 'bg-secondary/80'}`}>
                            {memo.visibility === 'permanent' ? '永久' : `${memo.remainingDays} 天`}
                          </div>
                        </div>

                        <div className="mt-4 pb-1">
                          <p className="font-serif text-base text-primary font-medium truncate">
                            {memo.title}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-sans text-[10px] text-secondary opacity-60 uppercase">
                              可见性：{memo.visibility === 'permanent' ? '永久' : '瞬时限期'}
                            </p>
                            {memo.visibility === 'temp' && (
                              <p className={`text-[10px] ${isVeryRecent ? 'text-red-500 font-bold' : 'text-amber-600'}`}>
                                剩余 {memo.remainingDays} 天
                              </p>
                            )}
                          </div>
                          
                          {/* Footprint Badge of Creator */}
                          <div className="h-[1px] bg-neutral-100 my-2" />
                          <div className="flex items-center justify-between text-[8px] text-neutral-400">
                            <span>已备份在云端</span>
                            <span>SNAPSHOT BY {memo.author === 'J' ? userCredentials.partnerJName : userCredentials.partnerAName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING ACTION ACTION BUTTONS DYNAMIC CHANGER */}
      <AnimatePresence>
        {activeTab === 'mine' && (
          <motion.button
            key="cam-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsAddMemoryOpen(true)}
            className="fixed bottom-24 right-6 md:right-16 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 z-50 group hover:bg-primary-container cursor-pointer"
            id="snap-memory-fab"
            title="拍摄上传新胶卷"
          >
            <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          </motion.button>
        )}

        {activeTab === 'menu' && (
          <motion.button
            key="menu-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsAddMenuOpen(true)}
            className="fixed bottom-24 right-6 md:right-16 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 z-50 group hover:bg-primary-container cursor-pointer"
            id="add-meal-fab"
            title="添加新菜品到手写菜单"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* COMPLIANT BOTTOM DENSE NAVIGATION BAR WITH FROST GLASS PANEL */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-surface/90 border-t border-outline-variant/30 backdrop-blur-2xl">
        <div className="flex justify-around items-center h-20 px-4 md:px-12 max-w-2xl mx-auto">
          {/* Home Active */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center pt-2 transition-all cursor-pointer ${activeTab === 'home' ? 'text-primary border-t-2 border-primary mt-[-2px] opacity-100 font-medium' : 'text-secondary opacity-60 hover:opacity-100'}`}
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">首页</span>
          </button>

          {/* Menu */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center pt-2 transition-all cursor-pointer ${activeTab === 'menu' ? 'text-primary border-t-2 border-primary mt-[-2px] opacity-100 font-medium' : 'text-secondary opacity-60 hover:opacity-100'}`}
          >
            <UtensilsCrossed className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">菜单</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center justify-center pt-2 transition-all cursor-pointer ${activeTab === 'messages' ? 'text-primary border-t-2 border-primary mt-[-2px] opacity-100 font-medium' : 'text-secondary opacity-60 hover:opacity-100'}`}
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">消息</span>
          </button>

          {/* Mine */}
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex flex-col items-center justify-center pt-2 transition-all cursor-pointer ${activeTab === 'mine' ? 'text-primary border-t-2 border-primary mt-[-2px] opacity-100 font-medium' : 'text-secondary opacity-60 hover:opacity-100'}`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">我的</span>
          </button>
        </div>
      </nav>

      {/* ======================================= */}
      {/* MODAL COZY FLOATING OVERLAYS (SNEAK-PEEKS) */}
      {/* ======================================= */}

      {/* 1. SETTINGS OVERLAY */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 polaroid-shadow border border-outline-variant/30 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-light/60">
              <h3 className="font-serif text-lg text-primary font-medium">✨ 契约与记忆参数设定</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-secondary hover:text-primary transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Target Anniversary date setter */}
              <div className="space-y-1">
                <label className="text-xs text-secondary-61 font-medium font-sans">建立连结纪念日 (Anniversary Date)</label>
                <input
                type="date"
                value={settings.anniversaryDate}
                onChange={e => setSettings(prev => ({ ...prev, anniversaryDate: e.target.value }))}
                className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-sans"
              />
              </div>

              {/* Names Customizations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-secondary-61 font-medium font-sans">伙伴 Z 名字</label>
                  <input
                    type="text"
                    value={userCredentials.partnerAName}
                    onChange={e => setUserCredentials(prev => ({ ...prev, partnerAName: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-secondary-61 font-medium font-sans">伙伴 L 名字</label>
                  <input
                    type="text"
                    value={userCredentials.partnerJName}
                    onChange={e => setUserCredentials(prev => ({ ...prev, partnerJName: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-sans"
                  />
                </div>
              </div>

              {/* Quote Customizable */}
              <div className="space-y-1">
                <label className="text-xs text-secondary-61 font-medium font-sans">今日爱意寄语 (Daily Slogan)</label>
                <textarea
                  rows={3}
                  value={settings.customQuote}
                  onChange={e => setSettings(prev => ({ ...prev, customQuote: e.target.value }))}
                  className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-serif italic"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={async () => {
                  if (confirm("确定要恢复到最初的高分屏预置模拟吗？此项操作将清空本地修改。")) {
                    try {
                      await resetAppData();
                      window.location.reload();
                    } catch (err) {
                      alert(err instanceof Error ? err.message : '重置失败');
                    }
                  }
                }}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-xl font-sans"
              >
                清空并恢复出厂重置
              </button>
              <button
                onClick={async () => {
                  try {
                    await saveSettings();
                    setIsSettingsOpen(false);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : '保存设置失败');
                  }
                }}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs rounded-xl text-center font-sans font-medium hover:opacity-100"
              >
                保存并保存契约
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SNAP MEMORY OVERLAY */}
      {isAddMemoryOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 polaroid-shadow border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-1">
              <h3 className="font-serif text-lg text-primary font-medium">📸 咔嚓！拍摄珍贵胶卷</h3>
              <button 
                onClick={() => {
                  setIsAddMemoryOpen(false);
                  setMemoryAddImageUrl('');
                }} 
                className="text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const visType = formData.get('visibility') as 'permanent' | 'temp';
                const days = Number(formData.get('days') || 3);

                if (!title) {
                  alert("请随手写个优雅的相片名字吧 ✒️");
                  return;
                }

                const rawUrl = memoryImageSourceType === 'custom' && memoryAddImageUrl
                  ? memoryAddImageUrl
                  : (formData.get('imageUrlPreset') as string || selectedMemoryPresetUrl || PRELOAD_AESTHETIC_IMAGES[0].url);

                try {
                  const imageUrl = await resolveImageUrl(rawUrl, memoryImageSourceType === 'custom');
                  await addMemory({
                    title,
                    imageUrl,
                    visibility: visType,
                    remainingDays: visType === 'temp' ? days : undefined,
                    author: currentRole,
                  });
                  await notifyFeed(
                    'film',
                    `${partnerName} 上传了一张新胶卷：[${title}]。`,
                    `捕捉于 ${new Date().toLocaleDateString('zh-CN')} 属于你们的专属甜蜜回忆时刻。`,
                    imageUrl
                  );
                  setIsAddMemoryOpen(false);
                  setMemoryAddImageUrl('');
                } catch (err) {
                  alert(err instanceof Error ? err.message : '添加胶卷失败');
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">胶卷命名（如“周日的早晨”）</label>
                <input
                  type="text"
                  name="title"
                  placeholder="给照片起个名字..."
                  className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-sm font-sans"
                  required
                />
              </div>

              {/* Multi-choice Image Selector for Memories */}
              <div className="space-y-2">
                <label className="text-xs text-secondary font-semibold font-sans flex items-center gap-1.5 text-primary">
                  <Camera className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>照片图源来源（库选/上传/拍摄）</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setMemoryImageSourceType('preset')}
                    className={`py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${memoryImageSourceType === 'preset' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    🎨 艺术预设库
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemoryImageSourceType('custom')}
                    className={`py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${memoryImageSourceType === 'custom' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    📸 本地上传 / 拍摄
                  </button>
                </div>

                {memoryImageSourceType === 'preset' ? (
                  <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-thin">
                    {PRELOAD_AESTHETIC_IMAGES.map(img => (
                      <label key={img.name} className="flex-shrink-0 cursor-pointer text-center relative group">
                        <input
                          type="radio"
                          name="imageUrlPreset"
                          value={img.url}
                          checked={selectedMemoryPresetUrl === img.url}
                          onChange={() => {
                            setSelectedMemoryPresetUrl(img.url);
                          }}
                          className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/25 transition-all">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[8px] text-[#5e5e5d] block truncate w-14 group-hover:text-primary mt-1">
                          {img.name.split(' (')[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-outline-variant/50 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 bg-neutral-50/50">
                    {memoryAddImageUrl ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/50 shadow-xs bg-white">
                        <img src={memoryAddImageUrl} alt="Uploaded snapshot preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setMemoryAddImageUrl('')}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
                          title="移除此图"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex gap-2 justify-center w-full">
                      {/* Upload Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-outline hover:bg-neutral-50 rounded-xl text-xs cursor-pointer text-[#4e4e4e] font-sans transition-colors">
                        <Upload className="w-3.5 h-3.5 text-secondary" />
                        <span>上传本地照片</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMemoryImageUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Shoot Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs cursor-pointer font-sans transition-all active:scale-95 text-center">
                        <Camera className="w-3.5 h-3.5 text-white" />
                        <span>呼唤相机拍摄</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleMemoryImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-secondary text-center">
                      在手机端点击后会直接拉起您的原生相机镜头；在桌面网页中可以上传以往拍好的回忆照片。
                    </p>
                  </div>
                )}
              </div>

              {/* Visibility parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-secondary font-medium font-sans">存储契约可见性</label>
                  <select
                    name="visibility"
                    className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface bg-white"
                    defaultValue="permanent"
                  >
                    <option value="permanent">永久 (Keep Always)</option>
                    <option value="temp">瞬时 (Expiration Alert)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-secondary font-medium font-sans">限时衰变长度 (天)</label>
                  <input
                    type="number"
                    name="days"
                    min={1}
                    max={14}
                    defaultValue={3}
                    className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMemoryOpen(false);
                    setMemoryAddImageUrl('');
                  }}
                  className="px-5 py-1.5 border border-outline-variant text-[#5e5e5d] text-xs rounded-full hover:bg-neutral-50 cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-primary hover:bg-primary/95 text-white font-medium text-xs rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>立刻按下快门!</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD MEAL OVERLAY */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 polaroid-shadow border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-1">
              <h3 className="font-serif text-lg text-primary font-medium">🍽️ 手写今日新菜谱</h3>
              <button 
                onClick={() => {
                  setIsAddMenuOpen(false);
                  setMenuAddImageUrl('');
                }} 
                className="text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const subtitle = formData.get('subtitle') as string;
                const category = formData.get('category') as Exclude<'all' | 'main' | 'dessert' | 'drink', 'all'>;
                const tag = formData.get('tag') as string;
                const ingredients = formData.get('ingredients') as string;

                if (!title) {
                  alert("菜品名字不能为空哦~ 🥐");
                  return;
                }

                const rawUrl = imageSourceType === 'custom' && menuAddImageUrl
                  ? menuAddImageUrl
                  : (formData.get('imageUrlPreset') as string || selectedPresetUrl || PRELOAD_AESTHETIC_IMAGES[10].url);

                try {
                  const imageUrl = await resolveImageUrl(rawUrl, imageSourceType === 'custom');
                  await addMenuItem({
                    title,
                    subtitle: subtitle || '精心调制的美味配料，蕴藏着温柔与热情。',
                    category,
                    tag: tag || '分享爱',
                    imageUrl,
                    author: currentRole,
                    ingredients: ingredients || '',
                  });
                  await notifyFeed(
                    'menu_update',
                    `${partnerName} 更新了今日手写菜单：[${title}]。`,
                    `"${subtitle || '精心调制的美味配料，蕴藏着温柔与热情。'}" | 所需食材: ${ingredients || '未注明'} | 爱的专属标签：#${tag}`
                  );
                  setIsAddMenuOpen(false);
                  setMenuAddImageUrl('');
                } catch (err) {
                  alert(err instanceof Error ? err.message : '添加菜品失败');
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">菜品名字（如“黑巧克力甘纳许”）</label>
                <input
                  type="text"
                  name="title"
                  placeholder="输入菜名..."
                  className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-sans text-on-surface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-secondary font-medium font-sans">菜谱品类</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface"
                    defaultValue="main"
                  >
                    <option value="main">主菜与副菜</option>
                    <option value="dessert">精致甜点</option>
                    <option value="drink">微醺饮品</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-secondary font-medium font-sans">爱的专属标签</label>
                  <input
                    type="text"
                    name="tag"
                    defaultValue="分享爱"
                    placeholder="例如：传承 / 午夜 / 治愈"
                    className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface"
                  />
                </div>
              </div>

              {/* Multi-choice Image Selector: Preset vs. Upload / Snap */}
              <div className="space-y-2">
                <label className="text-xs text-secondary font-semibold font-sans flex items-center gap-1.5 text-primary">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                  <span>美食外观封面（支持库选/上传/拍摄）</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setImageSourceType('preset')}
                    className={`py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${imageSourceType === 'preset' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    🎨 艺术预设库
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceType('custom')}
                    className={`py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${imageSourceType === 'custom' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    📸 本地上传 / 拍摄
                  </button>
                </div>

                {imageSourceType === 'preset' ? (
                  <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-thin">
                    {PRELOAD_AESTHETIC_IMAGES.filter(img => ['Strawberry', 'Pasta', 'Steak', 'Miso', 'Ganache'].some(k => img.name.includes(k))).map(img => (
                      <label key={img.name} className="flex-shrink-0 cursor-pointer text-center relative group">
                        <input
                          type="radio"
                          name="imageUrlPreset"
                          value={img.url}
                          checked={selectedPresetUrl === img.url}
                          onChange={() => {
                            setSelectedPresetUrl(img.url);
                          }}
                          className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/25 transition-all">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[8px] text-[#5e5e5d] block truncate w-14 group-hover:text-primary mt-1">
                          {img.name.split(' (')[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-outline-variant/50 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 bg-neutral-50/50">
                    {menuAddImageUrl ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/50 shadow-xs bg-white">
                        <img src={menuAddImageUrl} alt="Uploaded dish preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setMenuAddImageUrl('')}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
                          title="移除此图"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex gap-2 justify-center w-full">
                      {/* Upload Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-outline hover:bg-neutral-50 rounded-xl text-xs cursor-pointer text-[#4e4e4e] font-sans transition-colors">
                        <Upload className="w-3.5 h-3.5 text-secondary" />
                        <span>上传本地美食照</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMenuImageUpload(e, 'add')}
                          className="hidden"
                        />
                      </label>

                      {/* Shoot Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs cursor-pointer font-sans transition-all active:scale-95 text-center">
                        <Camera className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span>呼唤相机拍摄</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleMenuImageUpload(e, 'add')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-secondary text-center">
                      在移动端点击呼唤相机，会拉起系统原生摄制镜头；电脑上可上传已拍好的美食相片。
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">制作所需要的食材 (Ingredients List)</label>
                <textarea
                  name="ingredients"
                  rows={2}
                  placeholder="请输入此菜品所需的食材清单，如：优质黑鳕鱼、日式味噌酱、清酒、赤砂糖..."
                  className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">菜品工艺与过程描述 (subtitle)</label>
                <textarea
                  name="subtitle"
                  rows={2}
                  placeholder="用中文描述此菜品的原料起源与慢功细作工艺，如：将鳕鱼浸入味噌与清酒中慢炖三天，再经炉火文熟慢烤，令香气完美沁入..."
                  className="w-full px-3 py-1.5 border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setMenuAddImageUrl('');
                  }}
                  className="px-5 py-1.5 border border-outline-variant text-[#5e5e5d] text-xs rounded-full hover:bg-neutral-50 cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-primary text-white text-xs rounded-full hover:bg-primary/95 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>挂在今日墙上</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3.5 EDIT MEAL OVERLAY */}
      {editingMenuItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 polaroid-shadow border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-1">
              <h3 className="font-serif text-lg text-primary font-medium">📝 修改爱的菜单</h3>
              <button onClick={() => setEditingMenuItem(null)} className="text-secondary hover:text-primary transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const subtitle = formData.get('subtitle') as string;
                const category = formData.get('category') as Exclude<'all' | 'main' | 'dessert' | 'drink', 'all'>;
                const tag = formData.get('tag') as string;
                const ingredients = formData.get('ingredients') as string;

                if (!title) {
                  alert("菜品名字不能为空哦~ 🥐");
                  return;
                }

                const rawUrl = editImageSourceType === 'custom' && menuEditImageUrl
                  ? menuEditImageUrl
                  : (formData.get('imageUrlPreset') as string || editingMenuItem.imageUrl || PRELOAD_AESTHETIC_IMAGES[10].url);

                try {
                  const imageUrl = await resolveImageUrl(rawUrl, editImageSourceType === 'custom');
                  await updateMenuItem(editingMenuItem.id, {
                    title,
                    subtitle: subtitle || '精心调制的美味配料，蕴藏着温柔与热情。',
                    category,
                    tag: tag || '分享爱',
                    imageUrl,
                    ingredients: ingredients || '',
                  });
                  await notifyFeed(
                    'menu_update',
                    `${partnerName} 修改了菜谱：[${title}]。`,
                    `原配方已进阶！“${subtitle || '精心调制的美味配料，蕴藏着温柔与热情。'}” | 升级食材: ${ingredients || '未注明 (添加了超多恋人默契)'}`
                  );
                  setEditingMenuItem(null);
                  alert(`✨ 菜谱【${title}】修改成功！`);
                } catch (err) {
                  alert(err instanceof Error ? err.message : '修改菜品失败');
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">菜品名字（如“手工意面”）</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingMenuItem.title}
                  placeholder="输入菜名..."
                  className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-sans text-on-surface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-secondary font-medium font-sans">菜谱品类</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface"
                    defaultValue={editingMenuItem.category}
                  >
                    <option value="main">主菜与副菜</option>
                    <option value="dessert">精致甜点</option>
                    <option value="drink">微醺饮品</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-secondary font-medium font-sans">爱的专属标签（如“分享爱”）</label>
                  <input
                    type="text"
                    name="tag"
                    defaultValue={editingMenuItem.tag}
                    placeholder="例如：传承 / 午夜 / 治愈"
                    className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface"
                  />
                </div>
              </div>

              {/* Multi-choice Image Selector for Edit */}
              <div className="space-y-2">
                <label className="text-xs text-secondary font-semibold font-sans flex items-center gap-1.5 text-primary">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                  <span>更换美食外观封面（库选/上传/拍摄）</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setEditImageSourceType('preset')}
                    className={`py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${editImageSourceType === 'preset' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    🎨 艺术预设库
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditImageSourceType('custom')}
                    className={`py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${editImageSourceType === 'custom' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    📸 本地上传 / 拍摄
                  </button>
                </div>

                {editImageSourceType === 'preset' ? (
                  <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-thin">
                    {PRELOAD_AESTHETIC_IMAGES.filter(img => ['Strawberry', 'Pasta', 'Steak', 'Miso', 'Ganache'].some(k => img.name.includes(k))).map(img => (
                      <label key={img.name} className="flex-shrink-0 cursor-pointer text-center relative group">
                        <input
                          type="radio"
                          name="imageUrlPreset"
                          value={img.url}
                          checked={menuEditImageUrl === img.url}
                          onChange={() => {
                            setMenuEditImageUrl(img.url);
                          }}
                          className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/25 transition-all">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[8px] text-[#5e5e5d] block truncate w-14 group-hover:text-primary mt-1">
                          {img.name.split(' (')[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-outline-variant/50 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 bg-neutral-50/50">
                    {menuEditImageUrl ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/50 shadow-xs bg-white">
                        <img src={menuEditImageUrl} alt="Uploaded dish preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setMenuEditImageUrl('')}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
                          title="移除此图"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex gap-2 justify-center w-full">
                      {/* Upload Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-outline hover:bg-neutral-50 rounded-xl text-xs cursor-pointer text-[#4e4e4e] font-sans transition-colors">
                        <Upload className="w-3.5 h-3.5 text-secondary" />
                        <span>上传本地美食照</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMenuImageUpload(e, 'edit')}
                          className="hidden"
                        />
                      </label>

                      {/* Shoot Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs cursor-pointer font-sans transition-all active:scale-95 text-center">
                        <Camera className="w-3.5 h-3.5 text-white" />
                        <span>呼唤相机拍摄</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleMenuImageUpload(e, 'edit')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">制作所需要的食材 (Ingredients List)</label>
                <textarea
                  name="ingredients"
                  defaultValue={editingMenuItem.ingredients}
                  rows={2}
                  placeholder="请输入此菜品所需的食材清单，如：优质黑鳕鱼、日式味噌酱、清酒、赤砂糖..."
                  className="w-full px-3 py-1.5 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">菜品工艺与过程描述 (subtitle)</label>
                <textarea
                  name="subtitle"
                  rows={2}
                  defaultValue={editingMenuItem.subtitle}
                  placeholder="用中文描述此菜品的原料起源与慢功细作工艺，如：将鳕鱼浸入味噌与清酒中慢炖三天，再经炉火文熟慢烤，令香气完美沁入..."
                  className="w-full px-3 py-1.5 border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface resize-none"
                  required
                />
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm(`确定要从今日餐桌上移除【${editingMenuItem.title}】菜谱吗？😢`)) {
                      try {
                        await removeMenuItem(editingMenuItem.id);
                        await notifyFeed(
                          'menu_update',
                          `${partnerName} 移除了菜品：[${editingMenuItem.title}]。`,
                          `该菜谱已光荣下档，并手写封存在你们的爱心橱柜中。`
                        );
                        setEditingMenuItem(null);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : '删除菜品失败');
                      }
                    }
                  }}
                  className="px-4 py-1.5 border border-red-500/30 text-red-500 text-xs rounded-full hover:bg-red-50 hover:border-red-500 active:scale-95 transition-all cursor-pointer font-sans font-medium"
                >
                  删除此菜品
                </button>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="px-4 py-1.5 border border-outline-variant text-[#5e5e5d] text-xs rounded-full hover:bg-neutral-50 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-primary text-white text-xs rounded-full hover:bg-primary/95 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer font-sans font-medium"
                  >
                    <span>保存修改</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SEND A MESSAGE / RITUAL OVERLAY */}
      {isSendRitualOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 polaroid-shadow border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-1">
              <h3 className="font-serif text-lg text-primary font-medium">💌 互传浪漫/惊喜留言</h3>
              <button 
                onClick={() => {
                  setIsSendRitualOpen(false);
                  setRitualImageUrl('');
                  setRitualImageSourceType('none');
                }} 
                className="text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('message_text') as string;
                const type = formData.get('type') as 'surprise' | 'film' | 'menu_update' | 'custom';
                const hasDetailedText = formData.get('hasDetailedText') === 'true';
                const detailedText = formData.get('detailed_text') as string;

                if (!title) {
                  alert("留言核心文字不能为空哦 🧸");
                  return;
                }

                let finalImageUrl: string | undefined = undefined;
                if (ritualImageSourceType === 'preset') {
                  finalImageUrl = selectedRitualPresetUrl;
                } else if (ritualImageSourceType === 'custom' && ritualImageUrl) {
                  finalImageUrl = await resolveImageUrl(ritualImageUrl, true);
                }

                try {
                  await sendMessage({
                    sender: currentRole,
                    type,
                    title,
                    detailText: hasDetailedText ? detailedText : undefined,
                    imageUrl: finalImageUrl,
                  });
                  setIsSendRitualOpen(false);
                  setRitualImageUrl('');
                  setRitualImageSourceType('none');
                } catch (err) {
                  alert(err instanceof Error ? err.message : '发送消息失败');
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">留言类别 (Interactive Event Theme)</label>
                <select
                  name="type"
                  className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-sans text-on-surface bg-white"
                  defaultValue="custom"
                >
                  <option value="custom">💬 悄悄话/共同默契讨论</option>
                  <option value="surprise">🎁 惊喜时刻（如：今日礼物惊喜）</option>
                  <option value="menu_update">🍲 食材与配方改动通知</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-secondary font-medium font-sans">消息概要（如：J 选择了 [甜点之旅]...）</label>
                <input
                  type="text"
                  name="message_text"
                  placeholder="写下消息内容概要..."
                  className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-sm font-sans text-on-surface"
                  required
                />
              </div>

              {/* Multi-choice Image Selector for Message Card */}
              <div className="space-y-2">
                <label className="text-xs text-secondary font-semibold font-sans flex items-center gap-1.5 text-primary">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                  <span>附加卡片图片（可选）</span>
                </label>
                
                <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setRitualImageSourceType('none')}
                    className={`py-1 text-center text-[11px] font-sans rounded-lg transition-all cursor-pointer ${ritualImageSourceType === 'none' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    ❌ 无图片
                  </button>
                  <button
                    type="button"
                    onClick={() => setRitualImageSourceType('preset')}
                    className={`py-1 text-center text-[11px] font-sans rounded-lg transition-all cursor-pointer ${ritualImageSourceType === 'preset' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    🎨 预设库
                  </button>
                  <button
                    type="button"
                    onClick={() => setRitualImageSourceType('custom')}
                    className={`py-1 text-center text-[11px] font-sans rounded-lg transition-all cursor-pointer ${ritualImageSourceType === 'custom' ? 'bg-white shadow-xs font-medium text-primary' : 'text-secondary hover:text-on-surface'}`}
                  >
                    📸 上传/拍摄
                  </button>
                </div>

                {ritualImageSourceType === 'preset' && (
                  <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-thin">
                    {PRELOAD_AESTHETIC_IMAGES.map(img => (
                      <label key={img.name} className="flex-shrink-0 cursor-pointer text-center relative group">
                        <input
                          type="radio"
                          name="ritualImageUrlPreset"
                          value={img.url}
                          checked={selectedRitualPresetUrl === img.url}
                          onChange={() => {
                            setSelectedRitualPresetUrl(img.url);
                          }}
                          className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/25 transition-all">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[8px] text-[#5e5e5d] block truncate w-14 group-hover:text-primary mt-1">
                          {img.name.split(' (')[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {ritualImageSourceType === 'custom' && (
                  <div className="border border-dashed border-outline-variant/50 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 bg-neutral-50/50">
                    {ritualImageUrl ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/50 shadow-xs bg-white">
                        <img src={ritualImageUrl} alt="Uploaded snapshot preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setRitualImageUrl('')}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
                          title="移除此图"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex gap-2 justify-center w-full">
                      {/* Upload Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-outline hover:bg-neutral-50 rounded-xl text-[11px] cursor-pointer text-[#4e4e4e] font-sans transition-colors text-center">
                        <Upload className="w-3.5 h-3.5 text-secondary inline" />
                        <span className="ml-1">上传图片</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRitualImageUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Shoot Button */}
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary/95 rounded-xl text-[11px] cursor-pointer font-sans transition-all active:scale-95 text-center">
                        <Camera className="w-3.5 h-3.5 text-white inline animate-pulse" />
                        <span className="ml-1">拍照拍摄</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleRitualImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-secondary text-center leading-normal">
                      在移动设备上可以直接拉起摄像头拍照，或者选取相册照片。
                    </p>
                  </div>
                )}
              </div>

              {/* Support quote details blockquote optional */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    name="hasDetailedText"
                    id="include_det"
                    value="true"
                    className="rounded border-outline-variant/50 text-primary focus:ring-primary w-3.5 h-3.5"
                    defaultChecked={true}
                  />
                  <label htmlFor="include_det" className="text-xs text-secondary font-medium font-sans cursor-pointer select-none">
                    附加情书或卡片长信 (Include Quote card)
                  </label>
                </div>
                <textarea
                  rows={3}
                  name="detailed_text"
                  placeholder="Everything is prepared with the same quiet care we give to each other. Seasonal herbs, slow-cooked patience..."
                  defaultValue='"Everything is prepared with the same quiet care we give to each other."'
                  className="w-full px-3 py-2 border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary text-xs font-serif italic text-on-surface-variant leading-loose"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSendRitualOpen(false);
                    setRitualImageUrl('');
                    setRitualImageSourceType('none');
                  }}
                  className="px-5 py-1.5 border border-outline-variant text-[#5e5e5d] text-xs rounded-full hover:bg-neutral-50 cursor-pointer font-sans"
                >
                  关闭
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-primary text-white text-xs rounded-full hover:bg-primary/95 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer font-sans font-medium"
                >
                  <span>发送卡片</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LIGHTBOX PICTURE ENLARGED ZOOM POPUP */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
            className="fixed inset-0 bg-neutral-900/95 backdrop-blur-md flex flex-col items-center justify-center z-[120] p-4 cursor-zoom-out"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white p-4 max-w-sm md:max-w-md rounded-lg polaroid-shadow text-on-surface border border-neutral-700/20 shadow-2xl relative select-text"
            >
              {/* Close Button top corner */}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-2 right-2 bg-neutral-900/10 hover:bg-neutral-900/25 text-neutral-800 rounded-full p-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-square overflow-hidden bg-neutral-50 mb-4 border border-neutral-100 rounded-xs">
                <img src={selectedMemory.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif text-xl text-primary font-semibold">{selectedMemory.title}</h4>
                  <span className="text-[10px] bg-primary/10 text-primary tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                    Shot on {new Date(selectedMemory.dateAdded).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-xs text-secondary-61 text-on-surface-variant font-sans">
                  通过对偶胶片契约拍摄 • 由伙伴{' '}
                  <span className="font-serif italic font-bold">
                    {selectedMemory.author === 'J' ? userCredentials.partnerJName : userCredentials.partnerAName}
                  </span>{' '}
                  捕捉在此。
                </p>

                <div className="h-[0.5px] bg-outline-variant/30 my-3" />
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-secondary select-none">此相片将永久妥善沉淀在本地云库</span>
                  <div className="flex items-center gap-1.5 text-red-500 font-medium">
                    <Heart className="w-4 h-4 fill-red-500 inline text-red-500 animate-pulse" />
                    <span>极度喜爱 (Couples Favour)</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-neutral-400 text-xs mt-6 select-none font-sans">
              点击屏幕任何空白处，可无阻碍退回胶卷墙
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
