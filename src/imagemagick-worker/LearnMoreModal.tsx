import React from "react";
import type { AProps } from "react-html-props";
import { Transition, Dialog, Disclosure } from "@headlessui/react";
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";

const A: React.FC<AProps> = (props) => (
  <a
    className="link"
    target="_blank"
    rel="noopener noreferrer nofollow"
    {...props}
  />
);

export const LearnMoreModal: React.FC<{
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}> = ({ openState }) => {
  let [isOpen, setIsOpen] = openState;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-30"
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md px-7 py-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-2xl mb-4 font-semibold leading-6 text-gray-900"
              >
                Hvad henter vi?
              </Dialog.Title>
              <div className="children:text-gray-500 space-y-3">
                <p>
                  For faktisk at konvertere filer lokalt, bruger vi dette fantastiske
                  software kaldet ImageMagick.
                </p>
                <p>ImageMagick er ret stort og fylder hele 20MB.</p>
                <p>
                  Bemærk venligst, at for at konvertere filer er det påkrævet
                  at hente ImageMagick.
                </p>

                <Disclosure as={React.Fragment}>
                  {({ open }) => (
                    <div className="border-2 rounded px-3 py-2 transition-[height] ease-in-out">
                      <Disclosure.Button className="flex items-center w-full font-semibold">
                        <p>Tekniske detaljer</p>
                        <div className="flex-grow" />
                        {open ? (
                          <IoChevronUpOutline />
                        ) : (
                          <IoChevronDownOutline />
                        )}
                      </Disclosure.Button>

                      <Disclosure.Panel className="mt-3 space-y-3">
                        <p>
                          ImageMagick til web er drevet af{" "}
                          <A href="https://webassembly.org/">WebAssembly</A>,{" "}
                          hvilket betyder, at det der downloades er en WebAssembly build.
                          WebAssembly er sandboxed og kører i sin egen virtuelle
                          maskine.
                        </p>
                        <p>
                          Den originale kilde til ImageMagick WASM biblioteket
                          kan ses her og de builds der bruges kan ses{" "}
                          <A href="https://github.com/dlemstra/magick-wasm">
                            her
                          </A>
                          .
                        </p>
                        <p>
                          Vi bruger også{" "}
                          <A href="https://github.com/strukturag/libheif">
                            libheif
                          </A>, 
                          som bruges til at konvertere HEIC billeder. Libheif har en Emscripten build tilgængelig{" "}
                          <A href="https://github.com/catdad-experiments/libheif-js">
                            her
                          </A>
                          . Den specifikke libheif build der bruges kan ses{" "}
                          <A href="https://gitlab.com/Armster15/heic-decode">
                            her
                          </A>
                          .
                        </p>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:shadow active:bg-blue-200 duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  Okay
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
