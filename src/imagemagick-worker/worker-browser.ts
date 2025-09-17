import { expose } from "comlink";
import { bytesToBase64 } from "byte-base64";
import getFileType from 'magic-bytes.js';
import heicDecode from "heic-decode-builds";
import { ImageFileTypes } from "$/constants";

// Polyfill for CommonJS exports in browser environment
if (typeof exports === 'undefined') {
  (globalThis as any).exports = {};
}
if (typeof module === 'undefined') {
  (globalThis as any).module = { exports: (globalThis as any).exports };
}
if (typeof require === 'undefined') {
  (globalThis as any).require = (id: string) => {
    throw new Error(`require('${id}') is not supported in browser environment`);
  };
}

// Global variables for ImageMagick modules
let ImageMagick: any;
let initializeImageMagick: any;
let MagickImage: any;
let MagickFormat: any;
let MagickReadSettings: any;
let isInitialized = false;

interface ConvertFile {
  content: Uint8Array;
  convertTo: ImageFileTypes;
  quality?: number;
  scale?: number;
  maxWidth?: number;
}

// Function to load ImageMagick modules with proper error handling
const loadImageMagickModules = async () => {
  if (isInitialized) return; // Already loaded
  
  try {
    console.log('Loading ImageMagick modules...');
    
    // Try to load ImageMagick using a different approach
    // First, let's try to load the WebAssembly file directly
    try {
      // Load the main ImageMagick module
      const magickWasmModule = await import("@imagemagick/magick-wasm");
      console.log('Loaded main ImageMagick module:', magickWasmModule);
      
      // Extract the required functions
      ImageMagick = magickWasmModule.ImageMagick;
      initializeImageMagick = magickWasmModule.initializeImageMagick;
      
      // Load other modules
      const magickImageModule = await import("@imagemagick/magick-wasm/magick-image");
      const magickFormatModule = await import("@imagemagick/magick-wasm/magick-format");
      const magickReadSettingsModule = await import("@imagemagick/magick-wasm/settings/magick-read-settings");
      
      MagickImage = magickImageModule.MagickImage;
      MagickFormat = magickFormatModule.MagickFormat;
      MagickReadSettings = magickReadSettingsModule.MagickReadSettings;
      
      console.log('All ImageMagick modules loaded successfully');
      
      // Initialize ImageMagick
      console.log('Initializing ImageMagick...');
      await initializeImageMagick();
      console.log('ImageMagick initialized successfully');
      
      isInitialized = true;
    } catch (importError) {
      console.error('Failed to load ImageMagick via dynamic imports:', importError);
      
      // Fallback: Try loading the WebAssembly file directly
      console.log('Trying alternative loading method...');
      
      // Load the WebAssembly file directly from the node_modules
      const wasmUrl = new URL('@imagemagick/magick-wasm/wasm/magick.wasm', import.meta.url);
      const wasmResponse = await fetch(wasmUrl);
      const wasmBytes = await wasmResponse.arrayBuffer();
      
      // Try to initialize with the WebAssembly bytes directly
      const magickWasmModule = await import("@imagemagick/magick-wasm");
      
      // Set up a minimal environment for the WebAssembly
      (globalThis as any).exports = {};
      (globalThis as any).module = { exports: (globalThis as any).exports };
      
      // Initialize with the WebAssembly bytes
      await magickWasmModule.initializeImageMagick(wasmBytes);
      
      ImageMagick = magickWasmModule.ImageMagick;
      initializeImageMagick = magickWasmModule.initializeImageMagick;
      
      // Load other modules
      const magickImageModule = await import("@imagemagick/magick-wasm/magick-image");
      const magickFormatModule = await import("@imagemagick/magick-wasm/magick-format");
      const magickReadSettingsModule = await import("@imagemagick/magick-wasm/settings/magick-read-settings");
      
      MagickImage = magickImageModule.MagickImage;
      MagickFormat = magickFormatModule.MagickFormat;
      MagickReadSettings = magickReadSettingsModule.MagickReadSettings;
      
      console.log('ImageMagick loaded via alternative method');
      isInitialized = true;
    }
  } catch (error) {
    console.error('Failed to load ImageMagick modules:', error);
    throw new Error(`ImageMagick loading failed: ${error.message}`);
  }
};

export const init = async () => {
  console.log('Worker init called');
  await loadImageMagickModules();
  console.log('Worker init completed');
  return true;
};

export const convertFile = async (data: ConvertFile) => {
  console.log('Convert file called');
  
  // Ensure ImageMagick is loaded
  if (!isInitialized) {
    await loadImageMagickModules();
  }

  const originalFileType = getFileType(data.content);
  console.log('File type detected:', originalFileType);

  try {
    // If file is HEIC, first process the file through `heic-decode`
    // and then let ImageMagick take care of the rest
    if(originalFileType.map(e => e.mime).includes("image/heif")) {
      console.log('Processing HEIC file');
      const heif = await heicDecode({ buffer: data.content });
      const heifData = new Uint8Array(heif.data);

      const settings = new MagickReadSettings({
        width: heif.width,
        height: heif.height,
        format: MagickFormat.Rgba
      });

      let image = MagickImage.create();
      image.depth = 8;
      image.read(heifData, settings);
      
      // Set quality if provided
      if (data.quality !== undefined) {
        image.quality = data.quality;
      }
      
      // Apply scaling if provided
      if (data.scale !== undefined && data.scale < 100) {
        const scalePercentage = data.scale;
        image.resize(`${scalePercentage}%`);
      }
      
      // Apply width scaling if provided
      if (data.maxWidth !== undefined) {
        const geometry = image.geometry;
        if (geometry && geometry.width) {
          const ratio = geometry.height / geometry.width;
          const newHeight = Math.round(data.maxWidth * ratio);
          image.resize(`${data.maxWidth}x${newHeight}`);
        }
      }
      
      const convertedImage = await new Promise<Uint8Array>((fulfilled) => {
        // @ts-ignore
        image.write((newData) => fulfilled(newData), data.convertTo);
      });

      const stringData = bytesToBase64(convertedImage);
      console.log('HEIC conversion completed');
      return stringData;
    } else {
      console.log('Processing regular image file');
      let image = MagickImage.create();
      image.read(data.content);

      // Set quality if provided
      if (data.quality !== undefined) {
        image.quality = data.quality;
      }

      // Apply scaling if provided
      if (data.scale !== undefined && data.scale < 100) {
        const scalePercentage = data.scale;
        image.resize(`${scalePercentage}%`);
      }

      // Apply width scaling if provided
      if (data.maxWidth !== undefined) {
        const geometry = image.geometry;
        if (geometry && geometry.width) {
          const ratio = geometry.height / geometry.width;
          const newHeight = Math.round(data.maxWidth * ratio);
          image.resize(`${data.maxWidth}x${newHeight}`);
        }
      }

      const convertedImage = await new Promise<Uint8Array>((fulfilled) => {
        // @ts-ignore
        image.write((newData) => fulfilled(newData), data.convertTo);
      });

      // We cannot return a Uint8Array from a web worker
      // so we convert the data to a Base64 string and then on 
      // the main thread, we convert it back for downloading
      const stringData = bytesToBase64(convertedImage);
      console.log('Image conversion completed');
      return stringData;
    }
  } catch (error) {
    console.error('Error during image conversion:', error);
    throw new Error(`Image conversion failed: ${error.message}`);
  }
};

const worker = {
  init,
  convertFile
};

export type BaseWorkerType = typeof worker;

expose(worker);
