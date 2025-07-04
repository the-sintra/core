/**
 * Sintra 디자인 시스템의 테마 인터페이스
 * 
 * @interface Theme
 */
export interface Theme {
  color: {
    text: {
      default: string;
      primary: string;
      subtle: string;
      secondary: string;
      disabled: string;
      invert: string;
      white: string;
      black: string;
      brand: {
        default: string;
        subtle: string;
      };
      success: {
        default: string;
        subtle: string;
      };
      warning: {
        default: string;
        subtle: string;
      };
      danger: {
        default: string;
        subtle: string;
      };
    };
    background: {
      default: string;
      subtle: string;
      invert: {
        default: string;
        subtle: string;
      };
      brand: {
        subtle: string;
        soft: string;
        default: string;
        heavy: string;
      };
      success: {
        subtle: string;
        soft: string;
        default: string;
        heavy: string;
      };
      warning: {
        subtle: string;
        soft: string;
        default: string;
        heavy: string;
      };
      danger: {
        subtle: string;
        soft: string;
        default: string;
        heavy: string;
      };
    };
    line: {
      default: string;
      subtle: string;
    };
  };
  spacing: {
    none: number;
    micro: number;
    narrow: number;
    small: number;
    moderate: number;
    medium: number;
    large: number;
    big: number;
    huge: number;
    massive: number;
    colossal: number;
  };
  radius: {
    none: number;
    tiny: number;
    small: number;
    medium: number;
    large: number;
    big: number;
    huge: number;
    massive: number;
    full: number;
  };
  breakpoint: {
    desktop: number;
    mobile: number;
  };
}

export type ThemeMode = 'light' | 'dark';

/**
 * Foundation 색상 override를 위한 타입
 * 
 * @description 기본 색상 팔레트(gray, red, brand 등)를 부분적으로 override할 때 사용하는 타입입니다.
 * foundation 색상만 변경하면 semantic 색상들이 자동으로 반영됩니다.
 * 
 * @type {FoundationColorOverrides}
 * @example
 * ```typescript
 * const myFoundationColors: FoundationColorOverrides = {
 *   brand: {
 *     50: '#ff6b6b', // 브랜드 메인 색상을 빨간색으로
 *     60: '#ff5252', // 브랜드 진한 색상도 함께 조정
 *   },
 *   red: {
 *     50: '#4ecdc4', // 위험 색상을 청록색으로 변경
 *   },
 *   neutral: {
 *     100: '#2c3e50', // 검은색을 네이비로 변경
 *   }
 * };
 * ```
 */
export type FoundationColorOverrides = {
  base?: {
    base0?: string;
    base100?: string;
  };
  brand?: {
    0?: string;
    5?: string;
    10?: string;
    20?: string;
    30?: string;
    40?: string;
    50?: string;
    60?: string;
    70?: string;
    80?: string;
    90?: string;
    100?: string;
  };
  neutral?: {
    0?: string;
    5?: string;
    10?: string;
    20?: string;
    30?: string;
    40?: string;
    50?: string;
    60?: string;
    70?: string;
    80?: string;
    90?: string;
    100?: string;
  };
  red?: {
    0?: string;
    5?: string;
    10?: string;
    20?: string;
    30?: string;
    40?: string;
    50?: string;
    60?: string;
    70?: string;
    80?: string;
    90?: string;
    100?: string;
  };
  orange?: {
    0?: string;
    5?: string;
    10?: string;
    20?: string;
    30?: string;
    40?: string;
    50?: string;
    60?: string;
    70?: string;
    80?: string;
    90?: string;
    100?: string;
  };
  green?: {
    0?: string;
    5?: string;
    10?: string;
    20?: string;
    30?: string;
    40?: string;
    50?: string;
    60?: string;
    70?: string;
    80?: string;
    90?: string;
    100?: string;
  };
}; 