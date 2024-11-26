import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import { BiLoaderCircle } from "react-icons/bi"
import { FaCommentDots, FaShare } from "react-icons/fa"
import { useUser } from "../context/user"
import useCreateBucketUrl from "../hooks/useCreateBucketUrl"
import useCreateLike from "../hooks/useCreateLike"
import useDeleteLike from "../hooks/useDeleteLike"
import useGetCommentsByPostId from "../hooks/useGetCommentsByPostId"
import useGetLikesByPostId from "../hooks/useGetLikesByPostId"
import useIsLiked from "../hooks/useIsLiked"
import { useGeneralStore } from "../stores/general"
import { Comment, Like, PostMainLikesCompTypes } from "../types"
import Modal from "./Modal"
import ModalPost from "./post/ModalPost"
import ShareModal from "./post/ShareModal"

export interface PostAdditionalProps {
    isDragging?: boolean; // Optional - Biến trạng thái kéo thả
    currentTime?: number; // Thời gian hiện tại của video
    togglePlayPause?: () => void;
    onModalClose?: (currentTime: number) => void;
}
export default function PostMainLikes({ post, isDragging, currentTime, togglePlayPause, onModalClose }: PostMainLikesCompTypes & PostAdditionalProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    let { setIsLoginOpen } = useGeneralStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalShareOpen, setIsModalShareOpen] = useState<boolean>(false);
    const router = useRouter()
    const contextUser = useUser()
    const [hasClickedLike, setHasClickedLike] = useState<boolean>(false)
    const [userLiked, setUserLiked] = useState<boolean>(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [likes, setLikes] = useState<Like[]>([])

    useEffect(() => {
        getAllLikesByPost()
        getAllCommentsByPost()
    }, [post])

    useEffect(() => { hasUserLikedPost() }, [likes, contextUser])

    const getAllCommentsByPost = async () => {
        let result = await useGetCommentsByPostId(post?.id)
        setComments(result)
    }

    const getAllLikesByPost = async () => {
        let result = await useGetLikesByPostId(post?.id)
        setLikes(result)
    }

    const hasUserLikedPost = () => {
        if (!contextUser) return

        if (likes?.length < 1 || !contextUser?.user?.id) {
            setUserLiked(false)
            return
        }
        let res = useIsLiked(contextUser?.user?.id, post?.id, likes)
        setUserLiked(res ? true : false)
    }

    const like = async () => {
        setHasClickedLike(true)
        await useCreateLike(contextUser?.user?.id || '', post?.id)
        await getAllLikesByPost()
        hasUserLikedPost()
        setHasClickedLike(false)
    }

    const unlike = async (id: string) => {
        setHasClickedLike(true)
        await useDeleteLike(id)
        await getAllLikesByPost()
        hasUserLikedPost()
        setHasClickedLike(false)
    }

    const likeOrUnlike = () => {
        if (!contextUser?.user?.id) {
            setIsLoginOpen(true)
            return
        }

        let res = useIsLiked(contextUser?.user?.id, post?.id, likes)

        if (!res) {
            like()
        } else {
            likes.forEach((like: Like) => {
                if (contextUser?.user?.id == like?.user_id && like?.post_id == post?.id) {
                    unlike(like?.id)
                }
            })
        }
    }
    // Đồng bộ currentTime từ video ngoài vào video trong modal khi mở modal
    useEffect(() => {
        if (isModalOpen && videoRef.current) {
            videoRef.current.currentTime = currentTime || 0;  // Cập nhật thời gian hiện tại từ parent vào video trong modal
        }
    }, [isModalOpen, currentTime]);



    const handlePlayPause = () => {
        if (togglePlayPause) togglePlayPause();
    }
    const openModal = (postProfileId: string, postId: string) => {
        setIsModalOpen(true);
        changeUrl(`/post/${postProfileId}/${postId}`);
        handlePlayPause();
    };
    // Khi đóng modal, gửi currentTime từ video trong modal về parent
    const closeModal = () => {
        setIsModalOpen(false);
        changeUrl(window.history.state?.url || '/');
        if (videoRef.current && onModalClose) {
            onModalClose(videoRef.current.currentTime); // Gửi currentTime từ video trong modal về parent
        }
        handlePlayPause();
    };
    const changeUrl = (url: string) => {
        window.history.replaceState({}, '', url);
    };
    const openModalShare = () => {
        setIsModalShareOpen(true);
    };

    const closeModalShare = () => {
        setIsModalShareOpen(false);
    };

    const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${post?.profile?.user_id}/${post?.id}`;
    const postText = "Check out this amazing video!";
    return (
        <>
            <div id={`PostMainLikes-${post?.id}`} className={`${isDragging ? 'opacity-50' : 'opacity-100'} relative right-[60px] bottom-28 sm:right-0 sm:mr-[75px]`}>
                <div className="absolute bottom-0 pl-2">
                    <div className="cursor-pointer pb-4">
                        <img className="rounded-full max-h-[60px]" width="60" src={useCreateBucketUrl(post?.profile?.image)} />
                    </div>
                    <div className="pb-4 text-center">
                        <button
                            disabled={hasClickedLike}
                            onClick={() => likeOrUnlike()}
                            className="rounded-full bg-gray-200 p-2 cursor-pointer"
                        >
                            {!hasClickedLike ? (
                                <AiFillHeart color={likes?.length > 0 && userLiked ? '#ff2626' : ''} size="25" />
                            ) : (
                                <BiLoaderCircle className="animate-spin" size="25" />
                            )}

                        </button>
                        <span className="text-xs text-white sm:text-gray-800 font-semibold">
                            {likes?.length}
                        </span>
                    </div>




                    <button
                        onClick={(e) => openModal(post?.profile?.user_id, post?.id)}
                        className="pb-4 text-center"
                    >
                        <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                            <FaCommentDots size="25" />
                        </div>
                        <span className="text-xs text-white sm:text-gray-800 font-semibold">{comments?.length}</span>
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <ModalPost post={post} closeModal={closeModal} videoRef={videoRef} />
                    </Modal>
                    <button className="text-center" onClick={openModalShare}>
                        <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                            <FaShare size="25" />
                        </div>
                        <span className="text-xs text-white sm:text-gray-800 font-semibold">55</span>
                    </button>
                    <ShareModal
                        isOpen={isModalShareOpen}
                        closeModal={closeModalShare}
                        postUrl={postUrl}
                        postText={postText}
                    />
                </div>
            </div>
        </>
    )
}
