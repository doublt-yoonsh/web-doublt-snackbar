# Code Review Guidelines

## 리뷰 중요도

### 🔴 Critical (반드시 수정 필요)

**타입 안정성**
- `any` 타입 사용
- 타입 단언(`as`) 남용
- Props 인터페이스 누락
- Optional chaining 없이 nullable 값 접근

**보안**
- XSS 취약점 (dangerouslySetInnerHTML 사용)
- 민감 정보 하드코딩 (API 키, 비밀번호)
- 입력값 검증 누락 (Zod 스키마 미사용)

**버그 가능성**
- useEffect 무한 루프 (dependency array 오류)
- 메모리 누수 (cleanup 함수 누락)
- 비동기 처리 에러 핸들링 누락
- Key prop 누락 또는 index 사용

**Next.js 특수 규칙**
- Server Component에서 브라우저 API 사용 (window, localStorage 등)
- Client Component에 불필요한 'use client' 지시어
- Metadata API 오용

---

### 🟡 Warning (수정 권장)

**아키텍처 위반**
- Feature 전용 컴포넌트가 shared에 있음
- 공통 컴포넌트가 features에 있음
- 순환 의존성 발생
- 비즈니스 로직이 컴포넌트 내부에 있음 (hooks로 분리 필요)

**성능 이슈**
- 불필요한 리렌더링 (memo, useMemo, useCallback 미사용)
- 무거운 연산이 최적화되지 않음
- 이미지 최적화 미적용 (next/image 미사용)
- 큰 리스트에 가상화 미적용

**React/Next.js 안티패턴**
- useState 초기값으로 props 사용
- useEffect에서 state 직접 변경
- 중첩된 삼항 연산자 (가독성 저하)
- Server/Client Component 구분 불명확

**에러 핸들링**
- try-catch 블록 누락
- 에러 메시지 사용자에게 미표시
- 네트워크 요청 실패 처리 없음

**코드 품질**
- 하드코딩된 문자열/숫자 (constants로 분리 필요)
- 매직 넘버 사용
- 중복 코드
- 함수가 너무 길거나 복잡함 (SRP 위반)

---

### 💡 Suggestion (선택적 개선)

**가독성**
- 변수/함수명이 불명확
- 주석 부족 (복잡한 로직만)
- 일관성 없는 코드 스타일

**리팩토링**
- 커스텀 훅으로 분리 가능한 로직
- 유틸리티 함수로 추출 가능
- 컴포넌트 분리 (단일 책임 원칙)

**Tailwind CSS**
- 반복되는 클래스 조합 (CVA로 분리 권장)
- 반응형 디자인 누락
- 다크모드 고려 안 됨

**테스트**
- 단위 테스트 누락
- E2E 테스트 필요

---

## 리뷰 시 고려사항

### 1. 타입 정의
- 모든 함수에 명시적 반환 타입
- Props는 interface 또는 type으로 정의
- Zod 스키마와 타입 동기화 (`z.infer<typeof schema>`)

### 2. Server/Client Component 구분
```tsx
// ✅ Good: Server Component (기본)
export default function Page() {
  return <div>...</div>
}

// ✅ Good: Client Component (상태, 이벤트, 브라우저 API 필요 시)
'use client'
export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// ❌ Bad: 불필요한 'use client'
'use client'
export default function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>
}
```

### 3. Feature 구조 규칙
```
features/snack/
├── components/          # 간식 신청 전용 컴포넌트
│   ├── SnackForm.tsx
│   └── SnackItemCard.tsx
├── hooks/
│   └── useSnackOrder.ts # 간식 주문 로직
└── types/
    └── snack.ts         # 간식 관련 타입

shared/components/ui/    # 프로젝트 전체에서 재사용
├── Button.tsx
├── Dialog.tsx
└── Toast.tsx
```

### 4. 상수 관리
```tsx
// ✅ Good
import { DEPARTMENTS } from '@/shared/constants/departments'

// ❌ Bad
const departments = ['개발팀', '디자인팀', '경영지원팀']
```

### 5. Form 검증
```tsx
// ✅ Good: Zod 스키마 사용
const schema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  email: z.string().email('올바른 이메일을 입력하세요'),
})

// ❌ Bad: 검증 없음
const handleSubmit = (data: any) => { ... }
```

### 6. 에러 핸들링
```tsx
// ✅ Good
try {
  await submitOrder(data)
  toast.success('주문이 완료되었습니다')
} catch (error) {
  console.error(error)
  toast.error('주문 처리 중 오류가 발생했습니다')
}

// ❌ Bad
await submitOrder(data) // 에러 처리 없음
```

---

## 리뷰 출력 형식

```markdown
## 🤖 Claude Code Review

### 📊 Summary
[변경사항을 2-3줄로 요약]

### 🔍 Issues Found

#### 🔴 Critical
- `src/features/snack/components/SnackForm.tsx:45` - any 타입 사용으로 타입 안정성 저하
  ```tsx
  // 현재
  const data: any = ...

  // 수정 필요
  const data: SnackOrderData = ...
  ```

#### 🟡 Warning
- `src/app/page.tsx:12` - useEffect dependency array에 함수 누락으로 무한 루프 가능성

#### 💡 Suggestion
- `src/shared/components/ui/Button.tsx:8` - 버튼 크기 변형을 CVA로 관리하면 가독성 향상

### ✅ Good Points
- Feature-based 구조를 잘 따름
- Zod 스키마로 폼 검증 구현
- TypeScript 타입 정의가 명확함

### 📝 Overall
- **코드 품질**: 8/10
- **Status**: ✅ Approved | 🔴 Changes Requested
- **의견**: [종합 의견]
```

---

## 예외 케이스

### 리뷰 스킵 조건
- Draft PR
- `skip-review` 라벨이 붙은 PR
- 테스트 파일만 변경 (`*.test.ts`, `*.test.tsx`)
- 문서 파일만 변경 (`*.md`)
- 설정 파일만 변경 (단, `package.json`, `tsconfig.json`은 리뷰)

### 우선순위
1. 보안 취약점
2. 타입 안정성
3. 버그 가능성
4. 아키텍처 위반
5. 성능 최적화
6. 코드 가독성

---

## @claude 멘션 예시

```
@claude 이 PR 요약해줘
```

```
@claude 이 컴포넌트에 성능 이슈 있어?
```

```
@claude useEffect 의존성 배열 확인해줘
```

```
@claude 이 폼 검증 로직 리뷰해줘
```

```
@claude 모든 resolved 된 코멘트 정리해줘
```
