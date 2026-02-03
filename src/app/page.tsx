'use client';

import { useState } from 'react';
import { Cookie, Coffee } from 'lucide-react';
import type { OrderType } from '@/shared/types';

export default function Home() {
  const [orderType, setOrderType] = useState<OrderType | null>(null);

  if (orderType) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-6">
          <p className="text-center">Order form will go here for: {orderType}</p>
          <button
            onClick={() => setOrderType(null)}
            className="mt-4 rounded bg-primary px-4 py-2 text-white"
          >
            돌아가기
          </button>
        </div>
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
        <button
          className="flex h-24 flex-1 items-center justify-center gap-3 rounded-lg border-2 border-primary bg-primary text-lg text-primary-foreground hover:bg-primary/90"
          onClick={() => setOrderType('snack')}
        >
          <Cookie className="h-6 w-6" />
          간식 신청
        </button>

        <button
          className="flex h-24 flex-1 items-center justify-center gap-3 rounded-lg border-2 border-foreground/30 bg-transparent text-lg hover:bg-foreground/5"
          onClick={() => setOrderType('breakfast')}
        >
          <Coffee className="h-6 w-6" />
          조식 신청
        </button>
      </div>
    </main>
  );
}
