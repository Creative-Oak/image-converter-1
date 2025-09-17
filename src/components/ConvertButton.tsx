import React, { useState } from "react";
import { useFilesToConvert, useFormat, useQuality, useScale, useScaleMode, useMaxWidth } from "$/state";
import { useWorkerRefContext } from "$/imagemagick-worker";
import { convertFile } from "$/utils/convertFile";
import { IoSync, IoDownloadOutline, IoCheckmarkCircle } from "react-icons/io5";
import { LoadingIcon } from "./LoadingIcon";
import { FileStatus } from "$/constants";
import JSZip from "jszip";

export const ConvertButton: React.FC = () => {
  const [files, setFiles] = useFilesToConvert();
  const [format] = useFormat();
  const [quality] = useQuality();
  const [scale] = useScale();
  const [scaleMode] = useScaleMode();
  const [maxWidth] = useMaxWidth();
  const workerRef = useWorkerRefContext();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const [conversionResults, setConversionResults] = useState<Map<string, { success: boolean; url?: string; error?: string }>>(new Map());

  const handleConvert = async () => {
    if (files.length === 0 || !workerRef?.current) return;

    setIsConverting(true);
    setConversionProgress({ completed: 0, total: files.length });
    setConversionResults(new Map());

    try {
      // Update all files to in-progress status
      setFiles(prev => prev.map(f => ({ ...f, status: "in-progress" as const })));

      const results = new Map<string, { success: boolean; url?: string; error?: string }>();
      const convertedFiles: { name: string; data: Uint8Array }[] = [];
      let completed = 0;

      // Convert files one by one
      for (const fileStatus of files) {
        try {
          const result = await convertFile(
            fileStatus, 
            workerRef.current, 
            quality, 
            scaleMode === 'scale' ? scale : undefined,
            scaleMode === 'maxWidth' ? maxWidth : undefined
          );
          
          if (result.successData) {
            results.set(fileStatus.id, { 
              success: true, 
              url: result.successData.url 
            });
            
            // Generate descriptive filename: originalname_scale100_quality90.png
            const originalName = fileStatus.file.name.replace(/\.[^/.]+$/, "");
            const scaleText = scale !== 100 ? `_s${scale}` : '';
            const qualityText = quality !== 100 ? `_q${quality}` : '';
            const newFileName = `${originalName}${scaleText}${qualityText}.${format.toLowerCase()}`;
            
            // Store the converted file data for zip creation
            convertedFiles.push({
              name: newFileName,
              data: result.successData.data
            });
          } else {
            results.set(fileStatus.id, { 
              success: false, 
              error: "Konvertering fejlede" 
            });
          }
        } catch (error) {
          console.error(`Conversion failed for ${fileStatus.file.name}:`, error);
          results.set(fileStatus.id, { 
            success: false, 
            error: error instanceof Error ? error.message : "Ukendt fejl" 
          });
        }

        completed++;
        setConversionProgress({ completed, total: files.length });
      }

      setConversionResults(results);
      
      // Update file statuses
      setFiles(prev => prev.map(f => {
        const result = results.get(f.id);
        return {
          ...f,
          status: result?.success ? "success" : "failed",
          statusTooltip: result?.success ? "Konvertering færdig" : result?.error || "Konvertering fejlede"
        };
      }));

      // Create and download zip file if there are successful conversions
      if (convertedFiles.length > 0) {
        await createAndDownloadZip(convertedFiles);
      }

    } catch (error) {
      console.error('Batch conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const createAndDownloadZip = async (convertedFiles: { name: string; data: Uint8Array }[]) => {
    try {
      const zip = new JSZip();
      
      // Add each converted file to the zip
      convertedFiles.forEach(file => {
        zip.file(file.name, file.data);
      });
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Create download link for the zip file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      
      // Generate zip filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const zipFileName = `konverterede-billeder_${timestamp}.zip`;
      
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to create zip file:', error);
    }
  };

  if (files.length === 0) {
    return null;
  }

  const successfulConversions = Array.from(conversionResults.values()).filter(r => r.success).length;
  const isCompleted = conversionProgress.completed === conversionProgress.total && conversionProgress.total > 0;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-light text-black">
        Konverter og download {files.length > 1 && `(${files.length} billeder)`}
      </h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isConverting ? 'Konverterer billeder...' : 'Klar til konvertering'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {files.length} billede{files.length !== 1 ? 'r' : ''} → {format}
            </p>
            {isConverting && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Fremgang: {conversionProgress.completed}/{conversionProgress.total}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(conversionProgress.completed / conversionProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleConvert}
            disabled={isConverting || !workerRef?.current}
            className={`
              px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 border
              ${isConverting || !workerRef?.current
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : isCompleted
                ? 'bg-green-600 text-white hover:bg-green-700 border-green-600'
                : 'bg-black text-white hover:bg-gray-800 border-black'
              }
            `}
          >
            {isConverting ? (
              <>
                <LoadingIcon />
                <span>Konverterer...</span>
              </>
            ) : isCompleted ? (
              <>
                <IoCheckmarkCircle className="w-5 h-5" />
                <span>Færdig!</span>
              </>
            ) : (
              <>
                <IoSync className="w-5 h-5" />
                <span>Konverter og download ZIP</span>
              </>
            )}
          </button>
        </div>
        
        {isCompleted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Konvertering færdig! {successfulConversions}/{files.length} billeder konverteret succesfuldt og downloadet som ZIP-fil.
            </p>
            {successfulConversions < files.length && (
              <p className="text-sm text-orange-700 mt-1">
                ⚠️ {files.length - successfulConversions} billede(r) kunne ikke konverteres. Tjek konsollen for detaljer.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
