"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ORDER_STATUSES, ORDER_TYPE_LABELS } from "@/shared/constants/order-status";
import { DEPARTMENTS } from "@/shared/constants/departments";
import { cn } from "@/shared/lib/utils";
import type { OrderResponse, OrderStatus } from "@/shared/types";

interface OrderDetailDialogProps {
  order: OrderResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
}

function getStatusOption(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status);
}

function getDepartmentLabel(value: string) {
  return DEPARTMENTS.find((d) => d.value === value)?.label ?? value;
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${y}/${m}/${d} ${hh}:${mm}`;
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: OrderDetailDialogProps) {
  if (!order) return null;

  const statusOpt = getStatusOption(order.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            주문 #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">타입</span>
              <p className="mt-0.5 font-medium">
                {ORDER_TYPE_LABELS[order.type] ?? order.type}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">상태</span>
              <div className="mt-0.5">
                <Badge className={cn("border-transparent", statusOpt?.color)}>
                  {statusOpt?.label ?? order.status}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">이름</span>
              <p className="mt-0.5 font-medium">{order.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">부서</span>
              <p className="mt-0.5 font-medium">
                {getDepartmentLabel(order.department)}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">신청일</span>
              <p className="mt-0.5">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="text-sm">
              <span className="text-muted-foreground">요청사항</span>
              <p className="mt-0.5 rounded-md bg-muted p-2">{order.note}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <h4 className="mb-2 text-sm font-medium">
              상품 목록 ({order.items.length}건)
            </h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <span>
                    {idx + 1}. {item.productName}
                    {item.quantity > 1 && (
                      <span className="ml-1 text-muted-foreground">x{item.quantity}</span>
                    )}
                  </span>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      링크
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status actions */}
          <div className="flex gap-2 border-t pt-4">
            {order.status !== "COMPLETED" && (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => onStatusChange(order.id, "COMPLETED")}
              >
                완료 처리
              </Button>
            )}
            {order.status === "COMPLETED" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onStatusChange(order.id, "PENDING")}
              >
                대기로 되돌리기
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
