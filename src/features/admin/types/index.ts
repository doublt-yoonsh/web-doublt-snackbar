import type { OrderStatus, OrderType } from "@/shared/types";

export interface AdminFilters {
  status: OrderStatus | "ALL";
  department: string;
  search: string;
  type: OrderType | "ALL" | "";
  dateFrom: string;
  dateTo: string;
}
