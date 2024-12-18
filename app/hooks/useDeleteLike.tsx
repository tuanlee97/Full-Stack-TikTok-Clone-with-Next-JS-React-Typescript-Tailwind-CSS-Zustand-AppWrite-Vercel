// import { database } from "@/libs/AppWriteClient"

// const useDeleteLike = async (id: string) => {
//     try {
//         await database.deleteDocument(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE), 
//             id
//         );
//     } catch (error) {
//         throw error
//     }
// }

import axios from 'axios';
const useDeleteLike = async (id: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await axios.delete(`${API_URL}/like/${id}`, options);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}
export default useDeleteLike