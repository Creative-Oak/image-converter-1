import React from "react";
import { useFormat, useQuality, useScale } from "$/state";
import { QualitySlider } from "./QualitySlider";
import { ScaleSlider } from "./ScaleSlider";
import { imageFileTypes } from "$/constants";
import { IoRefresh } from "react-icons/io5";

const formatDescriptions = {
  JPG: "Bedst til fotos med mange farver. Mindre filstørrelser men tabt komprimering.",
  PNG: "Bedst til billeder med gennemsigtighed eller skarpe kanter. Tabløs komprimering.",
  GIF: "Bedst til simple grafikker og animationer. Begrænset til 256 farver.",
  WEBP: "Moderne format med fremragende komprimering. God balance mellem kvalitet og filstørrelse."
};

export const ConversionSettings: React.FC = () => {
  const [format, setFormat] = useFormat();
  const [quality, setQuality] = useQuality();
  const [scale, setScale] = useScale();

  const resetFormat = () => setFormat("WEBP");
  const resetQuality = () => setQuality(90);
  const resetScale = () => setScale(100);

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-light text-black">Konverteringsindstillinger</h2>
      
      {/* Format Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xl font-light text-black">
            Outputformat
          </label>
          <button
            onClick={resetFormat}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-black transition-colors"
            title="Nulstil til WEBP"
          >
            <IoRefresh className="w-4 h-4" />
            <span>Nulstil</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageFileTypes.map((fileType) => (
            <button
              key={fileType}
              onClick={() => setFormat(fileType)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md
                ${format === fileType
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-black hover:border-gray-300'
                }
              `}
            >
              <div className="mb-2">
                <span className="text-lg font-medium">
                  {fileType}
                  {fileType === "WEBP" && (
                    <span className="text-sm font-normal text-gray-400 ml-2">(standard)</span>
                  )}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${
                format === fileType ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {formatDescriptions[fileType]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Quality and Scale Settings */}
      <div className="space-y-10">
        <QualitySlider />
        <ScaleSlider />
      </div>
    </div>
  );
};
