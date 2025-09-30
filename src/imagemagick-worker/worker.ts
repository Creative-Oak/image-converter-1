import { expose } from "comlink";
import { bytesToBase64 } from "byte-base64";
import getFileType from 'magic-bytes.js';
import heicDecode from "heic-decode-builds";
import { ImageFileTypes } from "$/constants";

// Import ImageMagick modules dynamically to ensure proper initialization
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

export const init = async () => {
  // Dynamically import ImageMagick modules
  const magickWasm = await import("@imagemagick/magick-wasm");
  const magickImage = await import("@imagemagick/magick-wasm/magick-image");
  const magickFormat = await import("@imagemagick/magick-wasm/magick-format");
  const magickReadSettings = await import("@imagemagick/magick-wasm/settings/magick-read-settings");
  
  // Assign the imported modules
  ImageMagick = magickWasm.ImageMagick;
  initializeImageMagick = magickWasm.initializeImageMagick;
  MagickImage = magickImage.MagickImage;
  MagickFormat = magickFormat.MagickFormat;
  MagickReadSettings = magickReadSettings.MagickReadSettings;
  
  await initializeImageMagick();
  return true
}

export const convertFile = async (data: ConvertFile) => {
  // Ensure ImageMagick is initialized
  if (!initializeImageMagick) {
    await init();
  }
  
  await initializeImageMagick();

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
    })

    let image = MagickImage.create();
    image.depth = 8
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
      console.log('Applying width scaling:', data.maxWidth);
      const width = image.width;
      const height = image.height;
      console.log('Original dimensions:', width, 'x', height);
      if (width && height) {
        // Use ImageMagick syntax for width-only resize (maintains aspect ratio)
        image.resize(`${data.maxWidth}x`);
        console.log('Resized to width:', data.maxWidth);
      } else {
        console.log('Could not get image dimensions');
      }
    }
    
    const convertedImage = await new Promise<Uint8Array>((fulfilled) => {
      // @ts-ignore
      image.write((newData) => fulfilled(newData), data.convertTo);
    });

    const stringData = bytesToBase64(convertedImage);
    return stringData;
  }

  else {
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
      console.log('Applying width scaling:', data.maxWidth);
      const width = image.width;
      const height = image.height;
      console.log('Original dimensions:', width, 'x', height);
      if (width && height) {
        // Use ImageMagick syntax for width-only resize (maintains aspect ratio)
        image.resize(`${data.maxWidth}x`);
        console.log('Resized to width:', data.maxWidth);
      } else {
        console.log('Could not get image dimensions');
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
}

export type BaseWorkerType = typeof worker;

expose(worker);