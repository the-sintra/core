# @the-sintra/core

**React와 React Native를 위한 크로스 플랫폼 디자인 시스템**

라이트/다크 모드 지원, 브랜드 커스터마이징, TypeScript 완전 지원을 제공하는 현대적인 디자인 시스템입니다.

[![npm version](https://badge.fury.io/js/@the-sintra%2Fcore.svg)](https://badge.fury.io/js/@the-sintra%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 주요 특징

- 🌗 **다크/라이트 모드 지원** - 완전한 테마 시스템
- 🎨 **브랜드 커스터마이징** - Foundation 색상 Override 기능
- 📱 **크로스 플랫폼** - React와 React Native 동시 지원
- 🔧 **TypeScript 지원** - 완전한 타입 안전성
- 🚀 **Zero-config** - 즉시 사용 가능한 설정
- 📐 **체계적인 디자인 토큰** - 일관성 있는 디자인

## 📋 목차

- [설치](#-설치)
- [기본 사용법](#-기본-사용법)
- [테마 시스템](#-테마-시스템)
- [브랜드 커스터마이징](#-브랜드-커스터마이징)
- [디자인 토큰](#-디자인-토큰)
- [예제](#-예제)
- [개발](#-개발)

## 🚀 설치

```bash
npm install @the-sintra/core
```

```bash
yarn add @the-sintra/core
```

```bash
pnpm add @the-sintra/core
```

## 💡 기본 사용법

### 1. 테마 시스템 사용 (권장)

다크/라이트 모드와 브랜드 커스터마이징이 필요한 경우 테마 시스템을 사용하세요.

```tsx
import React from 'react';
import { ThemeProvider, useTheme } from '@the-sintra/core';

// 1. 앱 최상위에서 ThemeProvider로 감싸기
function App() {
  return (
    <ThemeProvider initialTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}

// 2. 컴포넌트에서 테마 사용
function MyComponent() {
  const { theme, themeMode, toggleTheme } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.color.background.default,
      color: theme.color.text.default,
      padding: theme.spacing.medium,
      borderRadius: theme.radius.medium
    }}>
      <h1>현재 테마: {themeMode}</h1>
      <button onClick={toggleTheme}>
        {themeMode === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
      </button>
    </div>
  );
}
```

### 2. 정적 토큰 사용 (추천 안함)

정적 값이 필요한 경우 직접 토큰을 import하여 사용할 수 있습니다. 하지만 이 방법은 **테마 색상 커스터마이징과 다크/라이트 모드 전환이 불가능**합니다. 브랜드에 맞는 색상 커스터마이징이 필요하다면 테마 시스템을 사용하세요. ([브랜드 커스터마이징](#-브랜드-커스터마이징) 섹션 참고)

```typescript
import { Color, Spacing, Radius } from '@the-sintra/core';

// React Native StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.background.default,
    padding: Spacing.medium,
    borderRadius: Radius.medium,
  },
  text: {
    color: Color.text.default,
    fontSize: 16,
  },
});

// CSS-in-JS (Emotion, Styled-components 등)
const StyledButton = styled.button`
  background-color: ${Color.background.brand.default};
  color: ${Color.text.white};
  padding: ${Spacing.small}px ${Spacing.medium}px;
  border-radius: ${Radius.medium}px;
  border: none;
`;
```

## 🌗 테마 시스템

### ThemeProvider 설정

```tsx
import { ThemeProvider } from '@the-sintra/core';

function App() {
  return (
    <ThemeProvider 
      initialTheme="dark" // 'light' | 'dark'
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### useTheme 훅 사용

```tsx
import { useTheme } from '@the-sintra/core';

function MyComponent() {
  const { 
    theme,        // 현재 테마 객체
    themeMode,    // 'light' | 'dark'
    setThemeMode, // 테마 설정 함수
    toggleTheme   // 테마 토글 함수
  } = useTheme();

  return (
    <div style={{ color: theme.color.text.default }}>
      테마: {themeMode}
    </div>
  );
}
```

## 🎨 브랜드 커스터마이징

Foundation 색상을 Override하여 브랜드에 맞는 커스텀 테마를 만들 수 있습니다.

```tsx
import { ThemeProvider, FoundationColorOverrides } from '@the-sintra/core';

function App() {
  // 브랜드 색상 커스터마이징
  const brandColors: FoundationColorOverrides = {
    brand: {
      50: '#FF6B6B', // 메인 브랜드 색상을 빨간색으로
      60: '#FF5252', // 진한 브랜드 색상
    },
    red: {
      50: '#4ECDC4', // 위험 색상을 청록색으로
    },
    neutral: {
      100: '#2C3E50', // 검은색을 네이비로
    }
  };

  return (
    <ThemeProvider 
      initialTheme="light"
      foundationColorOverrides={brandColors}
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### Foundation 색상 팔레트

각 색상은 0-100 단계로 구성되어 있습니다:

- **brand**: 브랜드 주색상
- **neutral**: 회색 계열 (텍스트, 배경)
- **red**: 빨간색 계열 (위험, 에러)
- **orange**: 주황색 계열 (경고)
- **green**: 초록색 계열 (성공)

```typescript
const customColors: FoundationColorOverrides = {
  brand: {
    0: '#FFFFFF',   // 가장 밝음
    50: '#297BFF',  // 메인 색상
    100: '#082546'  // 가장 어두움
  }
};
```

## 🎯 디자인 토큰

### 색상 시스템

#### Text Color
```typescript
theme.color.text.default    // 기본 텍스트
theme.color.text.primary    // 주요 텍스트
theme.color.text.subtle     // 부차적 텍스트
theme.color.text.secondary  // 보조 텍스트
theme.color.text.disabled   // 비활성 텍스트
theme.color.text.white      // 흰색 텍스트
theme.color.text.black      // 검은색 텍스트

// 브랜드 색상
theme.color.text.brand.default
theme.color.text.brand.subtle

// 상태 색상
theme.color.text.success.default
theme.color.text.warning.default
theme.color.text.danger.default
```

#### Background Color
```typescript
theme.color.background.default // 기본 배경
theme.color.background.subtle  // 부차적 배경

// 브랜드 배경
theme.color.background.brand.subtle   // 가장 연함
theme.color.background.brand.soft     // 연함
theme.color.background.brand.default  // 기본
theme.color.background.brand.heavy    // 진함

// 상태별 배경 (success, warning, danger도 동일한 구조)
theme.color.background.success.subtle
theme.color.background.success.soft
theme.color.background.success.default
theme.color.background.success.heavy
```

### Spacing

```typescript
theme.spacing.none      // 0px
theme.spacing.micro     // 4px
theme.spacing.narrow    // 6px
theme.spacing.small     // 8px
theme.spacing.moderate  // 12px
theme.spacing.medium    // 16px
theme.spacing.large     // 24px
theme.spacing.big       // 32px
theme.spacing.huge      // 40px
theme.spacing.massive   // 48px
theme.spacing.colossal  // 64px
```

### Radius

```typescript
theme.radius.none     // 0px
theme.radius.tiny     // 4px
theme.radius.small    // 8px
theme.radius.medium   // 12px
theme.radius.large    // 16px
theme.radius.big      // 20px
theme.radius.huge     // 32px
theme.radius.massive  // 64px
theme.radius.full     // 9999px (완전히 둥근 모서리)
```

### Breakpoint

```typescript
theme.breakpoint.mobile   // 402px
theme.breakpoint.desktop  // 1440px
```

## 📝 예제

### 버튼 컴포넌트

```tsx
import React from 'react';
import { useTheme } from '@the-sintra/core';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'primary', size = 'medium', children, onClick }: ButtonProps) {
  const { theme } = useTheme();
  
  const variants = {
    primary: {
      backgroundColor: theme.color.background.brand.default,
      color: theme.color.text.white,
    },
    secondary: {
      backgroundColor: theme.color.background.subtle,
      color: theme.color.text.default,
    },
    danger: {
      backgroundColor: theme.color.background.danger.default,
      color: theme.color.text.white,
    }
  };

  const sizes = {
    small: {
      padding: `${theme.spacing.narrow} ${theme.spacing.small}`,
      fontSize: '0.875rem',
    },
    medium: {
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      fontSize: '1rem',
    },
    large: {
      padding: `${theme.spacing.moderate} ${theme.spacing.large}`,
      fontSize: '1.125rem',
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...variants[variant],
        ...sizes[size],
        border: 'none',
        borderRadius: theme.radius.medium,
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </button>
  );
}
```

### 카드 컴포넌트

```tsx
import React from 'react';
import { useTheme } from '@the-sintra/core';

interface CardProps {
  title: string;
  children: React.ReactNode;
  elevated?: boolean;
}

function Card({ title, children, elevated = false }: CardProps) {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.color.background.default,
      border: `1px solid ${theme.color.line.subtle}`,
      borderRadius: theme.radius.large,
      padding: theme.spacing.large,
      boxShadow: elevated ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    }}>
      <h2 style={{
        color: theme.color.text.primary,
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: theme.spacing.medium,
        margin: 0,
      }}>
        {title}
      </h2>
      <div style={{ color: theme.color.text.default }}>
        {children}
      </div>
    </div>
  );
}
```

## 🛠 개발

### 요구사항
- Node.js 16.x 이상
- npm 7.x 이상

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/the-sintra/core.git
cd core

# 의존성 설치
npm install

# 빌드
npm run build

# 테스트
npm test

# 토큰 생성
npm run build:token
```

### 프로젝트 구조

```
src/
├── constants/          # 정적 토큰 export
│   ├── color.ts        # 색상 토큰
│   ├── spacing.ts      # 간격 토큰
│   ├── radius.ts       # 둥근 모서리 토큰
│   ├── breakpoint.ts   # 브레이크포인트 토큰
│   └── index.ts
├── theme/              # 테마 시스템
│   ├── ThemeContext.tsx # 테마 Context와 Provider
│   ├── themes.ts       # 라이트/다크 테마 정의
│   ├── types.ts        # 타입 정의
│   ├── utils.ts        # 유틸리티 함수
│   └── index.ts
├── token/              # 디자인 토큰 JSON
│   └── token.json      # 모든 디자인 토큰 정의
├── styles/             # 기본 스타일
│   └── base.css
└── index.ts            # 메인 export
```

## 📦 번들 크기

- **압축 전**: ~15KB
- **압축 후**: ~4KB
- **Tree-shaking 지원**: ✅

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

MIT License. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 📞 문의

- **Author**: Sungju Cho
- **Email**: hello@devfiro.com
- **GitHub**: [@iamfiro](https://github.com/iamfiro)
- **Issues**: [GitHub Issues](https://github.com/the-sintra/core/issues)

---

**@the-sintra/core**로 더 나은 사용자 경험을 만들어보세요! 🚀 