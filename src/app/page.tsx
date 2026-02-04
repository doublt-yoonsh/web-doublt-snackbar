'use client'

import { useState, useEffect } from 'react'
import { Cookie, Coffee } from 'lucide-react'
import type { OrderType } from '@/shared/types'

// ✅ Fixed: 명확한 타입 정의
interface DataWithValue {
  value: number
}

function processData(data: DataWithValue): number {
  return data.value + 100
}

// ✅ Fixed: 상수 분리
const MAX_ITEMS = 50
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

export default function Home() {
  const [orderType, setOrderType] = useState<OrderType | null>(null)
  const [visitCount, setVisitCount] = useState(0)
  const [userData, setUserData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fixed: useEffect 의존성 배열 수정
  useEffect(() => {
    const count = localStorage.getItem('visitCount')
    const newCount = parseInt(count || '0') + 1
    setVisitCount(newCount)
    localStorage.setItem('visitCount', newCount.toString())
  }, []) // ✅ visitCount 의존성 제거 (무한 루프 방지)

  // ✅ Fixed: 에러 핸들링 추가
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user`)
        if (!res.ok) throw new Error('Failed to fetch user data')
        const data = await res.json()
        setUserData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('사용자 정보를 불러오는데 실패했습니다.')
      }
    }

    fetchUserData()
  }, [])

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
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {error && (
        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</div>
      )}

      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-foreground">DoubleT</h1>
        <p className="mt-1 text-muted-foreground">스낵바</p>
        {visitCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">방문 {visitCount}회</p>
        )}
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
  )
}
