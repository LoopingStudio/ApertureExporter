/**
 * Utility functions for the Aperture Exporter plugin
 */

/**
 * Sanitizes a name by replacing spaces and slashes with hyphens and converting to lowercase.
 * Useful for creating valid file names and identifiers from Figma variable names.
 * @param name The string to sanitize
 * @returns Sanitized string suitable for file names in lowercase
 */
export function sanitizeName(name: string): string {
  return name.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
}

/**
 * Converts a name to kebab-case for token names.
 * @param name The string to convert
 * @returns String in kebab-case format (lowercase with hyphens)
 */
export function toKebabCase(name: string): string {
  return name.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
}

/**
 * Sanitizes a folder name keeping PascalCase but replacing problematic characters.
 * @param name The folder name to sanitize
 * @returns Sanitized folder name in PascalCase
 */
export function sanitizeFolderName(name: string): string {
  return name.replace(/\s+/g, '').replace(/\//g, '');
}

/**
 * Converts a Figma color value to a hex string.
 * Handles RGBA objects and returns a fallback for invalid values.
 * @param value The color value (RGBA object or other)
 * @returns Hex color string
 */
export function parseColorValue(value: any): string {
  if (value && typeof value === 'object' && 'r' in value) {
    return rgbaToHex(value as RGBA);
  }
  return "#000000"; // Fallback for invalid color values
}

/**
 * Converts RGBA color values to a hex string (ignores alpha channel).
 * @param c RGBA color object with normalized values (0-1)
 * @returns Hex color string in uppercase format
 */
export function rgbaToHex(c: RGBA): string {
  const toHex = (v: number) => {
    const hex = Math.round(v * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toUpperCase();
}

/**
 * Creates a nested tree structure for organizing tokens into groups.
 * @param rootArray The root array to insert into
 * @param folders Array of folder names representing the path
 * @param tokenObj The token object to insert
 */
export function insertTokenIntoTree(rootArray: any[], folders: string[], tokenObj: any): void {
  let currentLevel = rootArray;
  
  // Traverse or create folder groups as needed
  for (const folderName of folders) {
    // Check if the group already exists at this level
    let existingGroup = currentLevel.find(item => item.name === folderName && item.type === 'group');
    
    if (!existingGroup) {
      // Create new group if it doesn't exist
      existingGroup = {
        name: folderName,
        type: "group",
        children: []
      };
      currentLevel.push(existingGroup);
    }
    
    // Move deeper into the group
    currentLevel = existingGroup.children;
  }
  
  // Add the token to the final group level
  currentLevel.push(tokenObj);
}