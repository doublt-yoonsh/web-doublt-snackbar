export type OrderType = 'snack' | 'breakfast';

export type Department =
  | 'dev'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'hr'
  | 'finance';

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
