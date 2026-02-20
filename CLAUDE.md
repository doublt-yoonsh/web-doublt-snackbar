# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commit Rules

**절대로 git commit 시 `Co-Authored-By`를 추가하지 마세요. 커밋은 사용자만의 것입니다.**

## Project Overview

DoubleT 스낵바 신청 서비스 — 회사 스낵바 간식 및 조식 신청 웹 애플리케이션.

## Commands

```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint (next lint)
npm run type-check   # TypeScript 타입 체크 (tsc --noEmit)
```

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- Tailwind CSS 4 (`@import 'tailwindcss'` + `@config` syntax, PostCSS via `@tailwindcss/postcss`)
- Radix UI / shadcn/ui for components (components.json 미설정 — 수동 추가 방식)
- React Hook Form + Zod for form validation
- Lucide React for icons, Sonner for toast notifications
- next-themes for dark mode

## Architecture

Feature-based architecture. Path aliases defined in `tsconfig.json`:
- `@/*` → `src/*`
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`

```
src/
├── app/              # Next.js App Router — 라우팅과 레이아웃만
├── features/         # Feature별 모듈 (snack/, breakfast/, order/)
│   └── <feature>/
│       ├── components/   # Feature 전용 컴포넌트
│       ├── hooks/        # Feature 전용 훅 (비즈니스 로직)
│       └── types/        # Feature 전용 타입
└── shared/           # 프로젝트 전체 공유
    ├── components/ui/    # shadcn/ui 컴포넌트
    ├── lib/              # 유틸리티 (cn() 등)
    ├── types/            # 공통 타입 (OrderType, Department, MenuItem 등)
    └── constants/        # 상수 (DEPARTMENTS, SNACK_ITEMS, BREAKFAST_ITEMS)
```

**핵심 규칙:**
- Feature 전용 코드는 `features/<name>/`에, 공유 코드는 `shared/`에 배치
- 비즈니스 로직은 컴포넌트가 아닌 hooks로 분리
- 하드코딩된 문자열/숫자는 `shared/constants/`로 추출
- 컴포넌트는 기본적으로 Server Component; `'use client'`는 상태, 이벤트, 브라우저 API가 필요할 때만 추가

## Styling

테마는 `globals.css`에 HSL CSS 변수로 정의 (light/dark 모드 지원, class 전략). Tailwind에서 `bg-background`, `text-primary` 등으로 사용. 모든 컬러 토큰은 `tailwind.config.ts`에서 `hsl(var(--token))` 패턴으로 매핑. 다크모드는 `.dark` 클래스 기반 (`darkMode: ['class']`).

## Code Conventions

- Form 검증: 반드시 Zod 스키마 사용, `z.infer<typeof schema>`로 타입 추출
- `any` 타입 사용 금지; Props는 `interface` 또는 `type`으로 정의
- 비동기 작업은 try-catch로 감싸고 사용자에게 에러 메시지 표시
- 조건부 클래스 병합은 `cn()` (`@/shared/lib/utils`) 사용
- shadcn/ui 컴포넌트 추가 시 `shared/components/ui/`에 배치

## Code Review Guidelines

코드 리뷰 시 아래 기준에 따라 검토합니다.

### 리뷰 중요도

**Critical (반드시 수정)**
- `any` 타입 사용, 타입 단언(`as`) 남용, Props 인터페이스 누락
- XSS 취약점, 민감 정보 하드코딩, 입력값 검증 누락 (Zod 미사용)
- useEffect 무한 루프, 메모리 누수, 비동기 에러 핸들링 누락, Key prop 문제
- Server Component에서 브라우저 API 사용, 불필요한 'use client'

**Warning (수정 권장)**
- 아키텍처 위반 (Feature/Shared 구분 오류, 순환 의존성, 비즈니스 로직 미분리)
- 성능 이슈 (불필요한 리렌더링, next/image 미사용)
- React/Next.js 안티패턴 (useState 초기값으로 props, 중첩 삼항 연산자)
- 에러 핸들링 누락, 하드코딩된 문자열/숫자, 중복 코드

**Suggestion (선택적 개선)**
- 변수/함수명 불명확, 커스텀 훅 분리 가능, CVA 분리 권장
- 반응형 디자인/다크모드 누락, 테스트 누락

### 리뷰 우선순위
1. 보안 취약점
2. 타입 안정성
3. 버그 가능성
4. 아키텍처 위반
5. 성능 최적화
6. 코드 가독성
