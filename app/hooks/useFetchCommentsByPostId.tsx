// import { CommentWithProfile } from "@/app/types";
// import { database, Query } from "@/libs/AppWriteClient";
// import { useEffect, useState } from "react";
// import useGetProfileByUserId from "./useGetProfileByUserId";

// const useFetchCommentsByPostId = (postId: string) => {
//     const [comments, setComments] = useState<CommentWithProfile[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchComments = async () => {
//             // Nếu postId không có thì không cần gọi API
//             if (!postId) return;
//             console.log("Fetching comments for post:", postId);
//             setLoading(true);
//             setError(null);

//             try {
//                 // Lấy danh sách bình luận từ cơ sở dữ liệu
//                 const commentsResult = await database.listDocuments(
//                     String(process.env.NEXT_PUBLIC_DATABASE_ID),
//                     String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT),
//                     [
//                         Query.equal('post_id', postId),
//                         Query.orderDesc("$id"),
//                     ]
//                 );

//                 // Tạo một mảng các Promise để lấy thông tin profile cho từng bình luận
//                 const commentsWithProfiles = await Promise.all(
//                     commentsResult.documents.map(async (comment) => {
//                         const profile = await useGetProfileByUserId(comment.user_id);

//                         return {
//                             id: comment?.$id,
//                             user_id: comment?.user_id,
//                             post_id: comment?.post_id,
//                             text: comment?.text,
//                             created_at: comment?.created_at,
//                             profile: {
//                                 user_id: profile?.user_id,
//                                 name: profile?.name,
//                                 image: profile?.image,
//                             },
//                         };
//                     })
//                 );

//                 // Cập nhật dữ liệu bình luận vào state
//                 setComments(commentsWithProfiles);
//             } catch (err: any) {
//                 console.error("Error fetching comments:", err);
//                 setError("Có lỗi xảy ra khi tải bình luận.");
//             } finally {
//                 setLoading(false);
//                 console.log("Finish");
//             }
//         };

//         fetchComments();
//     }, [postId]); // Fetch lại dữ liệu khi postId thay đổi

//     return { comments, loading, error };
// };

// export default useFetchCommentsByPostId;
