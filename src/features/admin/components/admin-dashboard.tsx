"use client";

import { useState, useEffect, useCallback } from "react";
import { LogOut, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { OrderFilters } from "./order-filters";
import { OrderTable } from "./order-table";
import { OrderDetailDialog } from "./order-detail-dialog";
import { useOrders } from "../hooks/use-orders";
import type { AdminFilters } from "../types";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [filters, setFilters] = useState<AdminFilters>({
    status: "ALL",
    department: "",
    search: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });

  const {
    orders,
    isLoading,
    selectedOrder,
    setSelectedOrder,
    fetchOrders,
    updateStatus,
  } = useOrders();

  const loadOrders = useCallback(() => {
    fetchOrders(filters);
  }, [fetchOrders, filters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(filters);
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">DoubleT 관리자</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <OrderFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Order count */}
      <div className="mb-3 text-sm text-muted-foreground">
        총 {orders.length}건
      </div>

      {/* Table */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onSelectOrder={setSelectedOrder}
      />

      {/* Detail dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        onStatusChange={updateStatus}
      />
    </div>
  );
}
