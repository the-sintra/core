import fs from "fs";
import { ensureDirectoryExists } from "./shared";
import path from "path";

type ThemeValue = string | number;
type SemanticTheme = Record<string, ThemeValue | Record<string, any>>;

type ColorStructure = {
  foundation: Record<string, Record<string, ThemeValue>>;
  semantic: {
    light: Record<string, SemanticTheme>;
    dark: Record<string, SemanticTheme>;
  };
};

type TokenStructure = {
  color: ColorStructure;
  [key: string]:
    | Record<string, Record<string, ThemeValue>>
    | ColorStructure
    | Record<string, ThemeValue | Record<string, any>>;
};

const CONFIG = {
  variablePrefix: "st",
  tokenPath: path.resolve(__dirname, "../src/token/token.json"),
  output: {
    constants: path.resolve(__dirname, "../src/constants"),
    css: path.resolve(__dirname, "../src/styles/base.css"),
  },
} as const;

const tokenContent = JSON.parse(
  fs.readFileSync(CONFIG.tokenPath, "utf8")
) as TokenStructure;
if (!tokenContent) {
  throw new Error("❌ 디자인 토큰 파일을 찾을 수 없습니다.");
}

function firstLetterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 참조 토큰 값 해석
function resolveTokenReference(
  value: string | ThemeValue,
  tokens: TokenStructure
): string {
  // If not a reference, return as is
  if (
    typeof value !== "string" ||
    !value.startsWith("{") ||
    !value.endsWith("}")
  ) {
    return String(value);
  }

  // Extract path from reference (e.g., "color.foundation.neutral.100")
  const path = value.slice(1, -1).split(".");

  // Navigate through token structure to get actual value
  let resolved: any = tokens;
  for (const segment of path) {
    if (!resolved[segment]) {
      console.warn(`Warning: Could not resolve token reference ${value}`);
      return value; // Return original if can't resolve
    }
    resolved = resolved[segment];
  }

  // If resolved to an object, it's likely a nested reference that needs further resolution
  if (typeof resolved === "object" && resolved !== null) {
    // For simple objects with "default" property, use that value
    if (resolved.default) {
      return resolveTokenReference(resolved.default, tokens);
    }

    console.warn(`Warning: Token reference ${value} resolved to an object.`);
    return ""; // Return empty string instead of [object Object]
  }

  return String(resolved);
}

// Foundation 및 기본 토큰을 CSS 변수로 생성
function generateFoundationCSSVariables(tokens: TokenStructure): string {
  let cssVars: string[] = [];

  // Process foundation colors
  if (tokens.color && tokens.color.foundation) {
    Object.entries(tokens.color.foundation).forEach(([palette, colors]) => {
      Object.entries(colors).forEach(([shade, value]) => {
        cssVars.push(
          `    --${CONFIG.variablePrefix}-color-foundation-${palette}-${shade}: ${value};`
        );
      });
    });
  }

  // Process other token categories (like spacing, radius)
  Object.entries(tokens).forEach(([category, values]) => {
    if (
      category !== "color" &&
      typeof values === "object" &&
      !("semantic" in values)
    ) {
      if (category === "typography") {
        // Handle typography objects specially - create individual properties
        Object.entries(values as Record<string, any>).forEach(
          ([typeName, typeProps]) => {
            if (typeof typeProps === "object" && typeProps !== null) {
              Object.entries(typeProps).forEach(([propName, propValue]) => {
                cssVars.push(
                  `    --${CONFIG.variablePrefix}-${category}-${typeName}-${propName}: ${propValue};`
                );
              });
            }
          }
        );
      } else {
        // Handle simple token categories (spacing, radius, etc.)
        Object.entries(values as Record<string, ThemeValue>).forEach(
          ([key, value]) => {
            cssVars.push(
              `    --${CONFIG.variablePrefix}-${category}-${key}: ${value};`
            );
          }
        );
      }
    }
  });

  return cssVars.join("\n");
}

// Generate semantic CSS variables with proper handling of nested structures
function generateSemanticVariables(
  prefix: string,
  categoryName: string,
  values: any,
  tokens: TokenStructure
): string[] {
  const cssVars: string[] = [];

  if (typeof values !== "object" || values === null) {
    const resolvedValue = resolveTokenReference(values, tokens);
    cssVars.push(
      `    --${CONFIG.variablePrefix}-${prefix}-${categoryName}: ${resolvedValue};`
    );
    return cssVars;
  }

  Object.entries(values).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Recursive handling for nested objects
      const nestedVars = generateSemanticVariables(
        `${prefix}-${categoryName}`,
        key,
        value,
        tokens
      );
      cssVars.push(...nestedVars);
    } else {
      const resolvedValue = resolveTokenReference(value as ThemeValue, tokens);
      cssVars.push(
        `    --${CONFIG.variablePrefix}-${prefix}-${categoryName}-${key}: ${resolvedValue};`
      );
    }
  });

  return cssVars;
}

// Light theme semantic variables
function generateLightThemeVariables(tokens: TokenStructure): string {
  const cssVars: string[] = [];

  if (tokens.color?.semantic?.light) {
    Object.entries(tokens.color.semantic.light).forEach(
      ([category, values]) => {
        const categoryVars = generateSemanticVariables(
          "color-semantic",
          category,
          values,
          tokens
        );
        cssVars.push(...categoryVars);
      }
    );
  }

  return cssVars.join("\n");
}

// Dark theme semantic variables
function generateDarkThemeVariables(tokens: TokenStructure): string {
  const cssVars: string[] = [];

  if (tokens.color?.semantic?.dark) {
    Object.entries(tokens.color.semantic.dark).forEach(([category, values]) => {
      const categoryVars = generateSemanticVariables(
        "color-semantic",
        category,
        values,
        tokens
      );
      cssVars.push(...categoryVars);
    });
  }

  return cssVars.join("\n");
}

// Semantic 토큰을 TypeScript 코드로 변환
function generateSemanticConstants(
  semantic: Record<string, SemanticTheme>
): string {
  function processNestedTokens(
    category: string,
    values: Record<string, any>,
    prefix: string = "",
    indentLevel: number = 2
  ): string {
    const indent = "    ".repeat(indentLevel);
    const nextIndent = "    ".repeat(indentLevel + 1);
    
    return Object.entries(values)
      .map(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
          // Recursively process nested objects
          const nestedContent = processNestedTokens(
            category,
            value,
            `${prefix}${key}-`,
            indentLevel + 1
          );
          return `${indent}${key}: {\n${nestedContent}\n${indent}},`;
        } else {
          // Generate token entry
          return `${indent}${key}: 'var(--${CONFIG.variablePrefix}-color-semantic-${category}-${prefix}${key})',`;
        }
      })
      .join("\n");
  }

  // Create top-level color object
  const colorCategories = Object.entries(semantic)
    .map(([category, values]) => {
      const tokenEntries = processNestedTokens(category, values);
      return `    ${category}: {\n${tokenEntries}\n    },`;
    })
    .join("\n\n");

  return `export const Color = {\n${colorCategories}\n};\n`;
}

// 일반 토큰을 TypeScript 코드로 변환 (spacing, typography 등)
function generateTokenConstants(
  category: string,
  values: Record<string, any>
): string {
  if (category === "typography") {
    // Handle typography specially - it needs nested object structure
    const typographyEntries = Object.entries(values)
      .map(([typeName, typeProps]) => {
        // Create entries for each typography style
        const propEntries = Object.entries(typeProps as Record<string, any>)
          .map(
            ([propName, _]) =>
              `        ${propName}: 'var(--${CONFIG.variablePrefix}-${category}-${typeName}-${propName})',`
          )
          .join("\n");

        return `    ${typeName}: {\n${propEntries}\n    },`;
      })
      .join("\n\n");

    return `export const ${firstLetterToUpperCase(
      category
    )} = {\n${typographyEntries}\n};`;
  } else {
    // Handle regular flat token structures
    const tokenEntries = Object.entries(values)
      .map(
        ([key, _]) =>
          `    ${key}: 'var(--${CONFIG.variablePrefix}-${category}-${key})',`
      )
      .join("\n");

    return `export const ${firstLetterToUpperCase(
      category
    )} = {\n${tokenEntries}\n};`;
  }
}

try {
  // CSS 파일 생성
  let cssContent = "/* Auto-generated. Do not modify directly. */\n\n";

  // Foundation and base tokens
  cssContent += ":root {\n";
  cssContent += generateFoundationCSSVariables(tokenContent);
  cssContent += "\n\n";

  // Light theme semantic tokens (default theme)
  cssContent += "    /* Light Theme Semantic Tokens */\n";
  cssContent += generateLightThemeVariables(tokenContent);
  cssContent += "\n}\n\n";

  // Dark theme
  cssContent += '[data-theme="dark"] {\n';
  cssContent += "    /* Dark Theme Semantic Tokens */\n";
  cssContent += generateDarkThemeVariables(tokenContent);
  cssContent += "\n}\n";

  // Ensure the CSS output directory exists before writing the file
  ensureDirectoryExists(CONFIG.output.css);
  fs.writeFileSync(CONFIG.output.css, cssContent);
  console.log("✅ 모든 디자인 토큰의 CSS 파일이 생성되었습니다.");

  // Constants 파일 생성
  // Ensure the constants directory exists first
  ensureDirectoryExists(CONFIG.output.constants);

  // Track all generated constant files for index.ts generation
  const generatedConstantFiles: string[] = [];

  // Semantic color constants (theme-aware)
  if (tokenContent.color?.semantic?.light) {
    const semanticConstants = generateSemanticConstants(
      tokenContent.color.semantic.light
    );
    const semanticColorsPath = path.join(
      CONFIG.output.constants,
      "color.ts"
    );
    // No need to call ensureDirectoryExists again since we already created the constants directory
    fs.writeFileSync(semanticColorsPath, semanticConstants);
    generatedConstantFiles.push("color");
    console.log("✅ Semantic Color 상수 파일이 생성되었습니다.");
  }

  // Generate constants for other token types (spacing, typography, etc.)
  Object.entries(tokenContent).forEach(([category, values]) => {
    if (category !== "color" && typeof values === "object") {
      if (!("semantic" in values)) {
        const constants = generateTokenConstants(
          category,
          values as Record<string, any>
        );
        const filePath = `${CONFIG.output.constants}/${category}.ts`;
        ensureDirectoryExists(filePath);
        fs.writeFileSync(filePath, constants);
        generatedConstantFiles.push(category);
        console.log(
          `✅ ${firstLetterToUpperCase(category)} 상수 파일이 생성되었습니다.`
        );
      }
    }
  });

  // Generate index.ts file that exports all constant files
  const indexFileContent =
    generatedConstantFiles
      .map((file) => `export * from './${file}';`)
      .join("\n") + "\n";

  const indexFilePath = path.join(CONFIG.output.constants, "index.ts");
  fs.writeFileSync(indexFilePath, indexFileContent);
  console.log("✅ constants/index.ts 파일이 생성되었습니다.");
} catch (error) {
  console.error(error);
  throw new Error(`❌ 토큰 생성 중 오류 발생: ${error}`);
}
