# Sintra Design System

React와 React Native에서 모두 사용 가능한 크로스 플랫폼 디자인 시스템입니다.

## 📋 목차

- [설치](#설치)
- [사용법](#사용법)
- [디자인 토큰](#디자인-토큰)
- [개발](#개발)
- [빌드](#빌드)
- [기여하기](#기여하기)

## 🚀 설치

```bash
npm install @sintra/core
```

## 💡 사용법

### 1. 기본 사용법 (정적 값)

```typescript
import { Color, Spacing, Radius } from '@sintra/core';

// React Native
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.background.default, // '#FFFFFF'
    padding: Spacing.medium, // 16
    borderRadius: Radius.small, // 8
  },
  text: {
    color: Color.text.primary, // '#0D0E0E'
  },
});

// 웹 (CSS-in-JS)
const styles = {
  container: {
    backgroundColor: Color.background.brand.default, // '#297BFF'
    color: Color.text.white, // '#FFFFFF'
  },
};
```

### 2. 테마 시스템 사용법 (다크/라이트 모드 지원)

```tsx
import React from 'react';
import { ThemeProvider, useTheme } from '@sintra/core';

// App.tsx - 최상위에서 ThemeProvider로 감싸기
function App() {
  return (
    <ThemeProvider initialTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}

// 컴포넌트에서 테마 사용
function MyComponent() {
  const { theme, themeMode, toggleTheme } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.color.background.default,
      padding: theme.spacing.medium 
    }}>
      <Text style={{ color: theme.color.text.primary }}>
        현재 테마: {themeMode}
      </Text>
      <Button title="테마 전환" onPress={toggleTheme} />
    </View>
  );
}
```

### 3. 색상 시스템

#### 텍스트 색상
- `Color.text.default` - 기본 텍스트
- `Color.text.primary` - 주요 텍스트  
- `Color.text.subtle` - 부차적 텍스트
- `Color.text.brand.default` - 브랜드 색상 텍스트
- `Color.text.success.default` - 성공 상태 텍스트
- `Color.text.warning.default` - 경고 상태 텍스트  
- `Color.text.danger.default` - 위험 상태 텍스트

#### 배경 색상
- `Color.background.default` - 기본 배경
- `Color.background.subtle` - 부차적 배경
- `Color.background.brand.default` - 브랜드 배경
- `Color.background.success.default` - 성공 상태 배경
- `Color.background.warning.default` - 경고 상태 배경
- `Color.background.danger.default` - 위험 상태 배경

### 4. 간격 시스템

```typescript
import { Spacing } from '@sintra/core';

const styles = {
  margin: Spacing.small,    // 8
  padding: Spacing.medium,  // 16
  gap: Spacing.large,       // 24
};
```

### 5. 둥근 모서리 시스템

```typescript
import { Radius } from '@sintra/core';

const styles = {
  borderRadius: Radius.small,  // 8
  borderRadius: Radius.medium, // 12
  borderRadius: Radius.full,   // 9999
};
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

## 마이그레이션

기존 CSS variable 기반 코드에서 새로운 테마 시스템으로 마이그레이션:

### Before (CSS Variables)
```css
.button {
  background-color: var(--st-color-semantic-background-brand-default);
  color: var(--st-color-semantic-text-white);
}
```

### After (테마 시스템)
```typescript
const styles = {
  button: {
    backgroundColor: Color.background.brand.default, // '#297BFF'
    color: Color.text.white, // '#FFFFFF'
  },
};
```

## 타입 지원

모든 색상, 간격, 반지름 값은 TypeScript로 완전히 타입이 지정되어 있어 자동완성과 타입 안전성을 제공합니다.

```typescript
import { Theme, ThemeMode } from '@sintra/core';

const customTheme: Theme = {
  // 완전한 타입 지원
};
``` 