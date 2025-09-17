import React from "react";
import { useScale, useScaleMode, useMaxWidth } from "$/state";
import { useFilesToConvert } from "$/state";
import { IoRefresh } from "react-icons/io5";

const scaleOptions = [
  { label: "100%", value: 100, description: "Original størrelse" },
  { label: "75%", value: 75, description: "Tre fjerdedele størrelse" },
  { label: "50%", value: 50, description: "Halv størrelse" },
  { label: "25%", value: 25, description: "Kvart størrelse" }
];

const maxWidthOptions = [
  { label: "XL", value: 1500, description: "Ekstra stor (1500px)" },
  { label: "Meget stor", value: 1000, description: "Meget stor (1000px)" },
  { label: "Stor", value: 750, description: "Stor (750px)" },
  { label: "Medium", value: 500, description: "Medium (500px)" },
  { label: "Lille", value: 250, description: "Lille (250px)" },
  { label: "Meget lille", value: 125, description: "Meget lille (125px)" },
  { label: "Ekstra lille", value: 75, description: "Ekstra lille (75px)" },
  { label: "Tiny", value: 32, description: "Tiny (32px)" }
];

export const ScaleSlider: React.FC = () => {
  const [scaleMode, setScaleMode] = useScaleMode();
  const [scale, setScale] = useScale();
  const [maxWidth, setMaxWidth] = useMaxWidth();
  const [filesToConvert] = useFilesToConvert();

  const resetScale = () => setScale(100);
  const resetMaxWidth = () => setMaxWidth(1000);

  // Find all files with dimensions
  const filesWithDimensions = filesToConvert.filter(file => file.dimensions);

  const calculateNewDimensions = (originalWidth: number, originalHeight: number) => {
    if (scaleMode === 'scale') {
      return {
        width: Math.round(originalWidth * (scale / 100)),
        height: Math.round(originalHeight * (scale / 100))
      };
    } else {
      // For max width, maintain aspect ratio
      const ratio = originalHeight / originalWidth;
      const newWidth = Math.min(originalWidth, maxWidth);
      const newHeight = Math.round(newWidth * ratio);
      return { width: newWidth, height: newHeight };
    }
  };

  // Calculate new dimensions for all files
  const filesWithNewDimensions = filesWithDimensions.map(file => ({
    ...file,
    newDimensions: calculateNewDimensions(file.dimensions!.width, file.dimensions!.height)
  }));

  const currentValue = scaleMode === 'scale' ? scale : maxWidth;
  const currentOptions = scaleMode === 'scale' ? scaleOptions : maxWidthOptions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xl font-light text-black">
          Ændre størrelse
        </label>
        <button
          onClick={scaleMode === 'scale' ? resetScale : resetMaxWidth}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-black transition-colors"
          title={`Nulstil til ${scaleMode === 'scale' ? '100%' : 'Meget stor'}`}
        >
          <IoRefresh className="w-4 h-4" />
          <span>Nulstil</span>
        </button>
      </div>

      {/* Mode Switch */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setScaleMode('scale')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            scaleMode === 'scale'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          Skala
        </button>
        <button
          onClick={() => setScaleMode('maxWidth')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            scaleMode === 'maxWidth'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          Maks bredde
        </button>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {currentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              if (scaleMode === 'scale') {
                setScale(option.value);
              } else {
                setMaxWidth(option.value);
              }
            }}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md
              ${currentValue === option.value
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white text-black hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-medium">
                {option.label}
                {((scaleMode === 'scale' && option.value === 100) || 
                  (scaleMode === 'maxWidth' && option.value === 1000)) && (
                  <span className="text-sm font-normal text-gray-400 ml-2">(standard)</span>
                )}
              </span>
              <span className={`text-sm font-mono ${
                currentValue === option.value ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {scaleMode === 'scale' ? `${option.value}%` : `${option.value}px`}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              currentValue === option.value ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>
      
      {filesWithNewDimensions.length > 0 && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-base text-gray-600">
            <div className="font-medium mb-3 text-black">
              Dimensioner {filesWithNewDimensions.length > 1 && `(${filesWithNewDimensions.length} billeder)`}
            </div>
            <div className="space-y-4">
              {filesWithNewDimensions.map((file, index) => (
                <div key={file.id} className="space-y-2">
                  {filesWithNewDimensions.length > 1 && (
                    <div className="text-sm font-medium text-gray-700 truncate">
                      {file.file.name}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Original:</span>
                      <span className="font-mono text-black">
                        {file.dimensions!.width} × {file.dimensions!.height}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Resultat:</span>
                      <span className="font-mono text-black">
                        {file.newDimensions.width} × {file.newDimensions.height}
                      </span>
                    </div>
                  </div>
                  {index < filesWithNewDimensions.length - 1 && (
                    <div className="border-t border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {filesWithDimensions.length === 0 && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-base text-gray-500">
            Upload billeder for at se dimensionsforhåndsvisning
          </div>
        </div>
      )}
    </div>
  );
};
