import React, { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Transition } from "@headlessui/react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import sparkles from "$/assets/svg/sparkles.svg";

export const ReloadPrompt: React.FC = () => {
  const [display, setDisplay] = useState(false);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onOfflineReady() {
      setDisplay(true);
      setTimeout(() => setDisplay(false), 3000);
    },
    onNeedRefresh() {
      setDisplay(true);
    },
  });


  return (
    <Transition
      show={display}
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="toast">
        <div className="flex">
          <div className="flex flex-grow items-center space-x-3 p-4">
            <span className="text-2xl">
              {offlineReady && <IoCheckmarkCircle className="text-green-600" />}
              {needRefresh && (
                <img
                  className="select-none pointer-events-none"
                  width={24}
                  src={sparkles}
                />
              )}
            </span>
            <span className="text-lg font-light">
              {offlineReady && "Billedekonverter er klar til at arbejde offline!"}
              {needRefresh && "En ny opdatering er klar!"}
            </span>
            <div className="flex-grow"></div>
            {needRefresh && (
              <button
                className="font-medium focus:underline text-black hover:text-gray-600 active:text-gray-800 transition-colors"
                onClick={() => updateServiceWorker(true)}
              >
                Opdater
              </button>
            )}
          </div>

          {needRefresh && (
            <button
              className="flex border-l-2 border-gray-200 justify-center items-center p-3 active:bg-gray-100 duration-150 hover:bg-gray-50"
              onClick={() => setDisplay(false)}
            >
              <IoClose className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </Transition>
  );
};
