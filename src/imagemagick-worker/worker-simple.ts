import { expose } from "comlink";
import { bytesToBase64 } from "byte-base64";
import getFileType from 'magic-bytes.js';
import heicDecode from "heic-decode-builds";
import { ImageFileTypes } from "$/constants";

// Global variables for ImageMagick modules
let ImageMagick: any;
let initializeImageMagick: any;
let MagickImage: any;
let MagickFormat: any;
let MagickReadSettings: any;

interface ConvertFile {
  content: Uint8Array;
  convertTo: ImageFileTypes;
  quality?: number;
  scale?: number;
  maxWidth?: number;
}

// Function to load ImageMagick modules
const loadImageMagickModules = async () => {
  if (ImageMagick) return; // Already loaded
  
  try {
    // Load the main ImageMagick module
    const magickWasm = await import("@imagemagick/magick-wasm");
    ImageMagick = magickWasm.ImageMagick;
    initializeImageMagick = magickWasm.initializeImageMagick;
    
    // Load other modules
    const magickImage = await import("@imagemagick/magick-wasm/magick-image");
    const magickFormat = await import("@imagemagick/magick-wasm/magick-format");
    const magickReadSettings = await import("@imagemagick/magick-wasm/settings/magick-read-settings");
    
    MagickImage = magickImage.MagickImage;
    MagickFormat = magickFormat.MagickFormat;
    MagickReadSettings = magickReadSettings.MagickReadSettings;
    
    // Initialize ImageMagick
    await initializeImageMagick();
  } catch (error) {
    console.error('Failed to load ImageMagick modules:', error);
    throw error;
  }
};

export const init = async () => {
  await loadImageMagickModules();
  return true;
};

export const convertFile = async (data: ConvertFile) => {
  // Ensure ImageMagick is loaded
  await loadImageMagickModules();

  const originalFileType = getFileType(data.content);

  // If file is HEIC, first process the file through `heic-decode`
  // and then let ImageMagick take care of the rest
  if(originalFileType.map(e => e.mime).includes("image/heif")) {
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
    return stringData;
  } else {
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
    return stringData;
  }
};

const worker = {
  init,
  convertFile
};

export type BaseWorkerType = typeof worker;

expose(worker);
