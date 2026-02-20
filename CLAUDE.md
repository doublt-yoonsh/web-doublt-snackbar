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
