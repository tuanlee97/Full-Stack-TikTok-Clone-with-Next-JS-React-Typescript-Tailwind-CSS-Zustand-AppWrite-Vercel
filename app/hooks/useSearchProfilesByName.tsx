// import { database, Query } from "@/libs/AppWriteClient"

// const useSearchProfilesByName = async (name: string) => {
//     try {
//         const profileResult = await database.listDocuments(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE), 
//             [ 
//                 Query.limit(5),
//                 Query.search("name", name)
//             ]
//         );

//        const objPromises = profileResult.documents.map(profile => {
//             return {
//                 id: profile?.user_id,  
//                 name: profile?.name,
//                 image: profile?.image,
//             }
//         })

//         const result = await Promise.all(objPromises)
//         return result
//     } catch (error) {
//         console.log(error)
//     }
// }
import axios from 'axios';
import { User } from '../types';
const useSearchProfilesByName = async (name: string) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/user/search/${name}`);
        if (response.status != 200) return;
        const users = response.data.data.users
        const objPromises = users.map((user: User) => {
            return {
                id: user?.id,
                name: user?.name,
                image: user?.image
            }
        })
        const result = await Promise.all(objPromises)
        return result
    } catch (error) {
        throw error;
    }
}
export default useSearchProfilesByName