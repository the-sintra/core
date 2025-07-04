import tokens from '../token/token.json';
import { FoundationColorOverrides } from './types';

/**
 * 토큰 참조 문자열을 실제 값으로 해석합니다.
 * 
 * @param tokenReference - 해석할 토큰 참조 문자열 (예: "{color.foundation.neutral.neutral100}")
 * @param customTokens - 사용할 커스텀 토큰 객체 (기본값: 원본 tokens)
 * @returns 해석된 실제 값 (예: "#0D0E0E") 또는 해석할 수 없는 경우 원본 문자열
 * 
 * @example
 * ```typescript
 * resolveToken("{color.foundation.neutral.neutral100}") // "#0D0E0E"
 * resolveToken("#ffffff") // "#ffffff" (이미 해석된 값)
 * ```
 */
export function resolveToken(tokenReference: string, customTokens: any = tokens): string {
  if (!tokenReference.startsWith('{') || !tokenReference.endsWith('}')) {
    // 이미 해석된 값인 경우 그대로 반환
    return tokenReference;
  }

  const path = tokenReference.slice(1, -1).split('.');
  let value: any = customTokens;

  for (const key of path) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`토큰 경로를 찾을 수 없습니다: ${tokenReference}`);
      return tokenReference;
    }
  }

  // 재귀적으로 참조를 해석
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    return resolveToken(value, customTokens);
  }

  return value;
}

/**
 * 중첩된 객체의 모든 토큰 참조를 재귀적으로 해석합니다.
 * 
 * @template T - 해석할 객체의 타입
 * @param obj - 토큰 참조가 포함된 객체, 배열 또는 문자열
 * @param customTokens - 사용할 커스텀 토큰 객체 (기본값: 원본 tokens)
 * @returns 모든 토큰 참조가 해석된 새로운 객체
 * 
 * @example
 * ```typescript
 * const theme = {
 *   color: "{color.foundation.neutral.neutral100}",
 *   nested: {
 *     background: "{color.background.default}"
 *   }
 * };
 * const resolved = resolveTokens(theme);
 * // 결과: { color: "#0D0E0E", nested: { background: "#ffffff" } }
 * ```
 */
export function resolveTokens<T>(obj: T, customTokens: any = tokens): T {
  if (typeof obj === 'string') {
    return resolveToken(obj, customTokens) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveTokens(item, customTokens)) as T;
  }

  if (obj && typeof obj === 'object') {
    const resolved: any = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveTokens(value, customTokens);
    }
    return resolved;
  }

  return obj;
}

/**
 * 두 객체를 깊게 병합합니다.
 * 
 * @param target - 기본 객체
 * @param source - 병합할 객체 (target의 값을 덮어씀)
 * @returns 병합된 새로운 객체
 * 
 * @example
 * ```typescript
 * const base = { a: { b: 1, c: 2 } };
 * const override = { a: { b: 99 } };
 * const result = deepMerge(base, override);
 * // 결과: { a: { b: 99, c: 2 } }
 * ```
 */
function deepMerge(target: Record<string, any>, source: any): Record<string, any> {
  const result: Record<string, any> = { ...target };
  
  // Object.keys를 사용하여 모든 키(숫자 포함)를 문자열로 처리
  Object.keys(source).forEach(key => {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' && 
        source[key] !== null && 
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' && 
        result[key] !== null && 
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  });
  
  return result;
}

/**
 * Foundation 색상 override를 적용한 새로운 토큰을 생성합니다.
 * 
 * @param foundationOverrides - Foundation 색상 override 객체
 * @returns Foundation 색상이 병합된 새로운 토큰 객체
 * 
 * @example
 * ```typescript
 * const overrides = {
 *   brand: { 50: '#ff6b6b' },
 *   red: { 50: '#4ecdc4' }
 * };
 * const customTokens = createCustomTokens(overrides);
 * // 결과: foundation 색상이 override된 새로운 토큰 객체
 * ```
 */
export function createCustomTokens(foundationOverrides?: FoundationColorOverrides): any {
  if (!foundationOverrides) {
    return tokens;
  }
  
  // 토큰을 깊은 복사하고 foundation 색상 부분만 override
  const customTokens = JSON.parse(JSON.stringify(tokens));
  
  if (customTokens.color && customTokens.color.foundation) {
    customTokens.color.foundation = deepMerge(customTokens.color.foundation, foundationOverrides);
  }
  
  return customTokens;
}

/**
 * Foundation 색상 override를 적용한 커스텀 테마를 생성합니다.
 * 
 * @param foundationOverrides - Foundation 색상 override 객체
 * @returns { lightTheme, darkTheme } - 커스텀 라이트/다크 테마 객체
 * 
 * @example
 * ```typescript
 * const overrides = {
 *   brand: { 50: '#ff6b6b' },
 *   neutral: { 100: '#2c3e50' }
 * };
 * const { lightTheme, darkTheme } = createCustomThemes(overrides);
 * // 결과: foundation 색상이 적용된 새로운 테마 객체들
 * ```
 */
export function createCustomThemes(foundationOverrides?: FoundationColorOverrides): {
  lightTheme: any;
  darkTheme: any;
} {
  const customTokens = createCustomTokens(foundationOverrides);
  
  const lightTheme = resolveTokens({
    color: {
      text: {
        default: customTokens.color.semantic.light.text.default,
        primary: customTokens.color.semantic.light.text.primary,
        subtle: customTokens.color.semantic.light.text.subtle,
        secondary: customTokens.color.semantic.light.text.secondary,
        disabled: customTokens.color.semantic.light.text.disabled,
        invert: customTokens.color.semantic.light.text.invert,
        white: customTokens.color.semantic.light.text.white,
        black: customTokens.color.semantic.light.text.black,
        brand: {
          default: customTokens.color.semantic.light.text.brand.default,
          subtle: customTokens.color.semantic.light.text.brand.subtle,
        },
        success: {
          default: customTokens.color.semantic.light.text.success.default,
          subtle: customTokens.color.semantic.light.text.success.subtle,
        },
        warning: {
          default: customTokens.color.semantic.light.text.warning.default,
          subtle: customTokens.color.semantic.light.text.warning.subtle,
        },
        danger: {
          default: customTokens.color.semantic.light.text.danger.default,
          subtle: customTokens.color.semantic.light.text.danger.subtle,
        },
      },
      background: {
        default: customTokens.color.semantic.light.background.default,
        subtle: customTokens.color.semantic.light.background.subtle,
        invert: {
          default: customTokens.color.semantic.light.background.invert.default,
          subtle: customTokens.color.semantic.light.background.invert.subtle,
        },
        brand: {
          subtle: customTokens.color.semantic.light.background.brand.subtle,
          soft: customTokens.color.semantic.light.background.brand.soft,
          default: customTokens.color.semantic.light.background.brand.default,
          heavy: customTokens.color.semantic.light.background.brand.heavy,
        },
        success: {
          subtle: customTokens.color.semantic.light.background.success.subtle,
          soft: customTokens.color.semantic.light.background.success.soft,
          default: customTokens.color.semantic.light.background.success.default,
          heavy: customTokens.color.semantic.light.background.success.heavy,
        },
        warning: {
          subtle: customTokens.color.semantic.light.background.warning.subtle,
          soft: customTokens.color.semantic.light.background.warning.soft,
          default: customTokens.color.semantic.light.background.warning.default,
          heavy: customTokens.color.semantic.light.background.warning.heavy,
        },
        danger: {
          subtle: customTokens.color.semantic.light.background.danger.subtle,
          soft: customTokens.color.semantic.light.background.danger.soft,
          default: customTokens.color.semantic.light.background.danger.default,
          heavy: customTokens.color.semantic.light.background.danger.heavy,
        },
      },
      line: {
        default: customTokens.color.semantic.light.line.default,
        subtle: customTokens.color.semantic.light.line.subtle,
      },
    },
    spacing: customTokens.spacing,
    radius: customTokens.radius,
    breakpoint: customTokens.breakpoint,
  }, customTokens);

  const darkTheme = resolveTokens({
    color: {
      text: {
        default: customTokens.color.semantic.dark.text.default,
        primary: customTokens.color.semantic.dark.text.primary,
        subtle: customTokens.color.semantic.dark.text.subtle,
        secondary: customTokens.color.semantic.dark.text.secondary,
        disabled: customTokens.color.semantic.dark.text.disabled,
        invert: customTokens.color.semantic.dark.text.invert,
        white: customTokens.color.semantic.dark.text.white,
        black: customTokens.color.semantic.dark.text.black,
        brand: {
          default: customTokens.color.semantic.dark.text.brand.default,
          subtle: customTokens.color.semantic.dark.text.brand.subtle,
        },
        success: {
          default: customTokens.color.semantic.dark.text.success.default,
          subtle: customTokens.color.semantic.dark.text.success.subtle,
        },
        warning: {
          default: customTokens.color.semantic.dark.text.warning.default,
          subtle: customTokens.color.semantic.dark.text.warning.subtle,
        },
        danger: {
          default: customTokens.color.semantic.dark.text.danger.default,
          subtle: customTokens.color.semantic.dark.text.danger.subtle,
        },
      },
      background: {
        default: customTokens.color.semantic.dark.background.default,
        subtle: customTokens.color.semantic.dark.background.subtle,
        invert: {
          default: customTokens.color.semantic.dark.background.invert.default,
          subtle: customTokens.color.semantic.dark.background.invert.subtle,
        },
        brand: {
          subtle: customTokens.color.semantic.dark.background.brand.subtle,
          soft: customTokens.color.semantic.dark.background.brand.soft,
          default: customTokens.color.semantic.dark.background.brand.default,
          heavy: customTokens.color.semantic.dark.background.brand.heavy,
        },
        success: {
          subtle: customTokens.color.semantic.dark.background.success.subtle,
          soft: customTokens.color.semantic.dark.background.success.soft,
          default: customTokens.color.semantic.dark.background.success.default,
          heavy: customTokens.color.semantic.dark.background.success.heavy,
        },
        warning: {
          subtle: customTokens.color.semantic.dark.background.warning.subtle,
          soft: customTokens.color.semantic.dark.background.warning.soft,
          default: customTokens.color.semantic.dark.background.warning.default,
          heavy: customTokens.color.semantic.dark.background.warning.heavy,
        },
        danger: {
          subtle: customTokens.color.semantic.dark.background.danger.subtle,
          soft: customTokens.color.semantic.dark.background.danger.soft,
          default: customTokens.color.semantic.dark.background.danger.default,
          heavy: customTokens.color.semantic.dark.background.danger.heavy,
        },
      },
      line: {
        default: customTokens.color.semantic.dark.line.default,
        subtle: customTokens.color.semantic.dark.line.subtle,
      },
    },
    spacing: customTokens.spacing,
    radius: customTokens.radius,
    breakpoint: customTokens.breakpoint,
  }, customTokens);

  return { lightTheme, darkTheme };
} 