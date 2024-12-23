// import { database } from "@/libs/AppWriteClient"

// const useDeleteComment = async (id: string) => {
//     try {
//         await database.deleteDocument(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT), 
//             id
//         );
//     } catch (error) {
//         throw error
//     }
// }
import axios from "axios";
const useDeleteComment = async (id: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        await axios.delete(`${API_URL}/comment/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error) {
        throw error
    }
}
export default useDeleteComment