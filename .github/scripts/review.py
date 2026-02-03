#!/usr/bin/env python3
import os
import json
import subprocess
import sys

def main():
    diff = os.environ['DIFF']
    api_key = os.environ['ANTHROPIC_API_KEY']
    pr_number = os.environ['PR_NUMBER']
    pr_title = os.environ.get('PR_TITLE', '')
    pr_author = os.environ.get('PR_AUTHOR', '')
    repo = os.environ.get('REPO', '')

    if pr_title and pr_author and repo:
        prompt = f"""당신은 코드 리뷰 전문가입니다. 아래 PR을 검토해주세요.

## PR 정보
- 제목: {pr_title}
- 작성자: {pr_author}
- 레포: {repo}

## 변경사항
```diff
{diff}
```

## 리뷰 기준 (CLAUDE.md 참고)
- [Critical] 버그, 보안 취약점, 타입 안정성 문제
- [Warning] 아키텍처 위반, 성능 이슈, 에러 핸들링 누락
- [Suggestion] 코드 개선 제안

## 출력 형식
```markdown
## 🤖 Claude Code Review

### 📊 Summary
(2-3줄 요약)

### 🔍 Issues Found

#### 🔴 Critical
- 파일명:줄번호 - 이슈 설명

#### 🟡 Warning
- 파일명:줄번호 - 이슈 설명

#### 💡 Suggestion
- 파일명:줄번호 - 제안

### ✅ Good Points
- 잘된 점

### 📝 Overall
Status: [✅ Approved | 🔴 Changes Requested]
```"""
    else:
        prompt = f"""새 커밋이 푸시되었습니다. 증분 리뷰를 수행하세요.

## 변경사항
```diff
{diff}
```

이번 커밋에서 새로 추가된 이슈만 리뷰하세요.

## 출력 형식
```markdown
## 🔄 Incremental Review

### New Issues
- 🔴 [Critical] 이슈
- 🟡 [Warning] 이슈

### Status: [✅ Approved | 🔴 Changes Requested]
```"""

    payload = {
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 16000,
        "messages": [{"role": "user", "content": prompt}]
    }

    result = subprocess.run([
        'curl', '-s', 'https://api.anthropic.com/v1/messages',
        '-H', 'Content-Type: application/json',
        '-H', f'x-api-key: {api_key}',
        '-H', 'anthropic-version: 2023-06-01',
        '-d', json.dumps(payload)
    ], capture_output=True, text=True)

    try:
        response = json.loads(result.stdout)
        review = response['content'][0]['text']
        subprocess.run(['gh', 'pr', 'comment', pr_number, '--body', review], check=True)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        print(f"Response: {result.stdout}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
