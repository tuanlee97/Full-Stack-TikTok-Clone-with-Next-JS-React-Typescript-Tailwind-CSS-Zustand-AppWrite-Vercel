import { useVideoContext } from '@/app/context/video';
import useDeviceType from '@/app/hooks/useDeviceType';
import useUploadsUrl from '@/app/hooks/useUploadsUrl';
import { PostMainCompTypes } from '@/app/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { ImMusic } from 'react-icons/im';

const VideoControls = ({ post, isPaused, modalCurrentTime }: PostMainCompTypes & { isPaused: boolean, modalCurrentTime: number }) => {
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isHover, setIsHover] = useState(false);
    const { isMuted, setIsMuted } = useVideoContext();
    const [showVolumeControl, setShowVolumeControl] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            const postMainElement = document.getElementById(`PostMain-${post.id}`);

            if (postMainElement) {
                let observer = new IntersectionObserver(
                    (entries) => {
                        if (!entries[0].isIntersecting) {
                            video.pause();

                        } else {
                            // Khi video hiện thị trong viewport thì chay video
                            video.play().catch((err) => {
                                console.error("Error playing video:", err);
                            });

                        }
                    },
                    { threshold: [0.6] }
                );
                observer.observe(postMainElement);
            }
        }
    }, [post.id]);





    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        if (isPaused) videoRef.current.pause();
        else videoRef.current.play();


    }, [isPaused]);

    const togglePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.muted = false;
                videoRef.current.play().catch((err) => {
                    console.error("Error playing video:", err);
                });

            } else {
                videoRef.current.pause();
            }
        }
    }, []);

    const handleVolumeIconHover = () => {
        if (isMuted) return;
        setShowVolumeControl(true);
    };

    const handleVolumeIconLeave = () => {
        if (isMuted) return;
        setShowVolumeControl(false);
    };
    const toggleMute = useCallback(() => {
        setIsMuted(!isMuted);
    }, [isMuted]);

    useEffect(() => {
        if (videoRef.current)
            setIsMuted(videoRef.current?.muted);

    }, [videoRef.current?.muted]);
    useEffect(() => {
        if (videoRef.current)
            videoRef.current.currentTime = modalCurrentTime;
    }, [modalCurrentTime]);

    const handleClickDuration = useCallback((e: React.MouseEvent) => {
        const progressBar = e.currentTarget as HTMLElement;
        const clickedPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        if (videoRef.current) {
            videoRef.current.currentTime = clickedPosition * videoRef.current.duration;
        }
    }, []);
    const handleMouseDown = () => {
        setIsDragging(true);
        videoRef.current?.pause();
    };
    const handleMouseHover = () => {
        setIsHover(prev => !prev);
    };

    // Hàm xử lý kết thúc kéo thanh
    const handleMouseUp = () => {
        setIsDragging(false);
        videoRef.current?.play();
    };

    // Hàm xử lý kéo thanh
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !videoRef.current) return;
        ;
        const progressBar = e.currentTarget as HTMLElement; // Ép kiểu thành HTMLElement

        let clientX: number;
        if ("touches" in e) {
            // Nếu là sự kiện cảm ứng (touch)
            clientX = e.touches[0].clientX;
        } else {
            // Nếu là sự kiện chuột (mouse)
            clientX = e.clientX;
        }

        const draggedPosition =
            (clientX - progressBar.getBoundingClientRect().left) /
            progressBar.offsetWidth;

        videoRef.current.currentTime = draggedPosition * videoRef.current.duration;

    };
    const deviceType = useDeviceType();
    return (
        <>
            <video
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onClick={togglePlayPause}
                ref={videoRef}
                id={`video-${post.id}`}
                loop
                muted={isMuted}
                autoPlay
                playsInline
                preload="auto"
                className="sm:rounded-xl object-cover mx-auto h-full"
                src={useUploadsUrl(post?.video_url)}
                onTimeUpdate={handleTimeUpdate}
            />

            <div
                onMouseEnter={handleVolumeIconHover}
                onMouseLeave={handleVolumeIconLeave}
                className="p-4 flex justify-center items-center volume-control absolute left-0 top-0"
            >
                <label htmlFor="volume">
                    {
                        isMuted ?
                            <FiVolumeX onClick={toggleMute} size={25} color="#FFFFFFE6" /> :
                            <FiVolume2 onClick={toggleMute} size={25} color="#FFFFFFE6" />
                    }


                </label>


                <div className={`${!isMuted && showVolumeControl ? 'opacity-100' : 'opacity-0 '} duration-100 ease-in ml-1 mt-1 bg-black/40 px-4 pt-2 pb-1 rounded-full`}>
                    <input
                        type="range"
                        className="volume-progress accent-white/80"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>

            </div>
            <div
                className="duration-control absolute left-0 bottom-0 z-10 w-full h-[4px] hover:h-[6px] sm:h-[8px] sm:hover:h-[10px] duration-200 bg-white/30"
                onClick={handleClickDuration}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseHover}
                onMouseLeave={handleMouseHover}

            >
                {videoRef.current && (
                    <>
                        <div
                            className="h-full bg-white/90 sm:bg-progress "
                            style={
                                deviceType !== 'mobile' ?
                                    {
                                        clipPath: 'inset(0px round 0px 0px 0px 0.5rem)',
                                        width: `${(videoRef.current.currentTime /
                                            videoRef.current.duration) *
                                            100}%`,
                                    } :
                                    {

                                        width: `${(videoRef.current.currentTime /
                                            videoRef.current.duration) *
                                            100}%`,
                                    }
                            }
                        ></div>

                        <div
                            className="circle-progress absolute z-10 -translate-y-1/2 w-2 h-2 sm:w-4 sm:h-4 rounded-full border bg-white shadow-xl top-1/2"
                            style={{
                                left: `${(currentTime / videoRef.current.duration) *
                                    100}%`,
                            }}
                        />

                    </>
                )}
            </div>
            <div className={`${isDragging ? 'opacity-50' : 'opacity-100'} absolute sm:rounded-xl left-0 w-full bottom-0 p-4 text-white text-sm bg-gradient-to-t from-black to-transparent`}>
                <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px] font-semibold">{post.profile.name}</p>
                <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">{post.text}</p>
                <p className="text-[14px] text-white pb-0.5">#fun #cool #SuperAwesome</p>
                <p className="text-[14px] pb-0.5 flex items-center ">
                    <ImMusic size="14" />
                    <span className="px-1">original sound - AWESOME</span>
                </p>
            </div>
        </>
    );
};

export default VideoControls;
