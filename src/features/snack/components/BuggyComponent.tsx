'use client'

import { useState, useEffect, useCallback } from 'react'
import DOMPurify from 'isomorphic-dompurify'

// ✅ Fixed: 명확한 타입 정의
interface SnackItem {
  id: string
  name: string
}

interface BuggyComponentProps {
  data: {
    userInput?: string
    items?: SnackItem[]
  }
}

// ✅ Fixed: 상수 분리
const DEPARTMENTS = ['개발팀', '디자인팀', '경영지원팀'] as const

// ✅ Fixed: 타입 가드 사용
function isValidData(input: unknown): input is { value: string } {
  return (
    typeof input === 'object' &&
    input !== null &&
    'value' in input &&
    typeof (input as { value: unknown }).value === 'string'
  )
}

// ✅ Fixed: Count 레벨 판단 함수
function getCountLevel(count: number): string {
  if (count > 10) return '많음'
  if (count > 5) return '중간'
  if (count > 0) return '적음'
  return '없음'
}

export default function BuggyComponent({ data }: BuggyComponentProps) {
  const [items, setItems] = useState<SnackItem[]>([])
  const [count, setCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fixed: useEffect 무한 루프 해결 + 에러 핸들링
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const res = await fetch('/api/snacks')
        if (!res.ok) throw new Error('Failed to fetch snacks')
        const data = await res.json()
        setItems(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching snacks:', err)
        setError('스낵 정보를 불러오는데 실패했습니다.')
      }
    }

    fetchSnacks()
  }, []) // ✅ Fixed: 의존성 배열에서 data 제거

  // ✅ Fixed: 타입 가드로 안전하게 처리
  const processData = (input: unknown): string | null => {
    if (isValidData(input)) {
      return input.value
    }
    return null
  }

  // ✅ Fixed: useCallback으로 최적화 + 중복 제거
  const handleClick = useCallback(() => {
    if (count > 0) {
      console.log('Count is positive')
    }

    setCount((prev) => prev + 1)
  }, [count])

  // ✅ Fixed: XSS 방어 - DOMPurify로 sanitize
  const sanitizedUserInput = data.userInput
    ? DOMPurify.sanitize(data.userInput)
    : ''

  return (
    <div>
      <h1>Snack Component</h1>

      {error && <div className="text-red-500">{error}</div>}

      {/* ✅ Fixed: XSS 방어 */}
      {data.userInput && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedUserInput }} />
      )}

      {/* ✅ Fixed: 고유한 ID를 key로 사용 */}
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}

      {/* ✅ Fixed: 함수를 직접 전달 */}
      <button onClick={handleClick}>Count: {count}</button>

      {/* ✅ Fixed: 함수로 가독성 개선 */}
      <div>{getCountLevel(count)}</div>
    </div>
  )
}
