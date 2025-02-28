// src/Modal.tsx
import React from 'react';

interface ModalProps {
    customClassName?: string;
    isOpen: boolean;
    showClose?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, customClassName, showClose = true, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className={`rounded-t-3xl shadow-white shadow-2xl ${customClassName ?? ''} modal fixed sm:max-h-full left-0 bottom-0 sm:inset-0  w-screen bg-transparent flex justify-center items-center z-40`}
            onClick={onClose}
        >
            <div
                className="sm:bg-white  w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                {
                    showClose &&
                    <button
                        className="absolute top-2 right-2 text-5xl bg-transparent border-none cursor-pointer"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                }

                {children}
            </div>
        </div>
    );
};

export default Modal;
