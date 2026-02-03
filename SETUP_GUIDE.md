# Claude Code 자동 코드 리뷰 설정 가이드

## 개요

Claude MAX 플랜을 사용하여 GitHub Actions에서 자동 코드 리뷰를 설정하는 가이드입니다.

### 주요 기능

- ✅ PR 생성 시 자동 코드 리뷰
- ✅ 새 커밋 푸시 시 이전 리뷰 확인 및 자동 업데이트
- ✅ 중복 없이 새로운 이슈만 추가 리뷰
- ✅ `@claude` 멘션으로 수동 요청
- ✅ Next.js + TypeScript 프로젝트 최적화

### 예상 소요 시간

| 작업 | 예상 시간 |
|-----|----------|
| 초기 리뷰 (PR 생성) | 2~3분 |
| 증분 리뷰 (새 커밋) | 2~4분 |
| @claude 멘션 응답 | 1~2분 |

---

## 사전 요구사항

- Claude MAX 플랜 구독
- GitHub 레포지토리 Admin 권한
- Node.js 18+ (Claude Code CLI 설치용)

---

## 1단계: Claude Code CLI 설치

```bash
npm install -g @anthropic-ai/claude-code
```

설치 확인:

```bash
claude --version
```

---

## 2단계: OAuth 토큰 생성

MAX 플랜 인증을 위한 토큰을 생성합니다.

```bash
claude setup-token
```

생성된 토큰을 안전한 곳에 복사해둡니다.

> ⚠️ 이 토큰은 절대 공개 레포지토리에 커밋하지 마세요!

---

## 3단계: GitHub Secret 설정

### 방법 A: 자동 설정 (권장)

Claude Code 터미널에서:

```bash
claude
# Claude Code 진입 후
/install-github-app
```

안내에 따라 진행하면 GitHub App 설치와 Secrets 설정이 자동으로 완료됩니다.

### 방법 B: 수동 설정

1. GitHub 레포지토리 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 아래 Secret 추가:

| Name | Value |
|------|-------|
| `CLAUDE_CODE_OAUTH_TOKEN` | 2단계에서 생성한 토큰 |

---

## 4단계: 워크플로우 파일 확인

이미 생성된 파일들을 확인하세요:

```
.github/workflows/claude-review.yml  # GitHub Actions 워크플로우
CLAUDE.md                            # 코드 리뷰 가이드라인
```

### 워크플로우 구조

```yaml
# PR 생성 시 → initial-review (전체 리뷰)
# 새 커밋 푸시 → incremental-review (증분 리뷰 + auto-resolve)
# @claude 멘션 → mention-response (맞춤 응답)
```

---

## 5단계: 테스트

### 1. 테스트 PR 생성

```bash
git checkout -b test/claude-review
echo "// Test comment" >> src/app/page.tsx
git add .
git commit -m "test: Claude 리뷰 테스트"
git push origin test/claude-review
```

GitHub에서 PR을 생성하고 2-3분 대기하면 자동 리뷰 코멘트가 달립니다.

### 2. @claude 멘션 테스트

PR 코멘트에서:

```
@claude 이 변경사항 요약해줘
```

1-2분 내로 응답이 달립니다.

### 3. 증분 리뷰 테스트

```bash
# 추가 변경
echo "// Another change" >> src/app/page.tsx
git add .
git commit -m "test: 증분 리뷰 테스트"
git push
```

이전 리뷰 코멘트 확인 후 새로운 변경사항만 리뷰합니다.

---

## 사용 예시

### PR 생성 시 자동 리뷰

```markdown
## 🤖 Claude Code Review

### 📊 Summary
간식 신청 폼에 Zod 검증 로직을 추가하는 PR입니다.

### 🔍 Issues Found

#### 🔴 Critical
- `src/features/snack/components/SnackForm.tsx:45`
  any 타입 사용으로 타입 안정성 저하

#### 🟡 Warning
- `src/app/page.tsx:12`
  useEffect dependency array에 함수 누락

### ✅ Good Points
- Zod 스키마로 폼 검증 구현
- Feature-based 구조 준수

### 📝 Overall
Status: 🔴 Changes Requested
```

### @claude 멘션 예시

**요청:**
```
@claude 이 컴포넌트 성능 최적화 방법 알려줘
```

**응답:**
```markdown
이 컴포넌트는 다음 방법으로 최적화할 수 있습니다:

1. **useMemo로 비용 높은 연산 캐싱**
2. **useCallback으로 함수 메모이제이션**
3. **React.memo로 불필요한 리렌더링 방지**

코드 예시를 작성해드릴까요?
```

---

## 고급 설정

### Draft PR 제외

`.github/workflows/claude-review.yml`:

```yaml
jobs:
  initial-review:
    if: |
      github.event_name == 'pull_request' &&
      github.event.action == 'opened' &&
      github.event.pull_request.draft == false
```

### 특정 파일만 리뷰

```yaml
on:
  pull_request:
    paths:
      - 'src/**/*.{ts,tsx}'
      - '!src/**/*.test.{ts,tsx}'
```

### 라벨로 리뷰 스킵

PR에 `skip-review` 라벨을 추가하면 리뷰를 건너뜁니다.

```yaml
jobs:
  initial-review:
    if: |
      !contains(github.event.pull_request.labels.*.name, 'skip-review')
```

### 타임아웃 조정

리뷰가 복잡한 경우:

```yaml
jobs:
  initial-review:
    timeout-minutes: 15  # 기본 10분에서 15분으로 증가
```

---

## 문제 해결

### 워크플로우가 실행 안 됨

1. **Actions 활성화 확인**
   - GitHub 레포 → Actions 탭 → 워크플로우 활성화

2. **default 브랜치에 워크플로우 파일 있는지 확인**
   ```bash
   git checkout main
   git pull
   ls -la .github/workflows/
   ```

3. **Secret 설정 확인**
   - Settings → Secrets → `CLAUDE_CODE_OAUTH_TOKEN` 존재 확인

### 토큰 만료

```bash
claude setup-token
# 새 토큰 생성 후 GitHub Secret 업데이트
```

### 권한 오류

`.github/workflows/claude-review.yml`에서 권한 확인:

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
  id-token: write  # 필수!
```

### @claude 멘션이 응답 안 함

- 철자 확인: `@claude` (대소문자 구분 없음)
- PR 코멘트 또는 리뷰 코멘트에서만 작동
- Issue 코멘트에서도 작동

### 리뷰가 너무 느림

- 변경 파일이 많으면 시간이 오래 걸립니다 (최대 10분)
- 타임아웃 설정을 15분으로 늘려보세요
- 대용량 PR은 분할하는 것을 권장합니다

---

## 비용 및 제한사항

### Claude MAX 플랜 제한

- **사용량 제한**: ~75-150 프롬프트/5시간
- **단일 사용자 제한**: 개인용 플랜입니다
- **팀 사용**: API 키 기반 설정 권장

### 예상 사용량

| 작업 | 프롬프트 소비 |
|-----|------------|
| 소규모 PR (5개 파일 미만) | 1-2 프롬프트 |
| 중규모 PR (10개 파일) | 3-5 프롬프트 |
| 대규모 PR (20개 파일 이상) | 8-12 프롬프트 |

하루 5-10개 PR 리뷰 시 제한 내 사용 가능합니다.

---

## 다음 단계

1. ✅ 설정 완료 확인
2. 📝 `CLAUDE.md`를 프로젝트에 맞게 커스터마이징
3. 🧪 테스트 PR로 동작 확인
4. 🚀 팀에 공유 및 사용 시작

---

## 참고 자료

- [Claude Code 공식 문서](https://docs.anthropic.com/claude-code)
- [GitHub Actions 문서](https://docs.github.com/actions)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
