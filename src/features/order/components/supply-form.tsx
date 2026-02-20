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
import { Package, Send, Loader2, Plus, X, Download } from "lucide-react";
import { toast } from "sonner";
import { DEPARTMENTS } from "@/shared/constants/departments";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const supplyFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  department: z.string().min(1, "부서를 선택해주세요"),
  note: z.string().min(1, "신청 사유를 입력해주세요"),
});

type SupplyFormValues = z.infer<typeof supplyFormSchema>;

interface SupplyItem {
  id: string;
  productName: string;
  quantity: number;
  link: string;
}

interface SupplyFormProps {
  onBack: () => void;
}

export function SupplyForm({ onBack }: SupplyFormProps) {
  const [items, setItems] = useState<SupplyItem[]>([
    { id: crypto.randomUUID(), productName: "", quantity: 1, link: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingIndex, setFetchingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SupplyFormValues>({
    resolver: zodResolver(supplyFormSchema),
    defaultValues: { name: "", department: "", note: "" },
  });

  const updateItem = (index: number, field: keyof Omit<SupplyItem, "id">, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), productName: "", quantity: 1, link: "" }]);
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

  const onSubmit = async (data: SupplyFormValues) => {
    const validItems = items.filter((item) => item.productName.trim());
    if (validItems.length === 0) {
      toast.error("최소 1개 이상의 비품명을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "supply",
          name: data.name.trim(),
          department: data.department,
          note: data.note.trim(),
          items: validItems.map((item) => ({
            productName: item.productName.trim(),
            quantity: item.quantity,
            link: item.link.trim() || null,
          })),
        }),
      });

      if (!res.ok) throw new Error("주문 실패");

      const productNames = validItems
        .map((item) => item.productName.trim())
        .join(", ");

      setItems([{ id: crypto.randomUUID(), productName: "", quantity: 1, link: "" }]);
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

  const validCount = items.filter((item) => item.productName.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">비품 신청</h2>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4" />
            비품 목록
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  비품 {index + 1}
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
              <div className="flex gap-2">
                <Input
                  placeholder="비품명"
                  value={item.productName}
                  onChange={(e) => updateItem(index, "productName", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={1}
                  placeholder="수량"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-[80px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="참고 링크 (선택)"
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
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={addItem}
          >
            <Plus className="h-4 w-4" />
            비품 추가
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
              <Label htmlFor="supply-department">부서</Label>
              <Select onValueChange={(value) => setValue("department", value, { shouldValidate: true })}>
                <SelectTrigger id="supply-department">
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
              <Label htmlFor="supply-name">이름</Label>
              <Input
                id="supply-name"
                placeholder="홍길동"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supply-note">신청 사유</Label>
            <Textarea
              id="supply-note"
              placeholder="비품 신청 사유를 입력해주세요."
              {...register("note")}
              className="min-h-[80px] resize-none"
            />
            {errors.note && (
              <p className="text-sm text-destructive">{errors.note.message}</p>
            )}
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
            {validCount > 0 ? `${validCount}건 신청하기` : "신청하기"}
          </>
        )}
      </Button>
    </div>
  );
}
