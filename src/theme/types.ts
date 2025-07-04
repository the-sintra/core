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