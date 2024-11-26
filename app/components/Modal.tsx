// src/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="modal fixed inset-0 bg-black w-screen flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-lg bg-transparent border-none cursor-pointer"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
