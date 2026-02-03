'use client'

import { useState, useEffect } from 'react'

// 🔴 Critical: any 타입 사용
export default function BuggyComponent({ data }: any) {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)

  // 🔴 Critical: useEffect 무한 루프 (dependency array에 객체 포함)
  useEffect(() => {
    // 🔴 Critical: 에러 핸들링 없는 비동기 호출
    fetch('/api/snacks')
      .then(res => res.json())
      .then(data => setItems(data))
  }, [data]) // data가 객체라면 매 렌더링마다 새로운 참조

  // 🔴 Critical: 타입 단언 남용
  const processData = (input: unknown) => {
    const result = input as any
    return result.value
  }

  // 🟡 Warning: 불필요한 리렌더링 (memo, useCallback 미사용)
  const handleClick = () => {
    // 🟡 Warning: 하드코딩된 값
    const departments = ['개발팀', '디자인팀', '경영지원팀']

    // 🟡 Warning: 중복 코드
    if (count > 0) {
      console.log('Count is positive')
    }
    if (count > 0) {
      console.log('Count is positive')
    }

    setCount(count + 1)
  }

  // 🔴 Critical: key prop으로 index 사용
  return (
    <div>
      <h1>Buggy Component</h1>

      {/* 🔴 Critical: XSS 취약점 */}
      <div dangerouslySetInnerHTML={{ __html: data.userInput }} />

      {/* 🔴 Critical: key로 index 사용 */}
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}

      {/* 🟡 Warning: inline 함수로 불필요한 리렌더링 */}
      <button onClick={() => handleClick()}>
        Count: {count}
      </button>

      {/* 💡 Suggestion: 중첩된 삼항 연산자 (가독성 저하) */}
      <div>
        {count > 10 ? '많음' : count > 5 ? '중간' : count > 0 ? '적음' : '없음'}
      </div>
    </div>
  )
}
