"use client";

import { useState } from "react";
import { SnackCard } from "./snack-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Coffee, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const snackItems = [
  { id: "chips", name: "감자칩", description: "바삭바삭한 오리지널 감자칩", icon: "🥔" },
  { id: "chocolate", name: "초콜릿", description: "달콤한 밀크 초콜릿 바", icon: "🍫" },
  { id: "nuts", name: "견과류 믹스", description: "아몬드, 호두, 캐슈넛 믹스", icon: "🥜" },
  { id: "cookies", name: "쿠키", description: "버터 풍미 가득 쿠키", icon: "🍪" },
  { id: "fruit", name: "건과일", description: "망고, 바나나, 사과 건조칩", icon: "🍎" },
  { id: "yogurt", name: "요거트", description: "그릭 요거트 (딸기맛)", icon: "🥛" },
];

const breakfastItems = [
  { id: "sandwich", name: "샌드위치", description: "신선한 야채와 계란 샌드위치", icon: "🥪" },
  { id: "rice", name: "주먹밥", description: "참치마요, 불고기 주먹밥", icon: "🍙" },
  { id: "salad", name: "샐러드", description: "닭가슴살 그린 샐러드", icon: "🥗" },
  { id: "cereal", name: "시리얼", description: "통곡물 시리얼 + 우유", icon: "🥣" },
  { id: "toast", name: "토스트", description: "버터 토스트 + 잼", icon: "🍞" },
  { id: "juice", name: "주스", description: "오렌지 생과일 주스", icon: "🧃" },
];

interface SelectedItem {
  id: string;
  quantity: number;
}

interface OrderFormProps {
  type: "snack" | "breakfast";
  onBack: () => void;
}

export function OrderForm({ type, onBack }: OrderFormProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const items = type === "snack" ? snackItems : breakfastItems;
  const title = type === "snack" ? "간식 신청" : "조식 신청";
  const Icon = type === "snack" ? Cookie : Coffee;

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    if (!department) {
      toast({
        title: "부서를 선택해주세요",
        variant: "destructive",
      });
      return;
    }
    if (selectedItems.length === 0) {
      toast({
        title: "최소 1개 이상의 항목을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "신청이 완료되었습니다!",
    });

    // Reset and go back
    setSelectedItems([]);
    setName("");
    setDepartment("");
    setNote("");
    setIsSubmitting(false);
    onBack();
  };

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="grid gap-3">
        {items.map((item) => {
          const selected = selectedItems.find((s) => s.id === item.id);
          return (
            <SnackCard
              key={item.id}
              {...item}
              selected={!!selected}
              quantity={selected?.quantity ?? 1}
              onToggle={() => toggleItem(item.id)}
              onQuantityChange={(qty) => updateQuantity(item.id, qty)}
            />
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">신청자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">부서</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="부서 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strategy">전략기획실</SelectItem>
                <SelectItem value="dev">개발실</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">요청사항 (선택)</Label>
            <Textarea
              id="note"
              placeholder="기타 요청사항을 입력해주세요."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
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
            {totalItems > 0 ? `${totalItems}개 신청하기` : "신청하기"}
          </>
        )}
      </Button>
    </div>
  );
}
