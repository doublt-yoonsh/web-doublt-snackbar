// 🔴 Critical: Server Component에서 브라우저 API 사용 ('use client' 없음)
export default function ServerBuggyComponent() {
  // 🔴 Critical: Server Component에서 window 객체 접근
  const userAgent = window.navigator.userAgent

  // 🔴 Critical: Server Component에서 localStorage 접근
  const savedData = localStorage.getItem('snackData')

  // 🟡 Warning: 하드코딩된 API 키
  const API_KEY = 'sk-1234567890abcdef'

  // 🔴 Critical: useState를 Server Component에서 사용
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Server Buggy Component</h1>
      <p>User Agent: {userAgent}</p>
      <p>Saved Data: {savedData}</p>
    </div>
  )
}
