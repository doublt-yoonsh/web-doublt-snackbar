"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Cookie, Coffee, Send, Loader2, Plus, X, Link, Download } from "lucide-react";
import { toast } from "sonner";
import { DEPARTMENTS } from "@/shared/constants/departments";
import { cn } from "@/shared/lib/utils";
import { API_BASE } from "@/shared/constants/api";

const orderFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  department: z.string().min(1, "부서를 선택해주세요"),
  note: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  onBack: () => void;
}

export function OrderForm({ onBack }: OrderFormProps) {
  const [orderType, setOrderType] = useState<"snack" | "breakfast">("snack");
  const [items, setItems] = useState<{ id: string; link: string; productName: string }[]>([
    { id: crypto.randomUUID(), link: "", productName: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingIndex, setFetchingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { name: "", department: "", note: "" },
  });

  const updateItem = (index: number, field: "link" | "productName", value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), link: "", productName: "" }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchProductName = async (index: number) => {
    const link = items[index].link.trim();
    if (!link) {
      toast.error("링크를 먼저 입력해주세요");
      return;
    }

    setFetchingIndex(index);
    try {
      const res = await fetch("/api/fetch-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const data = await res.json();

      if (res.ok && data.productName) {
        updateItem(index, "productName", data.productName);
      } else {
        toast.error(data.error || "상품명을 가져올 수 없습니다");
      }
    } catch {
      toast.error("상품 정보를 가져오는 중 오류가 발생했습니다");
    } finally {
      setFetchingIndex(null);
    }
  };

  const onSubmit = async (data: OrderFormValues) => {
    const validItems = items.filter((item) => item.link.trim());
    if (validItems.length === 0) {
      toast.error("최소 1개 이상의 쿠팡 링크를 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: orderType,
          name: data.name.trim(),
          department: data.department,
          note: data.note?.trim() || null,
          items: validItems.map((item) => ({
            link: item.link.trim(),
            productName: item.productName.trim() || "상품명 없음",
          })),
        }),
      });

      if (!res.ok) throw new Error("주문 실패");

      const productNames = validItems
        .map((item) => item.productName.trim() || "상품명 없음")
        .join(", ");

      setItems([{ id: crypto.randomUUID(), link: "", productName: "" }]);
      reset();
      onBack();

      setTimeout(() => {
        toast.success(`${productNames} 신청이 완료되었습니다.`);
      }, 100);
    } catch {
      toast.error("주문 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validLinkCount = items.filter((item) => item.link.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {orderType === "snack" ? (
          <Cookie className="h-6 w-6 text-primary" />
        ) : (
          <Coffee className="h-6 w-6 text-primary" />
        )}
        <h2 className="text-xl font-bold text-foreground">간식/조식 신청</h2>
      </div>

      {/* Type selector */}
      <div className="flex gap-2">
        <Button
          variant={orderType === "snack" ? "default" : "outline"}
          className={cn("flex-1 gap-2", orderType !== "snack" && "bg-transparent")}
          onClick={() => setOrderType("snack")}
        >
          <Cookie className="h-4 w-4" />
          간식
        </Button>
        <Button
          variant={orderType === "breakfast" ? "default" : "outline"}
          className={cn("flex-1 gap-2", orderType !== "breakfast" && "bg-transparent")}
          onClick={() => setOrderType("breakfast")}
        >
          <Coffee className="h-4 w-4" />
          조식
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Link className="h-4 w-4" />
            쿠팡 링크
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  상품 {index + 1}
                </span>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="https://www.coupang.com/..."
                  value={item.link}
                  onChange={(e) => updateItem(index, "link", e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5"
                  disabled={fetchingIndex === index}
                  onClick={() => fetchProductName(index)}
                >
                  {fetchingIndex === index ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  가져오기
                </Button>
              </div>
              <Input
                placeholder="상품명"
                value={item.productName}
                onChange={(e) => updateItem(index, "productName", e.target.value)}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={addItem}
          >
            <Plus className="h-4 w-4" />
            상품 추가
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">신청자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Select onValueChange={(value) => setValue("department", value, { shouldValidate: true })}>
                <SelectTrigger id="department">
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
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department.message}</p>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="홍길동"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">요청사항 (선택)</Label>
            <Textarea
              id="note"
              placeholder="기타 요청사항을 입력해주세요."
              {...register("note")}
              className="min-h-[60px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            신청 중...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {validLinkCount > 0 ? `${validLinkCount}건 신청하기` : "신청하기"}
          </>
        )}
      </Button>
    </div>
  );
}
