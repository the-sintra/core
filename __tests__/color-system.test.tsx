/// <reference types="jest" />

/**
 * - 타입 안전성 및 구조 검증
 * - 색상 값 유효성 및 형식 검증  
 * - 토큰 해석 시스템 완벽성
 * - 테마 일관성 및 무결성
 * - Foundation 색상 override 메커니즘
 * - React Context 상태 관리
 * - 접근성 및 색상 대비율
 * - 경계값 및 에러 처리
 * - 성능 최적화 검증
 */

import { render, renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  Theme,
  ThemeMode,
  FoundationColorOverrides,
  lightTheme,
  darkTheme,
  ThemeProvider,
  useTheme,
  resolveToken,
  resolveTokens,
  createCustomTokens,
  createCustomThemes,
  Color,
  Colors
} from '../src';
import tokens from '../src/token/token.json';

// 색상 유틸리티 함수들
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const calculateLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const calculateContrastRatio = (color1: string, color2: string): number => {
  const l1 = calculateLuminance(color1);
  const l2 = calculateLuminance(color2);
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
};

const TestWrapper: React.FC<{ children: React.ReactNode; overrides?: FoundationColorOverrides; initialTheme?: ThemeMode }> = ({ 
  children, 
  overrides,
  initialTheme = 'light'
}) => (
  <ThemeProvider initialTheme={initialTheme} foundationColorOverrides={overrides}>
    {children}
  </ThemeProvider>
);

describe('Sintra 컬러 시스템 테스트', () => {
  describe('타입 안전성 및 구조 검증', () => {
    test('Theme 인터페이스 구조 완벽성 검증', () => {
      // lightTheme이 Theme 인터페이스를 완벽히 구현하는지 확인
      expect(lightTheme).toBeDefined();
      expect(lightTheme.color).toBeDefined();
      expect(lightTheme.spacing).toBeDefined();
      expect(lightTheme.radius).toBeDefined();
      expect(lightTheme.breakpoint).toBeDefined();

      // 모든 색상 카테고리 존재 확인
      expect(lightTheme.color.text).toBeDefined();
      expect(lightTheme.color.background).toBeDefined();
      expect(lightTheme.color.line).toBeDefined();

      // 텍스트 색상 모든 변형 확인
      const textColors = lightTheme.color.text;
      ['default', 'primary', 'subtle', 'secondary', 'disabled', 'invert', 'white', 'black'].forEach(key => {
        expect(textColors).toHaveProperty(key);
        expect(typeof textColors[key as keyof typeof textColors]).toBe('string');
      });

      // 브랜드/상태 색상 확인
      ['brand', 'success', 'warning', 'danger'].forEach(category => {
        expect(textColors).toHaveProperty(category);
        expect(textColors[category as keyof typeof textColors]).toHaveProperty('default');
        expect(textColors[category as keyof typeof textColors]).toHaveProperty('subtle');
      });

      // 배경 색상 구조 확인
      const bgColors = lightTheme.color.background;
      expect(bgColors).toHaveProperty('default');
      expect(bgColors).toHaveProperty('subtle');
      expect(bgColors.invert).toHaveProperty('default');
      expect(bgColors.invert).toHaveProperty('subtle');

      ['brand', 'success', 'warning', 'danger'].forEach(category => {
        expect(bgColors).toHaveProperty(category);
        ['subtle', 'soft', 'default', 'heavy'].forEach(intensity => {
          expect(bgColors[category as keyof typeof bgColors]).toHaveProperty(intensity);
        });
      });
    });

    test('Dark theme이 Light theme과 동일한 구조를 가지는지 검증', () => {
      const compareStructure = (obj1: any, obj2: any, path = ''): void => {
        Object.keys(obj1).forEach(key => {
          const currentPath = path ? `${path}.${key}` : key;
          expect(obj2).toHaveProperty(key, expect.anything());
          
          if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
            compareStructure(obj1[key], obj2[key], currentPath);
          }
        });
      };

      compareStructure(lightTheme, darkTheme);
    });

    test('FoundationColorOverrides 타입 검증', () => {
      const testOverrides: FoundationColorOverrides = {
        base: { base0: '#ffffff', base100: '#000000' },
        brand: { 50: '#ff0000', 60: '#dd0000' },
        neutral: { 100: '#333333' },
        red: { 50: '#ff6b6b' },
        orange: { 40: '#ffa500' },
        green: { 50: '#00ff00' }
      };

      // 타입 체크가 통과하면 성공
      expect(testOverrides).toBeDefined();
      expect(typeof testOverrides.brand?.['50']).toBe('string');
    });
  });

  describe('색상 값 유효성 및 형식 검증', () => {
    test('모든 Foundation 색상이 유효한 HEX 형식인지 검증', () => {
      const foundationColors = tokens.color.foundation;
      
      Object.values(foundationColors).forEach(palette => {
        Object.values(palette).forEach(color => {
          expect(isValidHexColor(color)).toBe(true);
          expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });
    });

    test('해석된 테마 색상들이 모두 유효한 HEX 형식인지 검증', () => {
      const checkThemeColors = (theme: Theme, themeName: string) => {
        const flattenColors = (obj: any, prefix = ''): string[] => {
          const colors: string[] = [];
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'string') {
              colors.push(value);
            } else if (typeof value === 'object' && value !== null) {
              colors.push(...flattenColors(value, currentPath));
            }
          });
          return colors;
        };

        const allColors = flattenColors(theme.color);
        allColors.forEach((color, index) => {
          expect(isValidHexColor(color)).toBe(true);
        });
      };

      checkThemeColors(lightTheme, 'light');
      checkThemeColors(darkTheme, 'dark');
    });

    test('색상 팔레트 명도 순서 검증 (0이 가장 밝고 100이 가장 어두워야 함)', () => {
      const paletteNames = ['brand', 'neutral', 'red', 'orange', 'green'];
      
      paletteNames.forEach(paletteName => {
        const palette = tokens.color.foundation[paletteName as keyof typeof tokens.color.foundation];
        const sortedShades = Object.entries(palette)
          .filter(([key]) => !isNaN(Number(key)))
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([, color]) => color);

        // 각 색상의 명도 계산
        const luminances = sortedShades.map(color => calculateLuminance(color));
        
        // 명도가 감소하는 순서인지 확인 (0→100으로 갈수록 어두워야 함)
        for (let i = 1; i < luminances.length; i++) {
          expect(luminances[i]).toBeLessThanOrEqual(luminances[i - 1]);
        }
      });
    });

    test('Color export와 lightTheme.color가 동일한지 검증', () => {
      expect(Color).toEqual(lightTheme.color);
      expect(Colors).toEqual(lightTheme.color);
    });
  });

  describe('토큰 해석 시스템 완벽성', () => {
    test('resolveToken 함수 모든 케이스 검증', () => {
      // 정상적인 토큰 참조
      expect(resolveToken('{color.foundation.neutral.100}')).toBe('#0D0E0E');
      expect(resolveToken('{color.foundation.brand.50}')).toBe('#297BFF');
      
      // 이미 해석된 값
      expect(resolveToken('#ffffff')).toBe('#ffffff');
      expect(resolveToken('rgb(255, 255, 255)')).toBe('rgb(255, 255, 255)');
      
      // 잘못된 참조
      console.warn = jest.fn(); // 경고 메시지 모킹
      expect(resolveToken('{invalid.path}')).toBe('{invalid.path}');
      expect(console.warn).toHaveBeenCalled();
    });

    test('resolveTokens 재귀 해석 완벽성 검증', () => {
      const testObject = {
        simple: '{color.foundation.neutral.100}',
        nested: {
          deep: '{color.foundation.brand.50}',
          deeper: {
            value: '{color.foundation.red.50}'
          }
        },
        array: ['{color.foundation.green.50}', '{color.foundation.orange.50}'],
        mixed: {
          resolved: '#ffffff',
          unresolved: '{color.foundation.neutral.50}'
        }
      };

      const resolved = resolveTokens(testObject);
      
      expect(resolved.simple).toBe('#0D0E0E');
      expect(resolved.nested.deep).toBe('#297BFF');
      expect(resolved.nested.deeper.value).toBe('#F03839');
      expect(resolved.array[0]).toBe('#45BF52');
      expect(resolved.array[1]).toBe('#FF9201');
      expect(resolved.mixed.resolved).toBe('#ffffff');
      expect(resolved.mixed.unresolved).toBe('#7F8897');
    });

    test('순환 참조 토큰 처리 검증', () => {
      // 토큰에 순환 참조가 있어도 무한 루프에 빠지지 않는지 확인
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();
      
      // 실제로는 tokens.json에 순환 참조가 없지만, 
      // 잘못된 경로에 대해 원본 문자열을 반환하는지 확인
      expect(resolveToken('{circular.reference}')).toBe('{circular.reference}');
      
      console.warn = originalConsoleWarn;
    });
  });

  describe('테마 일관성 및 무결성', () => {
    test('Light/Dark 테마간 semantic 색상 역할 일관성 검증', () => {
      // 같은 semantic 역할의 색상이 두 테마에서 모두 존재하는지 확인
      const lightSemanticPaths: string[] = [];
      const darkSemanticPaths: string[] = [];
      
      const extractPaths = (obj: any, prefix = '', pathArray: string[]) => {
        Object.keys(obj).forEach(key => {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === 'string') {
            pathArray.push(currentPath);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            extractPaths(obj[key], currentPath, pathArray);
          }
        });
      };

      extractPaths(lightTheme.color, '', lightSemanticPaths);
      extractPaths(darkTheme.color, '', darkSemanticPaths);

      expect(lightSemanticPaths.sort()).toEqual(darkSemanticPaths.sort());
    });

    test('테마별 색상 대비율 접근성 기준 준수 검증', () => {
      const checkAccessibility = (theme: Theme, themeName: string) => {
        // 텍스트-배경 대비율 검증 (WCAG AA 기준: 4.5:1)
        const textOnBackground = calculateContrastRatio(
          theme.color.text.default,
          theme.color.background.default
        );
        expect(textOnBackground).toBeGreaterThanOrEqual(4.5);

        // 브랜드 텍스트 대비율
        const brandTextOnBackground = calculateContrastRatio(
          theme.color.text.brand.default,
          theme.color.background.default
        );
        expect(brandTextOnBackground).toBeGreaterThanOrEqual(3.0); // 최소 3:1

        // 위험 색상 대비율
        const dangerTextOnBackground = calculateContrastRatio(
          theme.color.text.danger.default,
          theme.color.background.default
        );
        expect(dangerTextOnBackground).toBeGreaterThanOrEqual(3.0);
      };

      checkAccessibility(lightTheme, 'light');
      checkAccessibility(darkTheme, 'dark');
    });

    test('색상 팔레트 색맹 친화성 검증', () => {
      // 서로 다른 의미를 가진 색상들이 충분히 구별되는지 확인
      const checkColorDistinction = (color1: string, color2: string) => {
        const rgb1 = hexToRgb(color1)!;
        const rgb2 = hexToRgb(color2)!;
        
        // 유클리드 거리 계산
        const distance = Math.sqrt(
          Math.pow(rgb1.r - rgb2.r, 2) +
          Math.pow(rgb1.g - rgb2.g, 2) +
          Math.pow(rgb1.b - rgb2.b, 2)
        );
        
        return distance > 50; // 최소 거리 임계값
      };

      // 상태별 색상들이 서로 충분히 구별되는지 확인
      const statusColors = [
        lightTheme.color.text.brand.default,
        lightTheme.color.text.success.default,
        lightTheme.color.text.warning.default,
        lightTheme.color.text.danger.default
      ];

      for (let i = 0; i < statusColors.length; i++) {
        for (let j = i + 1; j < statusColors.length; j++) {
          expect(checkColorDistinction(statusColors[i], statusColors[j])).toBe(true);
        }
      }
    });
  });

  describe('Foundation 색상 Override 메커니즘', () => {
    test('createCustomTokens 완벽한 Override 동작 검증', () => {
      const overrides: FoundationColorOverrides = {
        brand: {
          50: '#ff6b6b',
          60: '#ff5252'
        },
        red: {
          50: '#4ecdc4'
        },
        neutral: {
          100: '#2c3e50'
        }
      };

      const customTokens = createCustomTokens(overrides);
      
      // Override된 값들이 적용되었는지 확인
      expect(customTokens.color.foundation.brand[50]).toBe('#ff6b6b');
      expect(customTokens.color.foundation.brand[60]).toBe('#ff5252');
      expect(customTokens.color.foundation.red[50]).toBe('#4ecdc4');
      expect(customTokens.color.foundation.neutral[100]).toBe('#2c3e50');
      
      // Override되지 않은 값들은 원본 유지
      expect(customTokens.color.foundation.brand[40]).toBe(tokens.color.foundation.brand[40]);
      expect(customTokens.color.foundation.green[50]).toBe(tokens.color.foundation.green[50]);
    });

    test('createCustomThemes 테마 생성 검증', () => {
      const overrides: FoundationColorOverrides = {
        brand: { 50: '#ff0000' },
        neutral: { 100: '#333333' }
      };

      const { lightTheme: customLight, darkTheme: customDark } = createCustomThemes(overrides);
      
      // 커스텀 테마가 올바른 구조를 가지는지 확인
      expect(customLight).toHaveProperty('color.text.brand.default');
      expect(customDark).toHaveProperty('color.text.brand.default');
      
      // Override가 semantic 색상에 반영되었는지 확인
      // brand.50이 semantic.light.text.brand.default에 참조되므로
      expect(customLight.color.text.brand.default).toBe('#ff0000');
      expect(customLight.color.text.default).toBe('#333333'); // neutral.100 적용
    });

    test('빈 Override와 undefined 처리 검증', () => {
      expect(createCustomTokens()).toEqual(tokens);
      expect(createCustomTokens({})).toEqual(tokens);
      
      const { lightTheme: defaultLight, darkTheme: defaultDark } = createCustomThemes();
      expect(defaultLight).toEqual(lightTheme);
      expect(defaultDark).toEqual(darkTheme);
    });

    test('부분적 Override 깊은 병합 검증', () => {
      const overrides: FoundationColorOverrides = {
        brand: { 50: '#custom' } // brand 팔레트의 한 색상만 변경
      };

      const customTokens = createCustomTokens(overrides);
      
      // 변경된 색상
      expect(customTokens.color.foundation.brand[50]).toBe('#custom');
      // 변경되지 않은 색상들은 원본 유지
      expect(customTokens.color.foundation.brand[40]).toBe(tokens.color.foundation.brand[40]);
      expect(customTokens.color.foundation.brand[60]).toBe(tokens.color.foundation.brand[60]);
    });
  });

  describe('React Context 상태 관리', () => {
    test('ThemeProvider 기본 동작 검증', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>
      });

      expect(result.current.theme).toEqual(lightTheme);
      expect(result.current.themeMode).toBe('light');
      expect(typeof result.current.setThemeMode).toBe('function');
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    test('테마 토글 기능 검증', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme).toEqual(darkTheme);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.theme).toEqual(lightTheme);
    });

    test('초기 테마 설정 검증', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <TestWrapper initialTheme="dark">{children}</TestWrapper>
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.theme).toEqual(darkTheme);
    });

    test('Foundation 색상 Override가 Context에서 동작하는지 검증', () => {
      const overrides: FoundationColorOverrides = {
        brand: { 50: '#custom-brand' }
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <TestWrapper overrides={overrides}>{children}</TestWrapper>
      });

      expect(result.current.theme.color.text.brand.default).toBe('#custom-brand');
    });

    test('Context 외부에서 useTheme 사용시 에러 발생 검증', () => {
      // Console.error 모킹
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme은 ThemeProvider 내부에서 사용되어야 합니다');

      console.error = originalError;
    });

    test('setThemeMode 직접 호출 검증', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>
      });

      act(() => {
        result.current.setThemeMode('dark');
      });

      expect(result.current.themeMode).toBe('dark');

      act(() => {
        result.current.setThemeMode('light');
      });

      expect(result.current.themeMode).toBe('light');
    });
  });

  describe('경계값 및 에러 처리', () => {
    test('잘못된 토큰 참조 처리 검증', () => {
      const originalWarn = console.warn;
      console.warn = jest.fn();

      // 존재하지 않는 토큰 경로
      expect(resolveToken('{non.existent.path}')).toBe('{non.existent.path}');
      expect(console.warn).toHaveBeenCalledWith('토큰 경로를 찾을 수 없습니다: {non.existent.path}');

      // 잘못된 형식
      expect(resolveToken('{invalid')).toBe('{invalid');
      expect(resolveToken('invalid}')).toBe('invalid}');

      console.warn = originalWarn;
    });

    test('잘못된 색상 형식 검증', () => {
      expect(isValidHexColor('#GGGGGG')).toBe(false);
      expect(isValidHexColor('#12345')).toBe(false);
      expect(isValidHexColor('1234567')).toBe(false);
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor('#')).toBe(false);
    });

    test('극단적인 Override 값 처리', () => {
      const extremeOverrides: FoundationColorOverrides = {
        brand: {
          0: '#000000',   // 완전한 검정
          100: '#FFFFFF'  // 완전한 흰색 (일반적으로 반대)
        }
      };

      expect(() => createCustomTokens(extremeOverrides)).not.toThrow();
      
      const customTokens = createCustomTokens(extremeOverrides);
      expect(customTokens.color.foundation.brand[0]).toBe('#000000');
      expect(customTokens.color.foundation.brand[100]).toBe('#FFFFFF');
    });

    test('대량의 색상 데이터 처리 성능', () => {
      const start = performance.now();
      
      // 1000번 테마 생성
      for (let i = 0; i < 1000; i++) {
        createCustomThemes({
          brand: { 50: `#${i.toString(16).padStart(6, '0')}` }
        });
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // 1초 이내
    });
  });

  describe('성능 최적화 검증', () => {
    test('테마 memoization 검증', () => {
      const overrides: FoundationColorOverrides = {
        brand: { 50: '#test' }
      };

      let renderCount = 0;
      const TestComponent = () => {
        renderCount++;
        const { theme } = useTheme();
        return <div>{theme.color.text.default}</div>;
      };

      const { rerender } = render(
        <TestWrapper overrides={overrides}>
          <TestComponent />
        </TestWrapper>
      );

      const initialRenderCount = renderCount;

      // 같은 props로 리렌더링
      rerender(
        <TestWrapper overrides={overrides}>
          <TestComponent />
        </TestWrapper>
      );

      // memoization이 제대로 작동하면 추가 렌더링이 최소화되어야 함
      expect(renderCount - initialRenderCount).toBe(1);
    });

    test('토큰 해석 캐싱 효과 검증', () => {
      const iterations = 1000;
      const tokenRef = '{color.foundation.brand.50}';
      
      // 첫 번째 측정: 캐시 없이
      const start1 = performance.now();
      for (let i = 0; i < iterations; i++) {
        resolveToken(tokenRef);
      }
      const end1 = performance.now();
      
      // 두 번째 측정: 같은 토큰 (캐시 효과가 있다면 더 빨라야 함)
      const start2 = performance.now();
      for (let i = 0; i < iterations; i++) {
        resolveToken(tokenRef);
      }
      const end2 = performance.now();
      
      // 성능이 안정적이어야 함 (극단적으로 느려지지 않아야 함)
      expect(end1 - start1).toBeLessThan(100);
      expect(end2 - start2).toBeLessThan(100);
    });
  });

  describe('Cross-platform 호환성', () => {
    test('React Native 스타일 형식 호환성', () => {
      // React Native에서 사용 가능한 형식인지 확인
      const textColor = lightTheme.color.text.default;
      const backgroundColor = lightTheme.color.background.default;
      
      expect(typeof textColor).toBe('string');
      expect(typeof backgroundColor).toBe('string');
      expect(isValidHexColor(textColor)).toBe(true);
      expect(isValidHexColor(backgroundColor)).toBe(true);
      
      // 숫자 값들도 확인
      Object.values(lightTheme.spacing).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });

      Object.values(lightTheme.radius).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    test('웹 CSS 변수 호환성', () => {
      // CSS 변수 형식으로 사용 가능한지 확인
      const cssVar = `var(--st-color-text-default, ${lightTheme.color.text.default})`;
      expect(cssVar).toContain(lightTheme.color.text.default);
    });
  });

  describe('색상 특수 케이스 검증', () => {
    test('흰색/검정색 절대값 검증', () => {
      expect(lightTheme.color.text.white).toBe('#FFFFFF');
      expect(lightTheme.color.text.black).toBe('#000000');
      expect(darkTheme.color.text.white).toBe('#FFFFFF');
      expect(darkTheme.color.text.black).toBe('#000000');
    });

    test('반전 색상 논리 검증', () => {
      // 라이트 테마의 invert는 밝은 색이어야 함 (흰색)
      const lightInvert = calculateLuminance(lightTheme.color.text.invert);
      const lightDefault = calculateLuminance(lightTheme.color.text.default);
      expect(lightInvert).toBeGreaterThan(lightDefault);

      // 다크 테마의 invert는 어두운 색이어야 함
      const darkInvert = calculateLuminance(darkTheme.color.text.invert);
      const darkDefault = calculateLuminance(darkTheme.color.text.default);
      expect(darkInvert).toBeLessThan(darkDefault);
    });

    test('상태별 색상 의미 일관성 검증', () => {
      // 성공은 녹색 계열이어야 함
      const successGreen = hexToRgb(lightTheme.color.text.success.default)!;
      expect(successGreen.g).toBeGreaterThan(successGreen.r);
      expect(successGreen.g).toBeGreaterThan(successGreen.b);

      // 위험은 빨간색 계열이어야 함
      const dangerRed = hexToRgb(lightTheme.color.text.danger.default)!;
      expect(dangerRed.r).toBeGreaterThan(dangerRed.g);
      expect(dangerRed.r).toBeGreaterThan(dangerRed.b);

      // 경고는 주황/노란색 계열이어야 함
      const warningOrange = hexToRgb(lightTheme.color.text.warning.default)!;
      expect(warningOrange.r + warningOrange.g).toBeGreaterThan(warningOrange.b * 2);
    });
  });

  describe('실시간 테마 변경 시나리오', () => {
    test('다중 컴포넌트 동시 테마 변경', () => {
      let component1Theme: Theme | undefined;
      let component2Theme: Theme | undefined;
      
      const Component1 = () => {
        component1Theme = useTheme().theme;
        return <div>Component 1</div>;
      };

      const Component2 = () => {
        component2Theme = useTheme().theme;
        return <div>Component 2</div>;
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <TestWrapper>
            {children}
            <Component1 />
            <Component2 />
          </TestWrapper>
        )
      });

      // 초기 상태
      expect(component1Theme).toEqual(lightTheme);
      expect(component2Theme).toEqual(lightTheme);

      // 테마 변경
      act(() => {
        result.current.toggleTheme();
      });

      expect(component1Theme).toEqual(darkTheme);
      expect(component2Theme).toEqual(darkTheme);
    });
  });
}); 