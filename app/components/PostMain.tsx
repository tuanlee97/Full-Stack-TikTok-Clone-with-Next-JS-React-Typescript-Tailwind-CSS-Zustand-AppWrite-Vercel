import { useState } from "react";
import { PostMainCompTypes } from "../types";

import PostMainLikes from "./PostMainLikes";
import VideoControls from "./post/VideoControls";

export default function PostMain({ post }: PostMainCompTypes) {
    const [isPaused, setIsPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của video

    const handleModalClose = (modalCurrentTime: number) => {
        console.log("handleModalClose")
        setCurrentTime(modalCurrentTime); // Cập nhật lại currentTime từ modal về cha

    };
    const togglePlayPause = () => {
        setIsPaused(pre => !pre);
    }
    return (
        <section className="scroll-section h-full justify-center border-b items-center scroll-snap-align">
            <div id={`PostMain-${post.id}`} className="flex h-full">
                <div className="sm:pl-3 w-full sm:px-4">
                    <div className="sm:mt-2.5 flex justify-center h-full sm:h-[calc(100%-40px)]">
                        <div className="relative w-max flex items-center bg-black sm:rounded-xl cursor-pointer">
                            <VideoControls modalCurrentTime={currentTime} isPaused={isPaused} post={post} />
                        </div>
                        <PostMainLikes
                            togglePlayPause={togglePlayPause}
                            onModalClose={handleModalClose}
                            post={post} />
                    </div>
                </div>
            </div>
        </section>
    );
}
