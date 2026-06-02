/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PolaroidMemory, MenuItem, MessageFeedItem, AppSettings } from './types';
import { STORAGE_IMAGES } from './lib/storageImages';

const S = STORAGE_IMAGES;

export const INITIAL_MEMORIES: PolaroidMemory[] = [
  {
    id: 'mem_1',
    title: '周日的早晨',
    imageUrl: S.handsTwined,
    visibility: 'permanent',
    author: 'A',
    dateAdded: '2026-05-30T08:00:00Z',
  },
  {
    id: 'mem_2',
    title: '迷雾',
    imageUrl: S.mistyMountains,
    visibility: 'temp',
    remainingDays: 3,
    author: 'J',
    dateAdded: '2026-06-01T15:30:00Z',
  },
  {
    id: 'mem_3',
    title: '威尼斯记忆',
    imageUrl: S.veniceBalcony,
    visibility: 'permanent',
    author: 'A',
    dateAdded: '2026-05-25T11:20:00Z',
  },
  {
    id: 'mem_4',
    title: '瞬时',
    imageUrl: S.vaseBranch,
    visibility: 'temp',
    remainingDays: 7,
    author: 'J',
    dateAdded: '2026-05-29T09:15:00Z',
  },
  {
    id: 'mem_5',
    title: '忧郁时刻',
    imageUrl: S.mistyMountains,
    visibility: 'permanent',
    author: 'A',
    dateAdded: '2026-05-20T17:45:00Z',
  },
  {
    id: 'mem_6',
    title: '显影中',
    imageUrl: S.vintageCamera,
    visibility: 'temp',
    remainingDays: 1,
    author: 'J',
    dateAdded: '2026-06-01T22:10:00Z',
  },
];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'menu_1',
    title: '手工意面',
    category: 'main',
    subtitle: '精选高筋面粉与杜兰小麦，加入散养土鸡蛋手工揉面切条。入水微沸慢煮，出锅淋上初榨橄榄油与特调罗勒欧芹汁，清香盈口。',
    tag: '分享爱',
    imageUrl: S.wineGlasses,
    author: 'J',
    ingredients: '精制高筋面粉、新鲜农场散养鸡蛋、手工研磨意式杜兰小麦面粉、初榨橄榄油、海盐、欧芹碎',
  },
  {
    id: 'menu_2',
    title: '周日烤肉',
    category: 'main',
    subtitle: '草饲牛肉洗净拍松，用露水迷迭香、现磨黑胡椒与无盐黄油腌制封煎，配以有机黄金土豆、胡萝卜置入烤排微火温慢烤。',
    tag: '传承',
    imageUrl: S.wineGlasses,
    author: 'A',
    ingredients: '300克顶级草饲谷饲牛肉、新鲜露水迷迭香、精选黄金土豆、有机胡萝卜、現磨黑胡椒、天然无盐黄油',
  },
  {
    id: 'menu_3',
    title: '味增银鳕鱼',
    category: 'main',
    subtitle: '深海鳕鱼厚切沥干，双面细腻揉抹上红味噌、熟成米清酒与味醂腌制3天。微火慢焙烤至表面金黄、油脂盈溢，入口即化。',
    tag: '禅意时刻',
    imageUrl: S.veniceBalcony,
    author: 'J',
    ingredients: '深海新鲜银鳕鱼、日式红味噌、三日熟成秘密米曲清酒、优质味醂、赤砂糖、有机生姜泥',
  },
  {
    id: 'menu_4',
    title: '黑巧克力甘纳许',
    category: 'dessert',
    subtitle: '将70%比利时黑可可脂巧克力块与特重鲜奶油混合，温水慢隔慢熬出极致丝滑度，冷凝成形后，落上一瓣海盐之花。',
    tag: '午夜',
    imageUrl: S.cozyBed,
    author: 'A',
    ingredients: '70%比利时纯可可脂黑巧克力块、特浓动物重性鲜奶油、法国手工采集盐之花（Fleur de Sel）、马达加斯加天然香草荚',
  },
];

export const INITIAL_MESSAGES: MessageFeedItem[] = [
  {
    id: 'msg_1',
    timestamp: '10:42 AM',
    dateKey: 'TODAY',
    sender: 'J',
    type: 'surprise',
    title: 'J 选择了 [甜点之旅] 作为今日惊喜。',
    imageUrl: S.polaroids,
  },
  {
    id: 'msg_2',
    timestamp: 'Yesterday',
    dateKey: 'YESTERDAY',
    sender: 'A',
    type: 'film',
    title: 'A 上传了一张新胶卷：[周日的早晨]。',
    detailText: 'Sunday morning glow',
    imageUrl: S.cozyBed,
  },
  {
    id: 'msg_3',
    timestamp: 'Saturday',
    dateKey: 'WEEK',
    sender: 'J',
    type: 'menu_update',
    title: 'J 更新了菜单原料：[分享爱]。',
    detailText: '"Everything is prepared with the same quiet care we give to each other. Seasonal herbs, slow-cooked patience, and a dash of us."',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  anniversaryDate: '2023-01-15',
  customQuote: '“在每一次共同的沉默中，我都能找到一千个爱你的理由。”',
};

export const PRELOAD_AESTHETIC_IMAGES = [
  { name: 'Hands Twined (周日的早晨)', url: S.handsTwined },
  { name: 'Misty Mountains (迷雾)', url: S.mistyMountains },
  { name: 'Venice Balcony (威尼斯记忆)', url: S.veniceBalcony },
  { name: 'Vase & Branch (瞬时)', url: S.vaseBranch },
  { name: 'Sunset Ocean (忧郁时刻)', url: S.mistyMountains },
  { name: 'Vintage Camera (显影中)', url: S.vintageCamera },
  { name: 'Two Wine Glasses (红酒对饮)', url: S.wineGlasses },
  { name: 'Multiple Polaroids (回忆合集)', url: S.polaroids },
  { name: 'Cozy Bed (慵懒早晨)', url: S.cozyBed },
  { name: 'Strawberry Cake (草莓蛋糕)', url: S.polaroids },
  { name: 'Tasty Pasta (手工意面)', url: S.wineGlasses },
  { name: 'Juicy Steak (美味牛排)', url: S.wineGlasses },
  { name: 'Miso Sea Bass (味噌银鳕鱼)', url: S.veniceBalcony },
  { name: 'Ganache Chocolate (纯黑甘纳许)', url: S.cozyBed },
];

export const PRESET_PROMPTS = [
  '今天最让你开心的三个瞬间是什么？',
  '如果我们要一起去一个陌生城市流浪一个月，你会选哪里？',
  '你觉得我们最像哪一部电影里的情侣角色？',
  '还记得我们第一次一起看电影/吃饭时，你心里在想什么吗？',
  '如果今天可以用超能力帮对方做一件事，你希望是什么？',
  '描述一个哪怕在一起很久依然会让你心跳加速的小细节。',
  '我们各自最喜欢今天菜单上的哪道菜？',
  '今天有哪首歌让你在某个瞬间想起了我？',
  '对你来说，在我们的共享空间里，最无可替代的仪式感是什么？',
];
