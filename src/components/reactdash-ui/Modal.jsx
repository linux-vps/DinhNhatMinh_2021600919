import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'react-bootstrap-icons';
import { Button } from '@/components/reactdash-ui';

export default function Modal(props) {
  // Props ( btn_text, btn_color, title, isOpen, onClose )
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Handle controlled vs uncontrolled mode
  const isControlled = props.isOpen !== undefined;
  const isDialogOpen = isControlled ? props.isOpen : internalOpen;
  
  console.log("Modal props:", { 
    isControlled, 
    isOpen: props.isOpen, 
    isDialogOpen, 
    title: props.title 
  });

  useEffect(() => {
    console.log("Modal isOpen changed:", props.isOpen);
  }, [props.isOpen]);

  // close 
  function closeModal() {
    console.log("closeModal called");
    if (isControlled) {
      props.onClose && props.onClose();
    } else {
      setInternalOpen(false);
    }
  }
  
  // open
  function openModal() {
    console.log("openModal called");
    setInternalOpen(true);
  }

  // Render
  if (!isControlled && !props.btn_text) {
    return null; // Don't render anything in uncontrolled mode without a button
  }

  return (
    <>
      {/* Only render button if btn_text is provided (uncontrolled mode) */}
      {!isControlled && props.btn_text && (
      <div className="relative">
          <Button onClick={openModal} type="button" color={props.btn_color}>
            {props.btn_text}
        </Button>
      </div>
      )}

      {isDialogOpen && (
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          open={isDialogOpen}
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {props.title || ""}
                  </Dialog.Title>
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="mt-2">
                {props.children}
                  </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}