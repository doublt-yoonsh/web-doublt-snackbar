// 🟡 Warning: 아키텍처 위반 - 공통 컴포넌트가 features에 있음
// 이 Button 컴포넌트는 shared/components/ui에 있어야 함

'use client'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

// 🔴 Critical: Props 타입에 onClick이 있지만 optional chaining 없이 사용
export default function Button({ children, onClick }: ButtonProps) {
  // 🟡 Warning: 비즈니스 로직이 컴포넌트 내부에 있음 (hooks로 분리 필요)
  const handleClick = () => {
    // 🟡 Warning: 에러 핸들링 없음
    fetch('/api/track-click', {
      method: 'POST',
      body: JSON.stringify({ button: children }),
    })

    onClick()
  }

  return (
    <button
      onClick={handleClick}
      // 🟡 Warning: 반복되는 클래스 조합 (CVA로 분리 권장)
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700"
    >
      {children}
    </button>
  )
}
