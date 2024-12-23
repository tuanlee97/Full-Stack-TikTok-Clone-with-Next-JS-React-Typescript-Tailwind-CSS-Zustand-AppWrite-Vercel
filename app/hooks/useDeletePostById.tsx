import axios from "axios";
import { Comment, Like } from "../types";
import useDeleteComment from "./useDeleteComment";
import useDeleteLike from "./useDeleteLike";
import useGetCommentsByPostId from "./useGetCommentsByPostId";
import useGetLikesByPostId from "./useGetLikesByPostId";

const useDeletePostById = async (postId: string, currentImage: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');
        const likes = await useGetLikesByPostId(postId)
        likes.forEach(async (like: Like) => { await useDeleteLike(postId) })

        const comments = await useGetCommentsByPostId(postId)
        comments.forEach(async (comment: Comment) => { await useDeleteComment(comment?.id) })

        // await database.deleteDocument(
        //     String(process.env.NEXT_PUBLIC_DATABASE_ID),
        //     String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST),
        //     postId
        // );



        // await storage.deleteFile(String(process.env.NEXT_PUBLIC_BUCKET_ID), currentImage);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        await axios.delete(`${API_URL}/video/delete/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

    } catch (error) {
        throw error
    }
}

export default useDeletePostById