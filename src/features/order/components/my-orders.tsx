"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, PackageOpen, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { DEPARTMENTS } from "@/shared/constants/departments";
import { ORDER_STATUSES, ORDER_TYPE_LABELS } from "@/shared/constants/order-status";
import { cn } from "@/shared/lib/utils";
import type { OrderResponse } from "@/shared/types";
import { API_BASE } from "@/shared/constants/api";

function getStatusOption(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status);
}

function getDepartmentLabel(value: string) {
  return DEPARTMENTS.find((d) => d.value === value)?.label ?? value;
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

export function MyOrders() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const handleSearch = useCallback(async () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요");
      return;
    }
    if (!department) {
      toast.error("부서를 선택해주세요");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({ name: name.trim(), department });
      const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error("조회 실패");
      const data: OrderResponse[] = await res.json();
      setOrders(data);
    } catch {
      toast.error("신청 목록을 불러오는 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }, [name, department]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">내 신청 조회</h2>
      </div>

      {/* Search form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">조회 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="space-y-2">
              <Label htmlFor="my-department">부서</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="my-department">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="my-name">이름</Label>
              <Input
                id="my-name"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
          </div>
          <Button className="w-full gap-2" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            조회하기
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <>
          <div className="text-sm text-muted-foreground">
            총 {orders.length}건
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <PackageOpen className="mb-2 h-10 w-10" />
              <p>신청 내역이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusOpt = getStatusOption(order.status);
                return (
                  <Card
                    key={order.id}
                    className="cursor-pointer py-3 transition-colors hover:bg-muted/30"
                    onClick={() => setSelectedOrder(order)}
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
                      <div className="flex items-center justify-between text-sm">
                        <span>{order.items.length}건</span>
                        <span className="text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Detail dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      >
        {selectedOrder && (
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                주문 #{selectedOrder.id}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">타입</span>
                  <p className="mt-0.5 font-medium">
                    {ORDER_TYPE_LABELS[selectedOrder.type] ?? selectedOrder.type}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">상태</span>
                  <div className="mt-0.5">
                    {(() => {
                      const opt = getStatusOption(selectedOrder.status);
                      return (
                        <Badge className={cn("border-transparent", opt?.color)}>
                          {opt?.label ?? selectedOrder.status}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">이름</span>
                  <p className="mt-0.5 font-medium">{selectedOrder.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">부서</span>
                  <p className="mt-0.5 font-medium">
                    {getDepartmentLabel(selectedOrder.department)}
                  </p>
                </div>
              </div>

              {selectedOrder.note && (
                <div className="text-sm">
                  <span className="text-muted-foreground">요청사항</span>
                  <p className="mt-0.5 rounded-md bg-muted p-2">
                    {selectedOrder.note}
                  </p>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-sm font-medium">
                  상품 목록 ({selectedOrder.items.length}건)
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
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
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
