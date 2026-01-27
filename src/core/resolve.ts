import { parseColorValue } from './utils';

/**
 * Color resolution functions for handling Figma variable aliases and primitives
 */

/**
 * Interface for color resolution result
 */
export interface ColorResult {
  hex: string;
  primitiveName: string;
}

/**
 * Resolves the color value for a variable in a given mode, handling aliases and primitives.
 * This function handles both direct color values and variable aliases that point to primitive colors.
 * @param variable The Figma variable to resolve
 * @param modeId The mode ID to resolve for (e.g., light/dark)
 * @param primitiveModeId The primitive mode ID for alias resolution
 * @returns Object with hex color and primitive name
 */
export async function resolveColor(
  variable: Variable, 
  modeId: string, 
  primitiveModeId: string
): Promise<ColorResult> {
  const value = variable.valuesByMode[modeId];
  
  // If the value is an alias, resolve it to the primitive variable
  if ((value as any).type === "VARIABLE_ALIAS") {
    const aliasId = (value as VariableAlias).id;
    const primitiveVar = await figma.variables.getVariableByIdAsync(aliasId);
    
    if (!primitiveVar || !primitiveModeId) {
      return { hex: "#FF00FF", primitiveName: "Unresolved" }; // Magenta for debugging
    }
    
    const finalValue = primitiveVar.valuesByMode[primitiveModeId];
    return { 
      hex: parseColorValue(finalValue), 
      primitiveName: primitiveVar.name 
    };
  }
  
  // Otherwise, parse the raw color value
  return { 
    hex: parseColorValue(value), 
    primitiveName: "Raw" 
  };
}

/**
 * Resolves color values for all modes of a brand configuration.
 * @param variable The Figma variable to resolve
 * @param brand Brand configuration with light/dark mode settings
 * @returns Object with resolved colors for available modes
 */
export async function resolveBrandColors(
  variable: Variable, 
  brand: any
): Promise<any> {
  const brandResult: any = {};
  
  if (brand.light?.modeId) {
    // Resolve color for light mode
    const res = await resolveColor(variable, brand.light.modeId, brand.light.primitiveModeId);
    brandResult.light = res.hex;
  }
  
  if (brand.dark?.modeId) {
    // Resolve color for dark mode
    const res = await resolveColor(variable, brand.dark.modeId, brand.dark.primitiveModeId);
    brandResult.dark = res.hex;
  }
  
  return brandResult;
}