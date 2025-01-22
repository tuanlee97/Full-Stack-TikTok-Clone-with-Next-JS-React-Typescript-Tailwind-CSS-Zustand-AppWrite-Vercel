
import { IoMdCloseCircleOutline } from "react-icons/io";
import VideoThumbnail from "./VideoThumbnail";
interface FileProps {
    files: File[],
    handleChange: (index: number) => void
}
const UploadDisplay = ({ files, handleChange }: FileProps) => {

    return (
        files.length > 0 && (
            <div className="selected-files min-w-full mt-4 overflow-x-auto scrollx-visible flex space-x-2 p-2">
                {files.map((file, index) => (
                    <div key={index} className="file-item flex-shrink-0  w-auto relative">
                        <IoMdCloseCircleOutline onClick={() => handleChange(index)} color="#fff" size={20} className="z-10 shadow-sm cursor-pointer absolute top-0 right-0" />
                        {/* Hiển thị hình ảnh nếu là ảnh */}
                        {file.type.startsWith('image/') ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-20 h-20 object-cover rounded-md"
                                draggable={false}  // Ngừng kéo
                            />
                        ) : file.type.startsWith('video/') ? (
                            <VideoThumbnail file={file} />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                                <span className="text-gray-600">Unsupported File</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    );
}
export default UploadDisplay;