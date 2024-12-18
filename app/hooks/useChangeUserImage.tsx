// import { storage } from "@/libs/AppWriteClient"


// const useChangeUserImage = async (file: File, cropper: any, currentImage: string) => {
//     let videoId = Math.random().toString(36).slice(2, 22)

//     const x = cropper.left;
//     const y = cropper.top;
//     const width = cropper.width;
//     const height = cropper.height;

//     try {
//         const response = await fetch(URL.createObjectURL(file));
//         const imageBuffer = await response.arrayBuffer();

//         const image = await Image.load(imageBuffer)
//         const croppedImage = image.crop({ x, y, width, height });
//         const resizedImage = croppedImage.resize({ width: 200, height: 200 });
//         const blob = await resizedImage.toBlob();
//         const arrayBuffer = await blob.arrayBuffer();
//         const finalFile = new File([arrayBuffer], file.name, { type: blob.type });
//         const result = await storage.createFile(String(process.env.NEXT_PUBLIC_BUCKET_ID), videoId, finalFile);

//         // if current image is not default image delete
//         if (currentImage != String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEAFULT_IMAGE_ID)) {
//             await storage.deleteFile(String(process.env.NEXT_PUBLIC_BUCKET_ID), currentImage);
//         }

//         return result?.$id
//     } catch (error) {
//         throw error
//     }
// }

import axios from "axios";
import Image from "image-js";

const useChangeUserImage = async (file: File, cropper: any, currentImage: string) => {
    const token = localStorage.getItem('token');
    if (!token) return console.error('Token not found in localStorage');
    let videoId = Math.random().toString(36).slice(2, 22); // Generate a unique ID for this image upload

    // Get crop dimensions
    const x = cropper.left;
    const y = cropper.top;
    const width = cropper.width;
    const height = cropper.height;

    try {
        // Read the image from the file
        const response = await fetch(URL.createObjectURL(file));
        const imageBuffer = await response.arrayBuffer();

        // Load and crop the image
        const image = await Image.load(imageBuffer);
        const croppedImage = image.crop({ x, y, width, height });

        // Resize the image to 200x200
        const resizedImage = croppedImage.resize({ width: 200, height: 200 });

        // Convert the resized image to a Blob
        const blob = await resizedImage.toBlob();
        const arrayBuffer = await blob.arrayBuffer();

        // Create a new File object from the resized Blob
        const finalFile = new File([arrayBuffer], file.name, { type: blob.type });

        // Create FormData to send the image to the server
        const formData = new FormData();
        formData.append('image', finalFile); // Add the image file
        formData.append('currentImage', currentImage); // Send the current image URL if needed
        formData.append('videoId', videoId); // Example field (if needed)
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // Call the API to upload the image
        const result = await axios.post(`${API_URL}/profile/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });

        // Handle the response from the API
        if (result.status === 201) {
            console.log('Image uploaded successfully:', result.data.data);
            return result.data.data; // Or do something with the result, e.g., update the user profile
        } else {
            console.error('Image upload failed:', result.statusText);
        }
    } catch (error) {
        console.error('Error during image processing or upload:', error);
        throw error; // Handle error appropriately, e.g., show an error message to the user
    }
};

export default useChangeUserImage;
