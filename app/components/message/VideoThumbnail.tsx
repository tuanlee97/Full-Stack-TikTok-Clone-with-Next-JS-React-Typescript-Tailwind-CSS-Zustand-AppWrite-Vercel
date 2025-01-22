import useGenerateThumbnail from '@/app/hooks/useGenerateThumbnail';
import React, { useEffect } from 'react';
import { IoPlayCircleOutline } from "react-icons/io5";
type Props = {
    file: File;
};

const VideoThumbnail: React.FC<Props> = ({ file }) => {
    const { thumbnail, loading, error, generateThumbnail } = useGenerateThumbnail();
    useEffect(() => {
        generateThumbnail(file);
    }, [file, generateThumbnail]);

    if (loading) {
        return <p>Loading thumbnail...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            {thumbnail ? (
                <div className="relative">
                    <IoPlayCircleOutline
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl"
                        color="#FFFFFF"
                        size={26}
                    />
                    <img
                        src={thumbnail.url}
                        alt="Video Thumbnail"
                        className="w-20 h-20 object-cover rounded-md"
                        draggable={false}
                    />
                </div>
            ) : (
                <p>No thumbnail available</p>
            )}
        </div>
    );
};

export default VideoThumbnail;
