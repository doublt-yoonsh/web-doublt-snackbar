// ✅ Fixed: 'use client' 지시어 추가
'use client'

import { useState, useEffect } from 'react'

export default function ClientBrowserComponent() {
  const [userAgent, setUserAgent] = useState<string>('')
  const [savedData, setSavedData] = useState<string | null>(null)
  const [count, setCount] = useState(0)

  // ✅ Fixed: useEffect 내부에서 브라우저 API 사용
  useEffect(() => {
    setUserAgent(window.navigator.userAgent)
    setSavedData(localStorage.getItem('snackData'))
  }, [])

  // ✅ Fixed: 환경 변수 사용 (하드코딩 제거)
  const apiKey = process.env.NEXT_PUBLIC_API_KEY

  return (
    <div>
      <h1>Client Browser Component</h1>
      <p>User Agent: {userAgent}</p>
      <p>Saved Data: {savedData || '데이터 없음'}</p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {apiKey && <p className="text-xs text-gray-500">API 연결됨</p>}
    </div>
  )
}
