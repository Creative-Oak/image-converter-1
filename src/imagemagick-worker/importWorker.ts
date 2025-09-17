import type { AsyncReturnType } from "type-fest";
import type { BaseWorkerType } from "./worker";
import { wrap, Remote } from "comlink";
import createBaseWorkerProd from "./worker?worker";

export type WorkerType = AsyncReturnType<typeof importWorker>;

export const importWorker = async () => {
  let worker: Remote<BaseWorkerType>;

  // Use the simplified worker for both dev and prod
  worker = wrap<BaseWorkerType>(new createBaseWorkerProd());

  await worker.init();
  return worker;
};
