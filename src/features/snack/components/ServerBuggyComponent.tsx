// ✅ Fixed: 'use client' 지시어 추가
'use client'

import { useState } from 'react'

export default function ServerBuggyComponent() {
  // ✅ Fixed: 이제 Client Component이므로 브라우저 API 사용 가능
  const userAgent = window.navigator.userAgent

  // ✅ Fixed: Client Component에서 localStorage 정상 사용 가능
  const savedData = localStorage.getItem('snackData')

  // 🟡 Warning: 하드코딩된 API 키 (여전히 문제)
  const API_KEY = 'sk-1234567890abcdef'

  // ✅ Fixed: Client Component에서 useState 정상 사용 가능
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Server Buggy Component</h1>
      <p>User Agent: {userAgent}</p>
      <p>Saved Data: {savedData}</p>
    </div>
  )
}
