import React, { useState } from 'react';

interface SwitchProps {
    initialState?: boolean;
    onChange?: (state: boolean) => void;
    label: string;
}

const Switch: React.FC<SwitchProps> = ({ initialState = false, onChange, label }) => {
    const [isOn, setIsOn] = useState<boolean>(initialState);

    const toggleSwitch = () => {
        const newState = !isOn;
        setIsOn(newState);
        if (onChange) {
            onChange(newState);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <div
                onClick={toggleSwitch}
                className={`inline-block w-16 h-8 rounded-full relative cursor-pointer ${isOn ? 'bg-[#D3427A]' : 'bg-gray-400'}`}
            >
                <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-200 ${isOn ? 'left-8' : 'left-1'}`}
                ></div>
            </div>
        </div>
    );
};

export default Switch;
