# DoubleT 스낵바 신청 서비스

회사 스낵바 간식 및 조식 신청을 위한 웹 애플리케이션입니다.

## 프로젝트 구조

```
snackbar-refactored/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── features/                 # Feature 기반 모듈
│   │   ├── snack/               # 간식 신청 기능
│   │   ├── breakfast/           # 조식 신청 기능
│   │   └── order/               # 주문 공통 기능
│   └── shared/                   # 공유 리소스
│       ├── components/          # 공통 컴포넌트
│       │   └── ui/              # UI 컴포넌트 (shadcn/ui)
│       ├── lib/                 # 유틸리티 함수
│       ├── types/               # TypeScript 타입 정의
│       └── constants/           # 상수 정의
├── public/                       # 정적 파일
└── ...설정 파일들
```

## 기술 스택

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (shadcn/ui)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## 시작하기

### 설치

```bash
npm install
# or
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# or
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
# or
pnpm build
```

## 기능

- 간식 신청
- 조식 신청
- 아이템 선택 및 수량 조절
- 신청자 정보 입력
- 주문 제출

## 리팩토링 포인트

1. **Feature 기반 구조**: 기능별로 폴더를 분리하여 관리
2. **타입 안정성**: 모든 타입을 명확하게 정의
3. **상수 분리**: 메뉴, 부서 등 상수를 별도 파일로 관리
4. **재사용 가능한 컴포넌트**: UI 컴포넌트를 shared에서 관리
5. **확장 가능한 구조**: 새로운 기능 추가가 용이한 구조
