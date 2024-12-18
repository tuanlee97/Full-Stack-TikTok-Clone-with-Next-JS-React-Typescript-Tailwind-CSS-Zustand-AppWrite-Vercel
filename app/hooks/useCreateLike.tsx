// import { database, ID } from "@/libs/AppWriteClient"

// const useCreateLike = async (userId: string, postId: string) => {
//     try {
//         await database.createDocument(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE), 
//             ID.unique(), 
//         {
//             user_id: userId,
//             post_id: postId,
//         });
//     } catch (error) {
//         throw error
//     }
// }
import axios from 'axios';
const useCreateLike = async (postId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        await axios.post(`${API_URL}/like/${postId}`, {}, options);


    } catch (error) {
        throw error;
    }
}
export default useCreateLike