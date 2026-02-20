"use client";

import { useState } from "react";
import { Cookie, Coffee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/order-form";
import { Toaster } from "@/components/ui/toaster";

type OrderType = "snack" | "breakfast" | null;

export default function Home() {
  const [orderType, setOrderType] = useState<OrderType>(null);

  if (orderType) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setOrderType(null)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
          <OrderForm type={orderType} onBack={() => setOrderType(null)} />
        </div>
        <Toaster />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-foreground">DoubleT</h1>
        <p className="mt-1 text-muted-foreground">스낵바</p>
      </div>

      <div className="flex w-full max-w-md gap-4">
        <Button
          size="lg"
          className="h-24 flex-1 gap-3 border-2 border-primary text-lg"
          onClick={() => setOrderType("snack")}
        >
          <Cookie className="h-6 w-6" />
          간식 신청
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-24 flex-1 gap-3 border-2 border-foreground/30 text-lg bg-transparent"
          onClick={() => setOrderType("breakfast")}
        >
          <Coffee className="h-6 w-6" />
          조식 신청
        </Button>
      </div>
      <Toaster />
    </main>
  );
}
