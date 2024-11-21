import { useEffect, useState } from 'react';

// Custom Hook để phát hiện loại thiết bị
const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState('desktop'); // Mặc định là desktop

    useEffect(() => {
        // Hàm kiểm tra loại màn hình
        const detectDeviceType = () => {
            const width = window.innerWidth;
            if (width <= 640) {
                setDeviceType('mobile'); // Màn hình điện thoại
            } else if (width <= 768) {
                setDeviceType('tablet'); // Màn hình máy tính bảng
            } else {
                setDeviceType('desktop'); // Màn hình máy tính bàn
            }
        };

        // Kiểm tra khi component được mount
        detectDeviceType();

        // Lắng nghe sự thay đổi kích thước màn hình
        window.addEventListener('resize', detectDeviceType);

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            window.removeEventListener('resize', detectDeviceType);
        };
    }, []);

    return deviceType;
};

export default useDeviceType;
