// import { database, storage, ID } from "@/libs/AppWriteClient"

// const useCreatePost = async (file: File, userId: string, caption: string) => {
//     let videoId = Math.random().toString(36).slice(2, 22)

//     try {
//         await database.createDocument(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST), 
//             ID.unique(), 
//         {
//             user_id: userId,
//             text: caption,
//             video_url: videoId,
//             created_at: new Date().toISOString(),
//         });
//         await storage.createFile(String(process.env.NEXT_PUBLIC_BUCKET_ID), videoId, file)
//     } catch (error) {
//         throw error
//     }
// }
import axios from "axios";
const useCreatePost = async (file: File, caption: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        // Create FormData to send the image to the server
        const formData = new FormData();
        formData.append('video', file); // Add the image file
        formData.append('caption', caption); // Send the current image URL if needed

        await axios.post(`${API_URL}/video/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error) {
        throw error
    }
}
export default useCreatePost