import { createContext, useContext } from "react";
import { VideoContextType } from "../types";
export const VideoContext = createContext<VideoContextType | undefined>(undefined);
// Hook tiện lợi để sử dụng context
export const useVideoContext = (): VideoContextType => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error("useVideoContext must be used within a VideoProvider");
    }
    return context;
};