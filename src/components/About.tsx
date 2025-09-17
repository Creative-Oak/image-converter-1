import React from "react";
import { IoLockClosedOutline, IoLogoGithub } from "react-icons/io5";
import { MdOutlineWifiOff } from "react-icons/md";

export const About = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-light text-black mb-8">Hvorfor Billedekonverter?</h2>
        <p className="text-xl text-gray-600 mb-16 max-w-3xl leading-relaxed">
          Billedekonverter er ikke en almindelig billedkonverter. Al konvertering sker
          direkte i din browser. Med andre ord, intet uploades til en server,
          det er helt lokalt!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <IoLockClosedOutline className="text-2xl text-gray-600" />
              <h3 className="text-2xl font-light text-black">Sikker</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Da filkonverteringen er lokal, forlader intet din enhed.
              Dette betyder, at du sikkert kan bruge følsomme filer uden at
              bekymre dig om, at andre kan få adgang til dem, fordi vi
              ikke kan. Billedekonverter er rent klientside - der er ikke engang en server
              involveret!
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <MdOutlineWifiOff className="text-2xl text-gray-600" />
              <h3 className="text-2xl font-light text-black">Virker offline</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Beta</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Hvis du ikke er forbundet til internettet, kan du stadig bruge Billedekonverter!
              Prøv det selv: sluk for dit WiFi, opdater siden og prøv at
              konvertere et billede! Den eneste ulempe er, at du skal sørge for,
              at ImageMagick er blevet hentet fuldt ud, før du går offline, men
              når det er hentet, virker Billedekonverter offline!
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <IoLogoGithub className="text-2xl text-gray-600" />
              <h3 className="text-2xl font-light text-black">Open Source</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Billedekonverter er fuldt open source. Billedekonverter bruger også open source software,
              så du kan virkelig se, at Billedekonverter er 100% lokalt.
            </p>
            <a
              className="inline-block text-gray-600 hover:text-gray-900 underline text-sm transition-colors"
              href="https://github.com/Creative-Oak/image-converter-1"
              target="_blank"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
