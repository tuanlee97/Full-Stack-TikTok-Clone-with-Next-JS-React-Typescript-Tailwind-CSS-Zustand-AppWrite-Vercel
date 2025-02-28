import { AiOutlineClose } from "react-icons/ai";
import useCheckBase64 from "../hooks/useCheckBase64";
import useUploadsUrl from "../hooks/useUploadsUrl";
import { Thumbnail } from "../types";
interface MediaOverlayProps {
    media: Thumbnail,
    onClose: () => void
}
export default function MediaOverlay({ media, onClose }: MediaOverlayProps) {


    return (
        <>
            <div
                id="AuthOverlay"
                className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
            >
                <div className="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg flex flex-col">

                    <div className="w-full flex justify-end">
                        <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100">
                            <AiOutlineClose size="26" />
                        </button>
                    </div>
                    <div className="grow overflow-hidden my-1">
                        {
                            media.type === 'video' ?
                                <video className="w-full h-full object-contain rounded-md" src={useUploadsUrl(media.url)} controls />
                                :
                                <img className="w-full h-full object-contain rounded-md" src={useCheckBase64(media.url) ? media.url : useUploadsUrl(media.url)} alt="image" />
                        }

                    </div>


                </div>
            </div>
        </>
    )
}
