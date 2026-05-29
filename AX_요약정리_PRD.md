# AX 요약정리 — PRD (Product Requirements Document)

> 버전: 1.0 | 작성일: 2026-05-29

---

## 1. 제품 개요

| 항목 | 내용 |
|------|------|
| 제품명 | AX 요약정리 |
| 목적 | AI 관련 교육 내용을 주차별로 정리하여, 수업을 듣지 않은 사람도 학습 가능한 공개 웹 플랫폼 |
| 대상 | 누구나 (외부 공개, 로그인 불필요) |
| 기술 스택 | Next.js 15 (App Router), React 19, Supabase, Tailwind CSS, Vercel |

---

## 2. 배경 및 목표

- 주기적으로 진행되는 AI 교육(바이브코딩 중심)의 내용을 체계적으로 아카이빙
- 수업에 참석하지 못한 사람도 이론 + 실습 흐름을 따라올 수 있도록 구성
- 주차가 추가될수록 자동으로 콘텐츠가 확장되는 구조

---

## 3. 핵심 기능 요구사항

### 3.1 메인 페이지 (`/`)
- 전체 주차 카드 그리드 (주차번호, 제목, 날짜, 상태 배지)
- 최신 주차 히어로 배너 (가장 최근 수업 강조)
- 키워드 검색 (주차 제목 / 내용 전문 검색)
- 주차 상태: `공개` / `준비중` 구분 표시

### 3.2 주차별 상세 페이지 (`/week/[id]`)

3개 탭으로 구성:

| 탭 | 설명 |
|----|------|
| **이론** | 수업 내용 마크다운 정리, 코드 하이라이팅, 이미지 삽입 지원 |
| **실습** | 바이브코딩 예시 코드 + 설명, 결과 스크린샷, 단계별 흐름 |
| **자료** | PDF 다운로드, 노션 링크 등 외부 링크, 기타 첨부파일 |

- 이전 / 다음 주차 네비게이션
- 페이지 내 목차 (이론 탭 기준 h2/h3 자동 생성)
- 복사 가능한 코드 블록 (Copy 버튼)

### 3.3 관리자 페이지 (`/admin`)
- Supabase Auth 이메일 로그인 (관리자 1인 이상)
- 주차 생성 / 수정 / 삭제
- 탭별 마크다운 에디터 (미리보기 지원)
- 파일 업로드 (PDF → Supabase Storage)
- 외부 링크 추가 (노션, 유튜브 등)
- 주차 상태 토글 (준비중 ↔ 공개)

---

## 4. 데이터 모델 (Supabase)

```sql
-- 주차 테이블
weeks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number  int UNIQUE NOT NULL,
  title        text NOT NULL,
  description  text,
  date         date,
  status       text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_at   timestamptz DEFAULT now()
)

-- 콘텐츠 탭 테이블 (이론 / 실습)
contents (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id    uuid REFERENCES weeks(id) ON DELETE CASCADE,
  type       text CHECK (type IN ('theory', 'practice')),
  body       text,   -- 마크다운
  created_at timestamptz DEFAULT now()
)

-- 자료 테이블 (파일 + 외부 링크 통합)
materials (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id      uuid REFERENCES weeks(id) ON DELETE CASCADE,
  label        text NOT NULL,       -- 표시 이름
  type         text CHECK (type IN ('file', 'link')),
  url          text NOT NULL,       -- Storage URL 또는 외부 URL
  file_size    bigint,              -- 파일일 경우만
  order        int DEFAULT 0,
  created_at   timestamptz DEFAULT now()
)
```

**Row Level Security (RLS)**
- `weeks`, `contents`, `materials` 모두 `status = 'published'`인 경우 전체 공개 (anon 읽기 허용)
- 쓰기/수정/삭제는 인증된 관리자만 허용

---

## 5. UI/UX 방향

### 디자인 원칙
- **심플 & 가독성 우선**: 화이트 베이스, 불필요한 장식 제거
- **콘텐츠 중심 레이아웃**: 여백 충분히, 텍스트 line-height 넉넉하게
- **포인트 컬러**: 단색 1가지 (예: 인디고 또는 슬레이트 계열)

### 컴포넌트
| 컴포넌트 | 설명 |
|---------|------|
| WeekCard | 메인 페이지 카드, 호버 시 subtle 애니메이션 |
| TabPanel | 이론/실습/자료 탭 전환 |
| MarkdownRenderer | 코드 하이라이팅 + 이미지 + 목차 지원 |
| CodeBlock | 복사 버튼 포함 |
| MaterialItem | 파일 다운로드 또는 외부 링크 아이콘 구분 |

### 반응형
- 모바일 (< 768px): 1열 카드, 탭 스크롤
- 태블릿 (768~1024px): 2열 카드
- 데스크탑 (> 1024px): 3열 카드, 목차 사이드바

---

## 6. 페이지 구조

```
/                        메인 (주차 목록)
/week/[id]               주차 상세 (이론/실습/자료 탭)
/admin                   관리자 로그인
/admin/dashboard         주차 목록 관리
/admin/week/new          주차 생성
/admin/week/[id]/edit    주차 수정
```

---

## 7. 배포 환경

| 항목 | 내용 |
|------|------|
| 호스팅 | Vercel (GitHub main 브랜치 자동 배포) |
| DB / Storage | Supabase |
| 렌더링 전략 | 공개 페이지: ISR (revalidate 60s) / 관리자: CSR |
| 환경변수 | `NEXT_PUBLIC_SUPABASE_URL` `NEXT_PUBLIC_SUPABASE_ANON_KEY` `SUPABASE_SERVICE_ROLE_KEY` |

---

## 8. 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 성능 | 메인/상세 페이지 LCP 3초 이내 |
| SEO | 주차별 메타태그, OG 이미지 자동 생성 |
| 접근성 | 키보드 네비게이션, 색 대비 WCAG AA |
| 확장성 | 주차 수 제한 없이 추가 가능 |

---

## 9. 개발 우선순위 (Phase)

| Phase | 범위 |
|-------|------|
| **Phase 1** | DB 설계, 메인 페이지, 주차 상세 (3탭), 관리자 CRUD |
| **Phase 2** | 파일 업로드, 외부 링크 관리, 검색 기능 |
| **Phase 3** | SEO 최적화, OG 이미지, 목차 사이드바, 다크모드 |

---

## 10. 미결 사항 (추후 결정)

- 도메인 직접 구매 여부
- 다크모드 지원 여부
- 댓글/반응 기능 추가 여부 (학습자 피드백용)
