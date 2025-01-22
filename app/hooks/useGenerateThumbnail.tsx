import { useCallback, useState } from 'react';
import { Thumbnail } from '../types';

// Định nghĩa kiểu dữ liệu cho thumbnail


const useGenerateThumbnail = () => {
    const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Hàm tạo thumbnail cho một file (video hoặc hình ảnh)
    const generateThumbnail = useCallback(async (file: File): Promise<Thumbnail | null> => {
        setLoading(true);
        setError(null);

        try {
            // Kiểm tra xem tệp có phải là hình ảnh hay không
            if (file.type.startsWith('image/')) {
                // Nếu là hình ảnh, trả về URL của hình ảnh với kích thước 100x100
                const reader = new FileReader();
                return new Promise<Thumbnail>((resolve, reject) => {
                    reader.onloadend = () => {
                        const img = new Image();
                        img.src = reader.result as string;

                        img.onload = () => {
                            // Tạo canvas để vẽ ảnh với kích thước 100x100
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            if (context) {
                                canvas.width = 100;
                                canvas.height = 100;
                                context.drawImage(img, 0, 0, 100, 100);
                                const thumbnailDataURL = canvas.toDataURL();
                                const thumbnail: Thumbnail = { url: thumbnailDataURL, type: 'image', file: file };
                                setThumbnail(thumbnail); // Cập nhật thumbnail
                                resolve(thumbnail); // Trả về thumbnail
                            }
                        };
                        img.onerror = () => reject(new Error('Error loading image file.'));
                    };
                    reader.onerror = () => reject(new Error('Error reading image file.'));
                    reader.readAsDataURL(file);
                });
            }

            // Nếu là video, tạo thumbnail từ video với kích thước 100x100
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                const objectURL = URL.createObjectURL(file);

                video.src = objectURL;
                video.load();

                return await new Promise<Thumbnail | null>((resolve, reject) => {
                    video.onloadeddata = () => {
                        video.currentTime = 1; // Chọn thời điểm 1 giây để lấy frame
                    };

                    video.onseeked = () => {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');

                        if (context) {
                            // Vẽ thumbnail với kích thước 100x100
                            canvas.width = 100;
                            canvas.height = 100;

                            context.drawImage(video, 0, 0, 100, 100);

                            const thumbnailDataURL = canvas.toDataURL();
                            const thumbnail: Thumbnail = { url: thumbnailDataURL, type: 'video', file: file };
                            setThumbnail(thumbnail); // Cập nhật thumbnail
                            resolve(thumbnail); // Trả về thumbnail
                        } else {
                            reject(new Error('Canvas context is not available.'));
                        }

                        URL.revokeObjectURL(objectURL); // Dọn dẹp bộ nhớ
                    };

                    video.onerror = () => {
                        reject(new Error('Error loading video file.'));
                    };
                });
            }

            return null; // Nếu không phải hình ảnh hoặc video, trả về null
        } catch (err) {
            setError((err as Error).message || 'Error generating thumbnail');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm tạo thumbnail cho nhiều file (video hoặc hình ảnh)
    const generateThumbnails = useCallback(async (files: File[]): Promise<Thumbnail[]> => {
        setLoading(true);
        setError(null);

        try {
            const thumbnails = await Promise.all(
                files.map(file => generateThumbnail(file))
            );

            // Lọc ra các thumbnail hợp lệ (không phải null)
            return thumbnails.filter((thumbnail): thumbnail is Thumbnail => thumbnail !== null);
        } catch (err) {
            setError((err as Error).message || 'Error generating thumbnails');
            return []; // Trả về mảng rỗng nếu có lỗi
        } finally {
            setLoading(false);
        }
    }, [generateThumbnail]);

    return { thumbnail, loading, error, generateThumbnail, generateThumbnails };
};

export default useGenerateThumbnail;