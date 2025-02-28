import React from 'react';

interface ConfirmationDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <p className="text-lg text-center mb-6">{message}</p>
                <div className="flex justify-around">

                    <button
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
