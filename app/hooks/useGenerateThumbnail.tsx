import { useCallback, useState } from "react";
import { Thumbnail } from "../types";

const HD_WIDTH = 1280; // Độ rộng HD
const HD_HEIGHT = 720; // Độ cao HD

const useGenerateThumbnail = () => {
    const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Hàm tạo thumbnail giữ nguyên tỉ lệ ảnh nhưng giảm dung lượng
    const generateThumbnail = useCallback(
        async (file: File): Promise<Thumbnail | null> => {
            setLoading(true);
            setError(null);

            try {
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    return new Promise<Thumbnail>((resolve, reject) => {
                        reader.onloadend = () => {
                            const img = new Image();
                            img.src = reader.result as string;

                            img.onload = () => {
                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");

                                if (context) {
                                    // Giữ nguyên tỉ lệ ảnh
                                    let { width, height } = img;
                                    if (width > HD_WIDTH || height > HD_HEIGHT) {
                                        const ratio = Math.min(HD_WIDTH / width, HD_HEIGHT / height);
                                        width = Math.round(width * ratio);
                                        height = Math.round(height * ratio);
                                    }

                                    canvas.width = width;
                                    canvas.height = height;
                                    context.drawImage(img, 0, 0, width, height);

                                    // Giảm dung lượng ảnh (JPEG với chất lượng 0.7)
                                    const thumbnailDataURL = canvas.toDataURL("image/jpeg", 0.7);
                                    const thumbnail: Thumbnail = { url: thumbnailDataURL, type: "image", file: file };
                                    setThumbnail(thumbnail);
                                    resolve(thumbnail);
                                }
                            };
                            img.onerror = () => reject(new Error("Error loading image file."));
                        };
                        reader.onerror = () => reject(new Error("Error reading image file."));
                        reader.readAsDataURL(file);
                    });
                }

                if (file.type.startsWith("video/")) {
                    const video = document.createElement("video");
                    const objectURL = URL.createObjectURL(file);
                    video.src = objectURL;
                    video.load();

                    return new Promise<Thumbnail | null>((resolve, reject) => {
                        video.onloadeddata = () => {
                            video.currentTime = 1;
                        };

                        video.onseeked = () => {
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");

                            if (context) {
                                let width = video.videoWidth;
                                let height = video.videoHeight;

                                if (width > HD_WIDTH || height > HD_HEIGHT) {
                                    const ratio = Math.min(HD_WIDTH / width, HD_HEIGHT / height);
                                    width = Math.round(width * ratio);
                                    height = Math.round(height * ratio);
                                }

                                canvas.width = width;
                                canvas.height = height;
                                context.drawImage(video, 0, 0, width, height);

                                const thumbnailDataURL = canvas.toDataURL("image/jpeg", 0.7);
                                const thumbnail: Thumbnail = { url: thumbnailDataURL, type: "video", file: file };
                                setThumbnail(thumbnail);
                                resolve(thumbnail);
                            } else {
                                reject(new Error("Canvas context is not available."));
                            }

                            URL.revokeObjectURL(objectURL);
                        };

                        video.onerror = () => reject(new Error("Error loading video file."));
                    });
                }

                return null;
            } catch (err) {
                setError((err as Error).message || "Error generating thumbnail");
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const generateThumbnails = useCallback(
        async (files: File[]): Promise<Thumbnail[]> => {
            setLoading(true);
            setError(null);

            try {
                const thumbnails = await Promise.all(files.map((file) => generateThumbnail(file)));
                return thumbnails.filter((thumbnail): thumbnail is Thumbnail => thumbnail !== null);
            } catch (err) {
                setError((err as Error).message || "Error generating thumbnails");
                return [];
            } finally {
                setLoading(false);
            }
        },
        [generateThumbnail]
    );

    return { thumbnail, loading, error, generateThumbnail, generateThumbnails };
};

export default useGenerateThumbnail;
