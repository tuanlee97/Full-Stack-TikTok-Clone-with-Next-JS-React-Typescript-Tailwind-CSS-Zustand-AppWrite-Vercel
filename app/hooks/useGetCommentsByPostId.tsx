// import { database, Query } from "@/libs/AppWriteClient";
// import useGetProfileByUserId from "./useGetProfileByUserId";

// const useGetCommentsByPostId = async (postId: string) => {
//     try {
//         const commentsResult = await database.listDocuments(
//             String(process.env.NEXT_PUBLIC_DATABASE_ID),
//             String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT),
//             [
//                 Query.equal('post_id', postId),
//                 Query.orderDesc("$id")
//             ]
//         );

//         const objPromises = commentsResult.documents.map(async comment => {
//             const profile = await useGetProfileByUserId(comment.user_id)

//             return {
//                 id: comment?.$id,
//                 user_id: comment?.user_id,
//                 post_id: comment?.post_id,
//                 text: comment?.text,
//                 created_at: comment?.created_at,
//                 profile: {
//                     user_id: profile?.user_id,
//                     name: profile?.name,
//                     image: profile?.image,
//                 }
//             }
//         })

//         const result = await Promise.all(objPromises)
//         return result
//     } catch (error) {
//         throw error
//     }
// }

import axios from 'axios';
const useGetCommentsByPostId = async (postId: string) => {
    console.log(postId)
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${API_URL}/comment/${postId}`);
    return response.data.data;
};
export default useGetCommentsByPostId