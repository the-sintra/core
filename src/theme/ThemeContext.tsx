import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeMode } from './types';
import { lightTheme, darkTheme } from './themes';

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
 * function App() {
 *   return (
 *     <ThemeProvider initialTheme="dark">
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  
  const theme = themeMode === 'light' ? lightTheme : darkTheme;
  
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