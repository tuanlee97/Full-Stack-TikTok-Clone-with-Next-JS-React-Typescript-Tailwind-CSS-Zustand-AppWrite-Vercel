import React from 'react';
import { BsImage } from 'react-icons/bs';
interface FileUploadWithIconProps {
    handleFileSelected: (files: File[]) => void
}
const FileUploadWithIcon = ({ handleFileSelected }: FileUploadWithIconProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            handleFileSelected(filesArray)
        }
    };

    const handleIconClick = () => {
        // Trigger the file input click event when the icon is clicked
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        fileInput?.click(); // Programmatically trigger the click event on the file input
    };
    return (
        <div className="file-upload">
            {/* Sử dụng label để bọc input và hiển thị biểu tượng */}

            <BsImage onClick={handleIconClick} color={"#FFFFFF"} size={36} className="p-2 cursor-pointer" />

            <input
                type="file"
                id="file-upload" // Set the id to link with the label
                accept="image/*,video/*" // Cho phép chọn hình ảnh và video
                multiple // Cho phép chọn nhiều tệp
                onChange={handleFileChange} // Xử lý sự kiện khi chọn tệp
                className="hidden" // Ẩn input mặc định
            />

        </div>
    );
};

export default FileUploadWithIcon;
