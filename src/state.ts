import { atom, useAtom } from "jotai";
import { splitAtom } from "jotai/utils";
import { FileStatus, ImageFileTypes } from "./constants";

export const filesToConvertAtom = atom<FileStatus[]>([])
const filesToConvertAtomsAtom = splitAtom(filesToConvertAtom);
export const useFilesToConvert = () => useAtom(filesToConvertAtom)
export const useFilesToConvertAtoms = () => useAtom(filesToConvertAtomsAtom)

// Quality slider state - default to 95%
export const qualityAtom = atom<number>(95);
export const useQuality = () => useAtom(qualityAtom);

// Scale mode state - either 'scale' or 'maxWidth'
export const scaleModeAtom = atom<'scale' | 'maxWidth'>('scale');
export const useScaleMode = () => useAtom(scaleModeAtom);

// Scale slider state - default to 100% (no scaling)
export const scaleAtom = atom<number>(100);
export const useScale = () => useAtom(scaleAtom);

// Max width state - default to 1000px (very large)
export const maxWidthAtom = atom<number>(1000);
export const useMaxWidth = () => useAtom(maxWidthAtom);

// Format selection state - default to WEBP
export const formatAtom = atom<string>("WEBP");
export const useFormat = () => useAtom(formatAtom);

// Current uploaded file state
export const currentFileAtom = atom<File | null>(null);
export const useCurrentFile = () => useAtom(currentFileAtom);
