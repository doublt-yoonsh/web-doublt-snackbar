import type { MenuItem } from '@/shared/types';

export const SNACK_ITEMS: MenuItem[] = [
  {
    id: 'chips',
    name: '감자칩',
    description: '바삭바삭한 오리지널 감자칩',
    icon: '🥔',
  },
  {
    id: 'chocolate',
    name: '초콜릿',
    description: '달콤한 밀크 초콜릿 바',
    icon: '🍫',
  },
  {
    id: 'nuts',
    name: '견과류 믹스',
    description: '아몬드, 호두, 캐슈넛 믹스',
    icon: '🥜',
  },
  {
    id: 'cookies',
    name: '쿠키',
    description: '버터 풍미 가득 쿠키',
    icon: '🍪',
  },
  {
    id: 'fruit',
    name: '건과일',
    description: '망고, 바나나, 사과 건조칩',
    icon: '🍎',
  },
  {
    id: 'yogurt',
    name: '요거트',
    description: '그릭 요거트 (딸기맛)',
    icon: '🥛',
  },
];

export const BREAKFAST_ITEMS: MenuItem[] = [
  {
    id: 'sandwich',
    name: '샌드위치',
    description: '신선한 야채와 계란 샌드위치',
    icon: '🥪',
  },
  {
    id: 'rice',
    name: '주먹밥',
    description: '참치마요, 불고기 주먹밥',
    icon: '🍙',
  },
  {
    id: 'salad',
    name: '샐러드',
    description: '닭가슴살 그린 샐러드',
    icon: '🥗',
  },
  {
    id: 'cereal',
    name: '시리얼',
    description: '통곡물 시리얼 + 우유',
    icon: '🥣',
  },
  {
    id: 'toast',
    name: '토스트',
    description: '버터 토스트 + 잼',
    icon: '🍞',
  },
  {
    id: 'juice',
    name: '주스',
    description: '오렌지 생과일 주스',
    icon: '🧃',
  },
];
