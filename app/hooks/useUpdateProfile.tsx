// import { database } from "@/libs/AppWriteClient"

// const useUpdateProfile = async (id: string, name: string, bio: string) => {
//     try {
//         await database.updateDocument(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE), 
//             id, 
//         {
//             name: name,
//             bio: bio,
//         });
//     } catch (error) {
//         throw error
//     }
// }
import axios from 'axios';
const useUpdateProfile = async (name: string, bio: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { name: name, bio: bio };
        const response = await axios.patch(`${API_URL}/profile/update`, data, options);

        return response.data.data;
    } catch (error) {
        throw error
    }
};
export default useUpdateProfile