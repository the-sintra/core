# Sintra Design System Core

Sintra 디자인 시스템의 핵심 토큰과 스타일 정의를 제공하는 라이브러리입니다.

## 📋 목차

- [설치](#설치)
- [사용법](#사용법)
- [디자인 토큰](#디자인-토큰)
- [개발](#개발)
- [빌드](#빌드)
- [기여하기](#기여하기)

## 🚀 설치

### NPM
```bash
npm install @the-sintra/core
```

### Yarn
```bash
yarn add @the-sintra/core
```

### PNPM
```bash
pnpm add @the-sintra/core
```

## 💡 사용법

### TypeScript/JavaScript에서 사용

```typescript
import { colors, spacing, breakpoints, radius } from '@the-sintra/core';

// 색상 토큰 사용
const primaryColor = colors.primary;
const backgroundColor = colors.background.default;

// 간격 토큰 사용
const padding = spacing.md;
const margin = spacing.lg;

// 브레이크포인트 사용
const mobileBreakpoint = breakpoints.mobile;
const desktopBreakpoint = breakpoints.desktop;

// 반지름 토큰 사용
const borderRadius = radius.md;
```

### CSS에서 사용

```css
/* CSS 변수로 토큰 사용 */
.component {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

@media (min-width: var(--breakpoint-tablet)) {
  .component {
    padding: var(--spacing-lg);
  }
}
```

## 🎨 디자인 토큰

### 색상 (Colors)
- **Primary**: 메인 브랜드 색상
- **Secondary**: 보조 색상
- **Background**: 배경 색상 팔레트
- **Text**: 텍스트 색상 팔레트
- **Border**: 테두리 색상
- **Status**: 상태별 색상 (success, warning, error, info)

### 간격 (Spacing)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### 브레이크포인트 (Breakpoints)
- **mobile**: 0px
- **tablet**: 768px
- **desktop**: 1024px
- **wide**: 1280px

### 반지름 (Radius)
- **none**: 0px
- **sm**: 2px
- **md**: 4px
- **lg**: 8px
- **xl**: 12px
- **full**: 9999px

## 🛠 개발

### 요구사항
- Node.js 16.x 이상
- NPM 7.x 이상

### 프로젝트 설정
```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 타입 체크
npm run type-check
```

### 프로젝트 구조
```
src/
├── constants/          # 디자인 토큰 정의
│   ├── color.ts        # 색상 토큰
│   ├── spacing.ts      # 간격 토큰
│   ├── breakpoint.ts   # 브레이크포인트 토큰
│   ├── radius.ts       # 반지름 토큰
│   └── index.ts        # 통합 export
├── styles/             # 기본 스타일
│   └── base.css        # 기본 CSS 스타일
├── token/              # 토큰 정의 파일
│   └── token.json      # JSON 형태의 토큰 정의
└── index.ts            # 메인 export 파일
```

## 🔧 빌드

### 라이브러리 빌드
```bash
npm run build
```

### 토큰 생성
```bash
npm run generate-tokens
```

빌드 결과물은 `dist/` 폴더에 생성됩니다:
- `dist/index.js` - CommonJS 모듈
- `dist/index.esm.js` - ES 모듈
- `dist/index.d.ts` - TypeScript 타입 정의

## 📚 API 문서

### 색상 토큰
```typescript
interface Colors {
  primary: string;
  secondary: string;
  background: {
    default: string;
    subtle: string;
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  // ... 기타 색상 정의
}
```

### 간격 토큰
```typescript
interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

### 개발 가이드라인
- 새로운 토큰을 추가할 때는 일관된 네이밍 규칙을 따라주세요
- 변경사항에 대한 테스트를 작성해주세요
- 커밋 메시지는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따라주세요

## 📄 라이선스

MIT 라이선스에 따라 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

💡 **팁**: 이 라이브러리는 Sintra 디자인 시스템의 기초가 되는 토큰들을 제공합니다. 실제 UI 컴포넌트가 필요하다면 `@the-sintra/react` or `@the-sintra/react-native` 패키지를 함께 사용하세요. 