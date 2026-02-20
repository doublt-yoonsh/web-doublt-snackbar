"use client";

import { Eye, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ORDER_STATUSES, ORDER_TYPE_LABELS } from "@/shared/constants/order-status";
import { DEPARTMENTS } from "@/shared/constants/departments";
import { cn } from "@/shared/lib/utils";
import type { OrderResponse } from "@/shared/types";

interface OrderTableProps {
  orders: OrderResponse[];
  isLoading: boolean;
  onSelectOrder: (order: OrderResponse) => void;
}

function getStatusOption(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status);
}

function getDepartmentLabel(value: string) {
  return DEPARTMENTS.find((d) => d.value === value)?.label ?? value;
}

function summarizeItems(items: OrderResponse["items"]) {
  if (items.length === 0) return "-";
  const first = items[0].productName;
  if (items.length === 1) return first;
  return `${first} 외 ${items.length - 1}건`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${y}/${m}/${d} ${hh}:${mm}`;
}

export function OrderTable({ orders, isLoading, onSelectOrder }: OrderTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <PackageOpen className="mb-2 h-10 w-10" />
        <p>주문이 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="w-[70px]">타입</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>부서</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusOpt = getStatusOption(order.status);
              return (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => onSelectOrder(order)}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ORDER_TYPE_LABELS[order.type] ?? order.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{order.name}</TableCell>
                  <TableCell>{getDepartmentLabel(order.department)}</TableCell>
                  <TableCell>
                    <Badge className={cn("border-transparent", statusOpt?.color)}>
                      {statusOpt?.label ?? order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {summarizeItems(order.items)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => {
          const statusOpt = getStatusOption(order.status);
          return (
            <Card
              key={order.id}
              className="cursor-pointer py-3"
              onClick={() => onSelectOrder(order)}
            >
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      #{order.id}
                    </span>
                    <Badge variant="outline">
                      {ORDER_TYPE_LABELS[order.type] ?? order.type}
                    </Badge>
                  </div>
                  <Badge className={cn("border-transparent", statusOpt?.color)}>
                    {statusOpt?.label ?? order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{order.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {getDepartmentLabel(order.department)}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {summarizeItems(order.items)}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{order.items.length}건</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
