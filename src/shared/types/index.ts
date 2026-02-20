export type OrderType = 'snack' | 'breakfast' | 'supply';

export type Department =
  | 'strategy'
  | 'dev';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SelectedItem {
  id: string;
  quantity: number;
}

export interface OrderRequest {
  type: OrderType;
  items: SelectedItem[];
  name: string;
  department: Department;
  note?: string;
}

export interface OrderFormData {
  name: string;
  department: Department;
  note: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED';

export interface OrderItemResponse {
  id: number;
  link: string | null;
  productName: string;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  type: string;
  name: string;
  department: string;
  note: string | null;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemResponse[];
}
