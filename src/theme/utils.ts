import tokens from '../token/token.json';

/**
 * 토큰 참조 문자열을 실제 값으로 해석합니다.
 * 
 * @param tokenReference - 해석할 토큰 참조 문자열 (예: "{color.foundation.neutral.neutral100}")
 * @returns 해석된 실제 값 (예: "#0D0E0E") 또는 해석할 수 없는 경우 원본 문자열
 * 
 * @example
 * ```typescript
 * resolveToken("{color.foundation.neutral.neutral100}") // "#0D0E0E"
 * resolveToken("#ffffff") // "#ffffff" (이미 해석된 값)
 * ```
 */
export function resolveToken(tokenReference: string): string {
  if (!tokenReference.startsWith('{') || !tokenReference.endsWith('}')) {
    // 이미 해석된 값인 경우 그대로 반환
    return tokenReference;
  }

  const path = tokenReference.slice(1, -1).split('.');
  let value: any = tokens;

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
    return resolveToken(value);
  }

  return value;
}

/**
 * 중첩된 객체의 모든 토큰 참조를 재귀적으로 해석합니다.
 * 
 * @template T - 해석할 객체의 타입
 * @param obj - 토큰 참조가 포함된 객체, 배열 또는 문자열
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
export function resolveTokens<T>(obj: T): T {
  if (typeof obj === 'string') {
    return resolveToken(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(resolveTokens) as T;
  }

  if (obj && typeof obj === 'object') {
    const resolved: any = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveTokens(value);
    }
    return resolved;
  }

  return obj;
} 