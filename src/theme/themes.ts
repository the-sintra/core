import { Theme } from './types';
import { resolveTokens } from './utils';
import tokens from '../token/token.json';

/**
 * 라이트 테마 객체
 * 
 * @description 라이트 모드에서 사용되는 모든 디자인 토큰을 포함한 테마 객체입니다.
 * 토큰 참조들이 실제 값으로 해석되어 제공됩니다.
 * 
 * @type {Theme}
 * @example
 * ```typescript
 * import { lightTheme } from '@the-sintra/core';
 * 
 * const textColor = lightTheme.color.text.default;
 * const spacing = lightTheme.spacing.medium;
 * ```
 */
export const lightTheme: Theme = resolveTokens({
  color: {
    text: {
      default: tokens.color.semantic.light.text.default,
      primary: tokens.color.semantic.light.text.primary,
      subtle: tokens.color.semantic.light.text.subtle,
      secondary: tokens.color.semantic.light.text.secondary,
      disabled: tokens.color.semantic.light.text.disabled,
      invert: tokens.color.semantic.light.text.invert,
      white: tokens.color.semantic.light.text.white,
      black: tokens.color.semantic.light.text.black,
      brand: {
        default: tokens.color.semantic.light.text.brand.default,
        subtle: tokens.color.semantic.light.text.brand.subtle,
      },
      success: {
        default: tokens.color.semantic.light.text.success.default,
        subtle: tokens.color.semantic.light.text.success.subtle,
      },
      warning: {
        default: tokens.color.semantic.light.text.warning.default,
        subtle: tokens.color.semantic.light.text.warning.subtle,
      },
      danger: {
        default: tokens.color.semantic.light.text.danger.default,
        subtle: tokens.color.semantic.light.text.danger.subtle,
      },
    },
    background: {
      default: tokens.color.semantic.light.background.default,
      subtle: tokens.color.semantic.light.background.subtle,
      invert: {
        default: tokens.color.semantic.light.background.invert.default,
        subtle: tokens.color.semantic.light.background.invert.subtle,
      },
      brand: {
        subtle: tokens.color.semantic.light.background.brand.subtle,
        soft: tokens.color.semantic.light.background.brand.soft,
        default: tokens.color.semantic.light.background.brand.default,
        heavy: tokens.color.semantic.light.background.brand.heavy,
      },
      success: {
        subtle: tokens.color.semantic.light.background.success.subtle,
        soft: tokens.color.semantic.light.background.success.soft,
        default: tokens.color.semantic.light.background.success.default,
        heavy: tokens.color.semantic.light.background.success.heavy,
      },
      warning: {
        subtle: tokens.color.semantic.light.background.warning.subtle,
        soft: tokens.color.semantic.light.background.warning.soft,
        default: tokens.color.semantic.light.background.warning.default,
        heavy: tokens.color.semantic.light.background.warning.heavy,
      },
      danger: {
        subtle: tokens.color.semantic.light.background.danger.subtle,
        soft: tokens.color.semantic.light.background.danger.soft,
        default: tokens.color.semantic.light.background.danger.default,
        heavy: tokens.color.semantic.light.background.danger.heavy,
      },
    },
    line: {
      default: tokens.color.semantic.light.line.default,
      subtle: tokens.color.semantic.light.line.subtle,
    },
  },
  spacing: tokens.spacing,
  radius: tokens.radius,
  breakpoint: tokens.breakpoint,
});

/**
 * 다크 테마 객체
 * 
 * @description 다크 모드에서 사용되는 모든 디자인 토큰을 포함한 테마 객체입니다.
 * 토큰 참조들이 실제 값으로 해석되어 제공됩니다.
 * 
 * @type {Theme}
 * @example
 * ```typescript
 * import { darkTheme } from '@the-sintra/core';
 * 
 * const textColor = darkTheme.color.text.default;
 * const spacing = darkTheme.spacing.medium;
 * ```
 */
export const darkTheme: Theme = resolveTokens({
  color: {
    text: {
      default: tokens.color.semantic.dark.text.default,
      primary: tokens.color.semantic.dark.text.primary,
      subtle: tokens.color.semantic.dark.text.subtle,
      secondary: tokens.color.semantic.dark.text.secondary,
      disabled: tokens.color.semantic.dark.text.disabled,
      invert: tokens.color.semantic.dark.text.invert,
      white: tokens.color.semantic.dark.text.white,
      black: tokens.color.semantic.dark.text.black,
      brand: {
        default: tokens.color.semantic.dark.text.brand.default,
        subtle: tokens.color.semantic.dark.text.brand.subtle,
      },
      success: {
        default: tokens.color.semantic.dark.text.success.default,
        subtle: tokens.color.semantic.dark.text.success.subtle,
      },
      warning: {
        default: tokens.color.semantic.dark.text.warning.default,
        subtle: tokens.color.semantic.dark.text.warning.subtle,
      },
      danger: {
        default: tokens.color.semantic.dark.text.danger.default,
        subtle: tokens.color.semantic.dark.text.danger.subtle,
      },
    },
    background: {
      default: tokens.color.semantic.dark.background.default,
      subtle: tokens.color.semantic.dark.background.subtle,
      invert: {
        default: tokens.color.semantic.dark.background.invert.default,
        subtle: tokens.color.semantic.dark.background.invert.subtle,
      },
      brand: {
        subtle: tokens.color.semantic.dark.background.brand.subtle,
        soft: tokens.color.semantic.dark.background.brand.soft,
        default: tokens.color.semantic.dark.background.brand.default,
        heavy: tokens.color.semantic.dark.background.brand.heavy,
      },
      success: {
        subtle: tokens.color.semantic.dark.background.success.subtle,
        soft: tokens.color.semantic.dark.background.success.soft,
        default: tokens.color.semantic.dark.background.success.default,
        heavy: tokens.color.semantic.dark.background.success.heavy,
      },
      warning: {
        subtle: tokens.color.semantic.dark.background.warning.subtle,
        soft: tokens.color.semantic.dark.background.warning.soft,
        default: tokens.color.semantic.dark.background.warning.default,
        heavy: tokens.color.semantic.dark.background.warning.heavy,
      },
      danger: {
        subtle: tokens.color.semantic.dark.background.danger.subtle,
        soft: tokens.color.semantic.dark.background.danger.soft,
        default: tokens.color.semantic.dark.background.danger.default,
        heavy: tokens.color.semantic.dark.background.danger.heavy,
      },
    },
    line: {
      default: tokens.color.semantic.dark.line.default,
      subtle: tokens.color.semantic.dark.line.subtle,
    },
  },
  spacing: tokens.spacing,
  radius: tokens.radius,
  breakpoint: tokens.breakpoint,
}); 