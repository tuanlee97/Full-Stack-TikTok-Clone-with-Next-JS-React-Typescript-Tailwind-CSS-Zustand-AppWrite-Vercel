import { useEffect, useRef, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useUser } from '../context/user';
const BottomMenu: React.FC = () => {
    const userContext = useUser()
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ulRef = useRef<HTMLUListElement | null>(null);

    const toggleMenu = (): void => {
        setIsOpen(!isOpen);
    };
    const handleClickOutside = (event: MouseEvent): void => {
        if (ulRef.current && !ulRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="relative">

            <button
                onClick={toggleMenu}
                className=""
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#FFF"} fill={"none"}>
                    <path d="M4 5L20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 19L20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div
                className={`${isOpen ? 'opacity-100 fixed inset-0 z-10 bg-black/50 ' : 'opacity-0'} transition-opacity duration-300`}
            >
            </div>

            <div
                className={`fixed bottom-0 left-0 w-full z-20  text-white transition-transform duration-300 ${isOpen ? 'transform translate-y-0' : 'transform translate-y-full'}`}
            >
                <ul ref={ulRef} className="bg-[#1E1E1E] flex flex-col items-center py-4">

                    <li className="py-2 hover:bg-gray-700 w-full text-center">
                        <button
                            onClick={async () => {
                                await userContext?.logout()
                                setIsOpen(false)
                            }}
                            className="flex items-center justify-center w-full py-3 px-1.5 hover:bg-gray-100 cursor-pointer"
                        >
                            <FiLogOut size={20} />
                            <span className="pl-2 font-semibold ">Log out</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default BottomMenu;
