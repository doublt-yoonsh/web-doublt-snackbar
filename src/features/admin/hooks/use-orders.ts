"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { OrderResponse, OrderStatus } from "@/shared/types";
import type { AdminFilters } from "../types";
import { getAdminToken } from "./use-admin-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function useOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const fetchOrders = useCallback(async (filters: AdminFilters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "ALL") {
        params.set("status", filters.status);
      }
      if (filters.department) {
        params.set("department", filters.department);
      }
      if (filters.search) {
        params.set("name", filters.search);
      }
      if (filters.type && filters.type !== "ALL") {
        params.set("type", filters.type);
      }
      if (filters.dateFrom) {
        params.set("dateFrom", filters.dateFrom);
      }
      if (filters.dateTo) {
        params.set("dateTo", filters.dateTo);
      }
      const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error("주문 목록을 불러올 수 없습니다");
      const data: OrderResponse[] = await res.json();
      setOrders(data);
    } catch {
      toast.error("주문 목록을 불러오는 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("상태 변경에 실패했습니다");
      const updated: OrderResponse = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setSelectedOrder((prev) => (prev?.id === orderId ? updated : prev));
      toast.success("주문 상태가 변경되었습니다");
    } catch {
      toast.error("상태 변경 중 오류가 발생했습니다");
    }
  }, []);

  return {
    orders,
    isLoading,
    selectedOrder,
    setSelectedOrder,
    fetchOrders,
    updateStatus,
  };
}
