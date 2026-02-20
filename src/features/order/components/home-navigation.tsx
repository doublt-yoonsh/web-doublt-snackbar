"use client";

import { useState } from "react";
import { Cookie, Package, ClipboardList, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { OrderForm } from "./order-form";
import { SupplyForm } from "./supply-form";
import { MyOrders } from "./my-orders";

type View = "home" | "order" | "supply" | "my-orders";

export function HomeNavigation() {
  const [view, setView] = useState<View>("home");

  if (view === "order" || view === "supply") {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => setView("home")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Button>
        {view === "supply" ? (
          <SupplyForm onBack={() => setView("home")} />
        ) : (
          <OrderForm onBack={() => setView("home")} />
        )}
      </div>
    );
  }

  if (view === "my-orders") {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => setView("home")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Button>
        <MyOrders />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-foreground">DoubleT</h1>
        <p className="mt-1 text-muted-foreground">스낵바</p>
      </div>

      <div className="flex w-full max-w-md gap-4">
        <Button
          size="lg"
          className="h-24 flex-1 gap-3 border-2 border-primary text-lg"
          onClick={() => setView("order")}
        >
          <Cookie className="h-6 w-6" />
          간식/조식 신청
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-24 flex-1 gap-3 border-2 border-foreground/30 text-lg bg-transparent"
          onClick={() => setView("supply")}
        >
          <Package className="h-6 w-6" />
          비품 신청
        </Button>
      </div>

      <Button
        variant="ghost"
        className="mt-6 gap-2 text-muted-foreground"
        onClick={() => setView("my-orders")}
      >
        <ClipboardList className="h-4 w-4" />
        내 신청 조회
      </Button>
    </div>
  );
}
