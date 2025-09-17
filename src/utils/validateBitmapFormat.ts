/**
 * Utility functions for validating bitmap image file formats
 */

// Common bitmap/raster image file extensions
const BITMAP_EXTENSIONS = [
  '.bmp',    // Windows Bitmap
  '.dib',    // Device Independent Bitmap
  '.jpg',    // JPEG
  '.jpeg',   // JPEG
  '.png',    // Portable Network Graphics
  '.gif',    // Graphics Interchange Format
  '.tiff',   // Tagged Image File Format
  '.tif',    // Tagged Image File Format
  '.tga',    // Truevision Graphics Adapter
  '.pcx',    // PC Paintbrush
  '.ico',    // Windows Icon
  '.cur',    // Windows Cursor
  '.webp',   // WebP
  '.avif',   // AVIF
  '.heic',   // High Efficiency Image Container
  '.heif',   // High Efficiency Image Format
] as const;

// MIME types for bitmap images
const BITMAP_MIME_TYPES = [
  'image/bmp',
  'image/x-bmp',
  'image/x-ms-bmp',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/tif',
  'image/x-tga',
  'image/x-pcx',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
] as const;

/**
 * Checks if a file has a valid bitmap image extension
 */
export const hasValidBitmapExtension = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return BITMAP_EXTENSIONS.includes(extension as any);
};

/**
 * Checks if a file has a valid bitmap image MIME type
 */
export const hasValidBitmapMimeType = (mimeType: string): boolean => {
  return BITMAP_MIME_TYPES.includes(mimeType as any);
};

/**
 * Validates if a file is a valid bitmap image format
 * Checks both file extension and MIME type for maximum reliability
 */
export const isValidBitmapImage = (file: File): boolean => {
  const hasValidExt = hasValidBitmapExtension(file.name);
  const hasValidMime = hasValidBitmapMimeType(file.type);
  
  // Both extension and MIME type should be valid
  return hasValidExt && hasValidMime;
};

/**
 * Gets a user-friendly list of supported bitmap formats
 */
export const getSupportedBitmapFormats = (): string => {
  return BITMAP_EXTENSIONS.join(', ').replace(/\./g, '');
};

/**
 * Gets the accept attribute value for file input elements
 */
export const getBitmapAcceptAttribute = (): string => {
  return BITMAP_EXTENSIONS.join(',').replace(/\./g, '');
};
