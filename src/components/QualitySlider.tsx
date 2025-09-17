import React from "react";
import { useQuality } from "$/state";
import { IoRefresh } from "react-icons/io5";

const qualityOptions = [
  { label: "Fuld", value: 100, description: "Maksimal kvalitet, største filstørrelse" },
  { label: "Meget god", value: 95, description: "Høj kvalitet, god komprimering" },
  { label: "God", value: 80, description: "Balanceret kvalitet og filstørrelse" },
  { label: "Medium", value: 60, description: "Moderat kvalitet, mindre filer" },
  { label: "Lav", value: 40, description: "Lav kvalitet, mindste filer" }
];

export const QualitySlider: React.FC = () => {
  const [quality, setQuality] = useQuality();

  const resetQuality = () => setQuality(90);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xl font-light text-black">
          Kvalitet
        </label>
        <button
          onClick={resetQuality}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-black transition-colors"
          title="Nulstil til Meget god"
        >
          <IoRefresh className="w-4 h-4" />
          <span>Nulstil</span>
        </button>
      </div>
      <div className="space-y-3">
        {qualityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setQuality(option.value)}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md
              ${quality === option.value
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white text-black hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-medium">
                {option.label}
                {option.value === 95 && (
                  <span className="text-sm font-normal text-gray-400 ml-2">(standard)</span>
                )}
              </span>
              <span className={`text-sm font-mono ${
                quality === option.value ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {option.value}%
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              quality === option.value ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
