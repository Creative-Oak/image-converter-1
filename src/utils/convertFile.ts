import assert from "assert";
import { FileStatus } from "$/constants";
import { WorkerType } from "$/imagemagick-worker";
import { base64ToBytes } from "byte-base64";
import prettyMs from "pretty-ms";

export const convertFile = async (
  file: FileStatus,
  worker: WorkerType,
  quality: number = 90,
  scale: number = 100,
  maxWidth?: number
): Promise<FileStatus> => {
  try {
    const start = new Date();
    assert(file.convertTo);

    const content = new Uint8Array(await file.file.arrayBuffer());
    const stringData = await worker.convertFile({
      content,
      convertTo: file.convertTo,
      quality,
      scale,
      maxWidth,
    });

    // Convert string data back to a Uint8Array
    const data = base64ToBytes(stringData);

    const end = new Date();
    const completionTime = prettyMs(end.valueOf() - start.valueOf());

    return {
      ...file,
      status: "success",
      statusTooltip: `Færdig på ${completionTime}`,
      successData: {
        data: data,
        url: URL.createObjectURL(new Blob([data])),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      ...file,
      status: "failed",
      statusTooltip: "Åbn DevTools konsollen for mere information"
    };
  }
};
