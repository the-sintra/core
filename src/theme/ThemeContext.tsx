import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Theme, ThemeMode, FoundationColorOverrides } from './types';
import { lightTheme, darkTheme } from './themes';
import { createCustomThemes } from './utils';

/**
 * 테마 컨텍스트의 값 타입 정의
 * 
 * @interface ThemeContextValue
 */
interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * 테마 프로바이더 컴포넌트의 Props 타입
 * 
 * @interface ThemeProviderProps
 */
interface ThemeProviderProps {
  children: ReactNode;
  /** 초기 테마 모드 (기본값: 'light') */
  initialTheme?: ThemeMode;
  /** Foundation 색상을 override할 색상 설정 */
  foundationColorOverrides?: FoundationColorOverrides;
}

/**
 * 테마 프로바이더 컴포넌트
 * 
 * @description 애플리케이션에 테마 기능을 제공하는 Context Provider입니다.
 * 테마 변경, 토글 등의 기능을 하위 컴포넌트들에게 제공합니다.
 * 
 * @param props - ThemeProviderProps
 * @returns 테마 컨텍스트가 적용된 Provider 컴포넌트
 * 
 * @example
 * ```tsx
 * import { ThemeProvider } from '@the-sintra/core';
 * 
 * // 기본 사용법
 * function App() {
 *   return (
 *     <ThemeProvider initialTheme="dark">
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * 
 * // Foundation 색상 override 사용법
 * function AppWithCustomColors() {
 *   const customFoundationColors = {
 *     brand: {
 *       50: '#ff6b6b', // 브랜드 메인 색상을 빨간색으로
 *       60: '#ff5252', // 브랜드 진한 색상도 함께 조정
 *     },
 *     red: {
 *       50: '#4ecdc4', // 위험 색상을 청록색으로 변경
 *     },
 *     neutral: {
 *       100: '#2c3e50', // 검은색을 네이비로 변경
 *     }
 *   };
 *   
 *   return (
 *     <ThemeProvider initialTheme="light" foundationColorOverrides={customFoundationColors}>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ 
  children, 
  initialTheme = 'light', 
  foundationColorOverrides 
}: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  
  // Foundation 색상 override를 적용한 최종 테마를 계산
  const theme = useMemo(() => {
    if (!foundationColorOverrides) {
      return themeMode === 'light' ? lightTheme : darkTheme;
    }
    
    // Foundation 색상 override를 적용한 커스텀 테마 생성
    const { lightTheme: customLightTheme, darkTheme: customDarkTheme } = createCustomThemes(foundationColorOverrides);
    return themeMode === 'light' ? customLightTheme : customDarkTheme;
  }, [themeMode, foundationColorOverrides]);
  
  /**
   * 현재 테마를 반대 테마로 토글합니다.
   * light → dark, dark → light
   */
  const toggleTheme = () => {
    setThemeMode((prev: ThemeMode) => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 테마 컨텍스트를 사용하는 커스텀 훅
 * 
 * @description ThemeProvider 내부에서 테마 관련 기능에 접근할 수 있는 훅입니다.
 * 
 * @returns 테마 컨텍스트 값 객체
 * @throws ThemeProvider 밖에서 사용될 경우 에러를 발생시킵니다.
 * 
 * @example
 * ```tsx
 * import { useTheme } from '@the-sintra/core';
 * 
 * function MyComponent() {
 *   const { theme, themeMode, toggleTheme } = useTheme();
 *   
 *   return (
 *     <div style={{ color: theme.color.text.default }}>
 *       현재 테마: {themeMode}
 *       <button onClick={toggleTheme}>테마 변경</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme은 ThemeProvider 내부에서 사용되어야 합니다');
  }
  return context;
} 