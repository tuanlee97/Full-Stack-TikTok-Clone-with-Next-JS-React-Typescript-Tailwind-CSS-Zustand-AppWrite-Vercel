// import { database, Query } from "@/libs/AppWriteClient"

// const useGetProfileByUserId = async (userId: string) => {
//     try {
//         const response = await database.listDocuments(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE), 
//             [ 
//                 Query.equal('user_id', userId) 
//             ]
//         );
//         const documents = response.documents;
//         return {
//             id: documents[0]?.$id,
//             user_id: documents[0]?.user_id,
//             name: documents[0]?.name,
//             image: documents[0]?.image,
//             bio: documents[0]?.bio
//         }
//       } catch (error) {
//           throw error
//       }
// }
import axios from 'axios';
const useGetProfileByUserId = async (userId: string) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/user/${userId}`);

        if (response.status != 200) return;
        const profile = response.data.data
        return {
            id: profile?.$id,
            user_id: profile?.id,
            name: profile?.name,
            image: profile?.image,
            bio: profile?.bio
        }
    } catch (error) {
        throw error
    }
}
export default useGetProfileByUserId