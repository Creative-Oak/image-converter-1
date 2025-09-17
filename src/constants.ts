export const imageFileTypes = ["WEBP", "JPG", "PNG", "GIF"] as const;
export type ImageFileTypes = typeof imageFileTypes[number];

export type FileStatus = {
  file: File;
  id: string;
  status: "in-progress" | "not-started" | "failed" | "success";
  convertTo?: ImageFileTypes;
  statusTooltip?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  successData?: {
    data: Uint8Array;
    url: string;
  };
};
