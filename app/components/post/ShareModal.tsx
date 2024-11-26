import { ShareModalProps } from '@/app/types';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Icon đóng modal



const ShareModal: React.FC<ShareModalProps> = ({ isOpen, closeModal, postUrl, postText }) => {
    // Mở hoặc đóng modal dựa trên trạng thái isOpen
    if (!isOpen) return null;
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const handleShare = (platform: string) => {
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postText)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=Check this out&body=${encodeURIComponent(postText)}%0A${encodeURIComponent(postUrl)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(postText)}&text=${encodeURIComponent(postText)}`;
                break;
            default:
                break;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                setCopyStatus('Link copied to clipboard!');
                // Sau 2 giây, reset lại thông báo
                setTimeout(() => setCopyStatus(null), 2000);
            })
            .catch((err) => {
                setCopyStatus('Failed to copy link!');
                // Sau 2 giây, reset lại thông báo
                setTimeout(() => setCopyStatus(null), 2000);
            });
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg py-5 px px-6 w-[300px] sm:w-[500px]">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Share This Post</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-black">
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-4 gap-4">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="flex flex-col items-center justify-center rounded-full text-sm font-semibold gap-1"
                        >
                            <svg width={56} height={56} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" id="facebook">
                                <path fill="#1877f2" d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z" />
                                <path fill="#fff" d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z" />
                            </svg>
                            Facebook
                        </button>
                        <button
                            onClick={() => handleShare('twitter')}
                            className="flex flex-col items-center justify-center rounded-full text-sm font-semibold gap-1"
                        >
                            <svg width={56} height={56} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 24 24" xmlSpace="preserve"><g><polygon points="12.153992,10.729553 8.088684,5.041199 5.92041,5.041199 10.956299,12.087097 11.59021,12.97345    15.900635,19.009583 18.068909,19.009583 12.785217,11.615906  " /><path d="M21.15979,1H2.84021C1.823853,1,1,1.823853,1,2.84021v18.31958C1,22.176147,1.823853,23,2.84021,23h18.31958   C22.176147,23,23,22.176147,23,21.15979V2.84021C23,1.823853,22.176147,1,21.15979,1z M15.235352,20l-4.362549-6.213013   L5.411438,20H4l6.246887-7.104675L4,4h4.764648l4.130127,5.881958L18.06958,4h1.411377l-5.95697,6.775635L20,20H15.235352z" /></g></svg>

                            X
                        </button>
                        <button
                            onClick={() => handleShare('email')}
                            className="flex flex-col items-center justify-center rounded-full text-sm font-semibold gap-1"
                        >
                            <svg className="css-0" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width={56} height={56}><path fillRule="evenodd" clipRule="evenodd" d="M24 48a24 24 0 1 0 0-48 24 24 0 0 0 0 48Z" fill="#0DBEF3" /><path fillRule="evenodd" clipRule="evenodd" d="M13.63 14.9a2.1 2.1 0 0 0-2.09 2.09V31c0 1.16.94 2.1 2.1 2.1h20.73a2.1 2.1 0 0 0 2.09-2.1V17a2.1 2.1 0 0 0-2.1-2.1H13.64Zm20.1 2.48L24 24.11l-9.72-6.73a.52.52 0 0 0-.82.43v1.28L24 26.4l10.54-7.3v-1.28a.52.52 0 0 0-.82-.43Z" fill="#fff" /></svg>
                            Email

                        </button>
                        <button
                            onClick={() => handleShare('telegram')}
                            className="flex flex-col items-center justify-center rounded-full text-sm font-semibold gap-1"
                        >
                            <svg width={56} height={56} id="Layer_1" version="1.1" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><style type="text/css" dangerouslySetInnerHTML={{ __html: "\n\t.st0{fill:url(#SVGID_1_);}\n\t.st1{fill:#FFFFFF;}\n\t.st2{fill:#D2E4F0;}\n\t.st3{fill:#B5CFE4;}\n" }} /><g><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_1_" x1={256} x2={256} y1={0} y2="510.1322"><stop offset={0} style={{ stopColor: '#41BCE7' }} /><stop offset={1} style={{ stopColor: '#22A6DC' }} /></linearGradient><circle className="st0" cx={256} cy={256} r={256} /><g><path className="st1" d="M380.6,147.3l-45.7,230.5c0,0-6.4,16-24,8.3l-105.5-80.9L167,286.7l-64.6-21.7c0,0-9.9-3.5-10.9-11.2    c-1-7.7,11.2-11.8,11.2-11.8l256.8-100.7C359.5,141.2,380.6,131.9,380.6,147.3z" /><path className="st2" d="M197.2,375.2c0,0-3.1-0.3-6.9-12.4c-3.8-12.1-23.3-76.1-23.3-76.1l155.1-98.5c0,0,9-5.4,8.6,0    c0,0,1.6,1-3.2,5.4c-4.8,4.5-121.8,109.7-121.8,109.7" /><path className="st3" d="M245.8,336.2l-41.7,38.1c0,0-3.3,2.5-6.8,0.9l8-70.7" /></g></g></svg>
                            Telegram
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="flex flex-col items-center justify-center  text-sm font-semibold gap-1"
                        >
                            <div className='w-[56px] h-[56px] flex justify-center items-center rounded-full border-2 border-black'>
                                <svg className="bi bi-link-45deg" fill="currentColor" height={46} viewBox="0 0 16 16" width={46} xmlns="http://www.w3.org/2000/svg"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" /><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" /></svg>
                            </div>
                            Copy Link
                        </button>
                    </div>
                    {/* Hiển thị thông báo sao chép thành công */}
                    {copyStatus && (
                        <div className="mt-3 text-center text-sm text-green-600">
                            {copyStatus}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
