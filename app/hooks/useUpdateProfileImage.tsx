// import { database } from "@/libs/AppWriteClient"

// const useUpdateProfileImage = async (id: string, image: string) => {
//     try {
//         await database.updateDocument(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE), 
//             id, 
//         { 
//             image: image 
//         })
//     } catch (error) {
//         throw error
//     }
// }
import axios from 'axios';
const useUpdateProfileImage = async (image: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { image: image };
        const response = await axios.patch(`${API_URL}/profile/update`, data, options);

        return response.data.data;
    } catch (error) {
        throw error
    }
}
export default useUpdateProfileImage