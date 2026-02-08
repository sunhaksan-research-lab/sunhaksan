# 선학산연구소 (Sunhaksan Research Lab)

연구원들의 GitHub 프로젝트를 연동하고 연구 성과를 공유하는 포트폴리오 및 프로젝트 관리 플랫폼입니다.

## 🚀 주요 기능

- **GitHub OAuth 인증**: GitHub 계정으로 간편하게 로그인
- **레포지토리 연동**: GitHub 레포지토리를 연구소 프로젝트로 등록
- **접근 제어 (ACL)**:
  - `PUBLIC`: 모든 방문자가 볼 수 있음
  - `INTERNAL`: 로그인한 연구소 멤버만 볼 수 있음
  - `PRIVATE`: 작성자 본인만 볼 수 있음
- **멤버 포트폴리오**: 각 연구원의 개인 페이지 및 프로젝트 카드 뷰
- **대시보드**: 레포지토리 선택 및 프로젝트 관리

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Prisma ORM + SQLite
- **Auth**: Auth.js (NextAuth) + GitHub Provider
- **API**: Octokit (GitHub REST API)

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth
GITHUB_ID="your-github-oauth-app-client-id"
GITHUB_SECRET="your-github-oauth-app-client-secret"
```

#### GitHub OAuth App 생성 방법:

1. GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. **Application name**: Sunhaksan Research Lab
3. **Homepage URL**: `http://localhost:3000`
4. **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Client ID와 Client Secret을 `.env` 파일에 입력

#### NEXTAUTH_SECRET 생성:

```bash
openssl rand -base64 32
```

### 3. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

## 📁 프로젝트 구조

```
sunhaksan/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Auth.js 라우트
│   │   ├── repos/                # GitHub 레포지토리 조회
│   │   └── projects/             # 프로젝트 CRUD
│   ├── dashboard/                # 프로젝트 관리 대시보드
│   ├── members/                  # 연구원 목록 및 포트폴리오
│   ├── projects/                 # 프로젝트 목록
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 홈페이지
├── components/
│   ├── ui/                       # Shadcn UI 컴포넌트
│   ├── navigation.tsx            # 네비게이션 바
│   ├── project-card.tsx          # 프로젝트 카드
│   └── session-provider.tsx      # 세션 프로바이더
├── lib/
│   ├── auth.ts                   # Auth.js 설정
│   └── prisma.ts                 # Prisma 클라이언트
└── prisma/
    └── schema.prisma             # 데이터베이스 스키마
```

## 🗄️ 데이터베이스 스키마

### User
- GitHub 프로필 정보 (name, email, image, githubId, githubLogin, bio)
- 관계: Account, Session, Project

### Project
- GitHub 레포지토리 정보 (name, description, htmlUrl, language, topics)
- 통계 (stars, forks, watchers)
- 메타데이터 (visibility, featured, category, tags)
- 접근 제어: `PUBLIC` | `INTERNAL` | `PRIVATE`

## 🎨 주요 페이지

- `/` - 홈페이지 (주요 연구 성과 및 최신 프로젝트)
- `/projects` - 전체 프로젝트 목록
- `/members` - 연구원 목록
- `/members/[id]` - 개별 연구원 포트폴리오
- `/dashboard` - 프로젝트 관리 대시보드 (로그인 필요)

## 🔐 접근 제어

프로젝트의 `visibility` 속성에 따라 접근 권한이 결정됩니다:

- **PUBLIC**: 누구나 볼 수 있음
- **INTERNAL**: 로그인한 사용자만 볼 수 있음
- **PRIVATE**: 프로젝트 소유자만 볼 수 있음

## 📝 사용 방법

1. **로그인**: GitHub 계정으로 로그인
2. **대시보드 접속**: 상단 네비게이션에서 "대시보드" 클릭
3. **프로젝트 등록**: GitHub 레포지토리 목록에서 원하는 레포지토리 선택
4. **접근 권한 설정**: 공개/연구소/비공개 중 선택하여 등록
5. **프로젝트 관리**: 등록된 프로젝트는 자동으로 홈페이지와 프로젝트 목록에 표시

## 🚧 향후 개발 계획

- [ ] 프로젝트 수정/삭제 기능
- [ ] 프로젝트 카테고리 및 태그 관리
- [ ] 검색 및 필터링 기능
- [ ] 프로젝트 상세 페이지
- [ ] README 자동 렌더링
- [ ] 프로젝트 통계 대시보드

## 📄 라이선스

MIT License
