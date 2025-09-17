import React, { useState, useRef } from "react";
import { useFilesToConvert, useFormat } from "$/state";
import { DragDropFile } from "./DragDropFile";
import { IoImageOutline, IoClose, IoAdd } from "react-icons/io5";
import { FileStatus } from "$/constants";
import { getImageDimensions } from "$/utils/getImageDimensions";

interface AddMoreButtonProps {
  onFileSelect: (files: File[]) => void;
}

const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onFileSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "");
    input.setAttribute("accept", "image/*");
    input.style.display = "none";

    input.addEventListener("change", () => {
      const files = Array.from(input.files!);
      onFileSelect(files);
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  return (
    <div className="relative bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-4 group hover:shadow-md transition-all duration-200">
      <button
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors
          ${isHovered ? 'text-gray-700' : ''}
        `}
      >
        <div className="space-y-3 w-full">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <IoAdd className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-black text-center">
              Tilføj flere billeder
            </h3>
            <p className="text-xs text-gray-500 text-center">
              Klik eller træk filer her
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export const ImageUpload: React.FC = () => {
  const [files, setFiles] = useFilesToConvert();
  const [format] = useFormat();
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  const [isLoadingDimensions, setIsLoadingDimensions] = useState(false);

  const handleFileSelect = async (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setIsLoadingDimensions(true);
      
      const newFileStatuses: FileStatus[] = await Promise.all(
        newFiles.map(async (file) => {
          try {
            const dimensions = await getImageDimensions(file);
            return {
              file,
              id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              status: "not-started" as const,
              convertTo: format as any,
              dimensions,
            };
          } catch (error) {
            console.error('Failed to load dimensions for', file.name, error);
            return {
              file,
              id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              status: "not-started" as const,
              convertTo: format as any,
            };
          }
        })
      );

      setFiles(prev => [...prev, ...newFileStatuses]);
      
      // Create preview URLs for new files
      const newPreviewUrls = new Map(previewUrls);
      newFiles.forEach(file => {
        const fileId = newFileStatuses.find(f => f.file === file)?.id;
        if (fileId) {
          newPreviewUrls.set(fileId, URL.createObjectURL(file));
        }
      });
      setPreviewUrls(newPreviewUrls);
      
      setIsLoadingDimensions(false);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    
    // Clean up preview URL
    const url = previewUrls.get(fileId);
    if (url) {
      URL.revokeObjectURL(url);
      const newPreviewUrls = new Map(previewUrls);
      newPreviewUrls.delete(fileId);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const handleRemoveAllFiles = () => {
    // Clean up all preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls(new Map());
    setFiles([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light text-black">
          Upload billeder {files.length > 0 && `(${files.length})`}
        </h2>
        <div className="flex items-center space-x-4">
          {isLoadingDimensions && (
            <div className="text-sm text-gray-500">
              Indlæser dimensioner...
            </div>
          )}
          {files.length > 0 && (
            <button
              onClick={handleRemoveAllFiles}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Fjern alle
            </button>
          )}
        </div>
      </div>
      
      {files.length === 0 ? (
        <DragDropFile
          text="Træk billeder her eller klik for at vælge flere"
          handleFiles={handleFileSelect}
          acceptableFileTypes="image/*"
        />
      ) : (
        <div className="space-y-6">
          {/* Thumbnail grid with add more button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((fileStatus) => {
              const previewUrl = previewUrls.get(fileStatus.id);
              return (
                <div
                  key={fileStatus.id}
                  className="relative bg-white border border-gray-200 rounded-xl p-4 group hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => handleRemoveFile(fileStatus.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Fjern billede"
                  >
                    <IoClose className="w-4 h-4" />
                  </button>
                  
                  <div className="space-y-3">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <IoImageOutline className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-black truncate">
                        {fileStatus.file.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-gray-500">
                        {fileStatus.file.type}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Add more files button - same dimensions as thumbnails */}
            <AddMoreButton onFileSelect={handleFileSelect} />
          </div>
        </div>
      )}
    </div>
  );
};
