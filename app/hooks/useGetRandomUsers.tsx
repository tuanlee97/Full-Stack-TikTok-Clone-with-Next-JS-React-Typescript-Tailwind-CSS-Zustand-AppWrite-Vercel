// import { database, Query } from "@/libs/AppWriteClient"

// const useGetRandomUsers = async () => {
//     try {
//         const profileResult = await database.listDocuments(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID), 
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE), 
//             [ 
//                 Query.limit(5) 
//             ]
//         );
//         const documents = profileResult.documents

//        const objPromises = documents.map(profile => {
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
import axios from "axios";
import { RandomUsers } from "../types";
const useGetRandomUsers = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/user`);

        if (response.status != 200) return;

        const users = response.data.data.users
        const objPromises = users.map((user: RandomUsers) => {
            return {
                id: user?.id,
                name: user?.name,
                image: user?.image
            }
        })
        const result = await Promise.all(objPromises)
        return result
    } catch (error) {
        throw error
    }
}
export default useGetRandomUsers