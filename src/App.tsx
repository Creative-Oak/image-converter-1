import React, { useRef } from "react";
import cn from "classnames";
import { useWindowSize } from "react-use";
import {
  Loader,
  WorkerType,
  useWorkerStatus,
  WorkerRefContext,
} from "./imagemagick-worker";
import { ReloadPrompt } from "./components/ReloadPrompt";
import { About } from "./components/About";
import { ImageUpload } from "./components/ImageUpload";
import { ConversionSettings } from "./components/ConversionSettings";
import { ConvertButton } from "./components/ConvertButton";
import { Portal } from "react-portal";
import { useFilesToConvert } from "./state";


export const App = () => {
  const { width } = useWindowSize();
  const workerRef = useRef<WorkerType | undefined>(undefined);
  const isDesktop = width >= 1090;
  const isTablet = width >= 850;
  const [files] = useFilesToConvert();
  useWorkerStatus(); // to trigger re-renders

  return (
    <WorkerRefContext.Provider value={workerRef}>
      <div className="bg-white min-h-screen">
        <div style={{ minHeight: '100vh' }}>
          <header className="border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-16">
              <h1 className="text-6xl font-light text-black mb-6 leading-tight">Billedekonverter</h1>
              <p className="text-xl text-gray-600 font-light max-w-2xl leading-relaxed">
                En fuldt lokal billedkonverter. Ingen filer sendes nogen steder, da konverteringen sker helt lokalt.
              </p>
            </div>
          </header>

          <Portal>
            <div className={cn(
              "fixed z-20 space-y-4 w-full tablet:w-[50%] desktop:w-[30%] px-10 tablet:p-0",
              isTablet ? "right-6 top-3" : "grid grid-cols-1 bottom-6"
            )}>
              <Loader />
              <ReloadPrompt />
            </div>
          </Portal>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-6 py-16">
          {/* Trin 1: Billedupload */}
          <section className="mb-20">
            <ImageUpload />
          </section>

          {/* Trin 2: Indstillinger (vis kun hvis billeder er uploadet) */}
          {files.length > 0 && (
            <section className="mb-20">
              <ConversionSettings />
            </section>
          )}

          {/* Trin 3: Konverter og download (vis kun hvis billeder er uploadet) */}
          {files.length > 0 && (
            <section className="mb-20">
              <ConvertButton />
            </section>
          )}
          </main>
        </div>
          
        <About />
      </div>
    </WorkerRefContext.Provider>
  );
};
