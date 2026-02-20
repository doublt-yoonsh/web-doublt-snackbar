import type { OrderStatus } from '@/shared/types';

export interface OrderStatusOption {
  value: OrderStatus;
  label: string;
  color: string;
}

export const ORDER_STATUSES: OrderStatusOption[] = [
  { value: 'PENDING', label: '대기중', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'PROCESSING', label: '처리중', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'COMPLETED', label: '완료', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
];

export const ORDER_TYPE_LABELS: Record<string, string> = {
  snack: '간식',
  breakfast: '조식',
  supply: '비품',
};
