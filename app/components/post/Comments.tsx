import { useUser } from "@/app/context/user";
import useCreateComment from "@/app/hooks/useCreateComment";
import { useCommentStore } from "@/app/stores/comment";
import { useGeneralStore } from "@/app/stores/general";
import { CommentsCompTypes } from "@/app/types";
import { memo, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import ClientOnly from "../ClientOnly";
import SingleComment from "./SingleComment";

const Comments = ({ params }: CommentsCompTypes) => {

    let { commentsByPost, setCommentsByPost, clearComments, loading, error } = useCommentStore();

    const { setIsLoginOpen } = useGeneralStore();
    const contextUser = useUser();

    const [comment, setComment] = useState<string>("");
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Clear comments when postId changes
    // useEffect(() => {
    //     // Clear comments from the store when postId changes
    //     clearComments();

    //     // Load comments for the new postId
    //     //setCommentsByPost(params?.postId);
    // }, [params?.postId]);

    // Hàm thêm bình luận
    const addComment = async () => {
        if (!contextUser?.user) return setIsLoginOpen(true);

        try {
            setIsUploading(true);

            // Thêm bình luận mới
            await useCreateComment(contextUser?.user?.id, params?.postId, comment);

            // Sau khi thêm bình luận thành công, gọi lại API để lấy bình luận mới
            setCommentsByPost(params?.postId);

            // Reset lại input
            setComment('');
        } catch (error) {
            console.log(error);
            alert(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div
                id="Comments"
                className="relative min-h-[500px] max-h-[500px] sm:h-full sm:bg-[#F8F8F8] z-0 w-screen border-t-0 sm:border-t-2 overflow-auto"
            >
                <div className="pt-2" />

                <ClientOnly>
                    {/* Hiển thị loading */}
                    {loading && commentsByPost.length === 0 ? (
                        <div className="flex flex-col items-center text-center mt-6 text-sm text-white sm:text-gray-500">
                            <BiLoaderCircle className="animate-spin" color="#E91E62" size="30" />
                            Loading comments...
                        </div>
                    ) : error ? (
                        // Hiển thị thông báo lỗi nếu có lỗi
                        <div className="text-center mt-6 text-sm text-red-600">
                            {error}
                        </div>
                    ) : commentsByPost.length < 1 ? (
                        // Nếu không có bình luận nào
                        <div className="text-center mt-6 text-sm text-white sm:text-gray-500">
                            No comments...
                        </div>
                    ) : (
                        // Hiển thị bình luận nếu có
                        <div>
                            {commentsByPost.map((comment, index) => (
                                <SingleComment key={index} comment={comment} params={params} />
                            ))}
                        </div>
                    )}
                </ClientOnly>

                <div className="mb-28" />
            </div>

            <div
                id="CreateComment"
                className="absolute flex items-center justify-between bottom-0 bg-[#212327] sm:bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 sm:border-t-2"
            >
                <div
                    className={`
                        bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px]
                        ${inputFocused ? 'sm:border-2 sm:border-gray-400' : 'sm:border-2 sm:border-[#F1F1F2]'}
                    `}
                >
                    <input
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment || ""}
                        maxLength={30}
                        className="bg-[#4a4c50] sm:bg-[#F1F1F2] text-white sm:text-black text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
                        type="text"
                        placeholder="Add comment..."
                    />
                </div>

                {!isUploading ? (
                    <button
                        disabled={!comment}
                        onClick={() => addComment()}
                        className={`
                            font-semibold text-sm ml-5 pr-1
                            ${comment ? "text-[#F02C56] cursor-pointer" : "text-gray-400"}
                        `}
                    >
                        Post
                    </button>
                ) : (
                    <BiLoaderCircle className="animate-spin" color="#E91E62" size="20" />
                )}
            </div>
        </>
    );
};

export default memo(Comments);
