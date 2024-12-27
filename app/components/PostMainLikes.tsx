import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import { BiLoaderCircle } from "react-icons/bi"
import { FaCommentDots, FaShare } from "react-icons/fa"
import { FiCheck, FiPlus } from "react-icons/fi"
import { useUser } from "../context/user"
import useCreateFollow from "../hooks/useCreateFollow"
import useCreateLike from "../hooks/useCreateLike"
import useDeleteLike from "../hooks/useDeleteLike"
import useDeviceType from "../hooks/useDeviceType"
import useGetLikesByPostId from "../hooks/useGetLikesByPostId"
import useIsFollow from "../hooks/useIsFollow"
import useIsLiked from "../hooks/useIsLiked"
import useUnFollow from "../hooks/useUnFollow"
import useUploadsUrl from "../hooks/useUploadsUrl"
import { useCommentStore } from "../stores/comment"
import { useGeneralStore } from "../stores/general"
import { Like, PostMainLikesCompTypes } from "../types"
import Modal from "./Modal"
import ModalPost from "./post/ModalPost"
import ShareModal from "./post/ShareModal"

export interface PostAdditionalProps {
    togglePlayPause?: () => void;
    onModalClose?: (currentTime: number) => void;
}
const PostMainLikes = ({ post, togglePlayPause, onModalClose }: PostMainLikesCompTypes & PostAdditionalProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    let { setIsLoginOpen } = useGeneralStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalShareOpen, setIsModalShareOpen] = useState<boolean>(false);
    const router = useRouter()
    const contextUser = useUser()
    const [hasClickedLike, setHasClickedLike] = useState<boolean>(false)
    const [userLiked, setUserLiked] = useState<boolean>(false)
    const [isFollow, setIsFollow] = useState<boolean>(false)
    const [showCheck, setShowCheck] = useState<boolean>(false);
    let { commentsByPost, setCommentsByPost } = useCommentStore();
    const [likes, setLikes] = useState<Like[]>([])

    const deviceType = useDeviceType();
    useEffect(() => {
        getAllLikesByPost()
        setCommentsByPost(post.id);

    }, [post.id, isModalOpen])
    useEffect(() => {
        if (contextUser?.user) {
            checkIsFollow();
        }
    }, [isFollow]);
    const checkIsFollow = async () => {
        try {
            const isFollow = await useIsFollow(post?.user_id);
            setIsFollow(isFollow);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                console.error('Error:', error.message);
            }
        }

    }
    useEffect(() => {
        hasUserLikedPost()
    }, [likes, contextUser]);
    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!contextUser?.user) return setIsLoginOpen(true);
        try {
            if (isFollow) {
                await useUnFollow(post?.user_id);
                setIsFollow(false)

            }
            else {
                await useCreateFollow(post?.user_id);
                setIsFollow(true)
                handleShowCheck();
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                console.error('Error:', error.message);
            }
        }

    }

    const handleShowCheck = () => {
        setShowCheck(true);

        setTimeout(() => {
            setShowCheck(false);
        }, 1000);
    };

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

        try {
            await useCreateLike(post?.id)
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                alert(error);
                console.error('Error:', error.message);
            }
        }

        await getAllLikesByPost()
        hasUserLikedPost()
        setHasClickedLike(false)
    }

    const unlike = async (id: string) => {
        setHasClickedLike(true)
        try {
            await useDeleteLike(id)
        }
        catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                alert(error);
                console.error('Error:', error.message);
            }
        }
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
                    unlike(like?.post_id)
                }
            })
        }
    }


    const handlePlayPause = () => {
        if (togglePlayPause) togglePlayPause();
    }
    const openModal = (postProfileId: string, postId: string) => {
        setIsModalOpen(true);
        changeUrl(`/post/${postId}/${postProfileId}`);
        videoRef.current?.play();
        if (deviceType !== 'mobile') handlePlayPause();
    };
    // Khi đóng modal, gửi currentTime từ video trong modal về parent
    const closeModal = () => {
        setIsModalOpen(false);
        changeUrl(window.history.state?.url || '/');
        if (videoRef.current && onModalClose) {
            onModalClose(videoRef.current.currentTime);
        }
        videoRef.current?.pause();
        if (deviceType !== 'mobile') handlePlayPause();
    };
    const changeUrl = (url: string) => {
        window.history.replaceState({}, '', url);
    };
    const openModalShare = (postProfileId: string, postId: string) => {
        setIsModalShareOpen(true);
    };

    const closeModalShare = () => {
        setIsModalShareOpen(false);
    };

    const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${post?.id}/${post?.profile?.user_id}`;
    const postText = "Check out this amazing video!";

    return (
        <>
            <div id={`PostMainLikes-${post?.id}`} className={`opacity-100 relative right-[60px] bottom-28 sm:right-0 sm:mr-[75px]`}>
                <div className="absolute bottom-0 pl-2">
                    <div className="pb-4">
                        <button className="cursor-pointer relative" onClick={() => router.push(`/profile/${post?.profile?.user_id}`)}>
                            {!isFollow && <FiPlus onClick={handleFollow} className="absolute duration-250 rounded-full bg-[#ff2626] bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 text-white" />}
                            {showCheck && <FiCheck className="absolute duration-250 rounded-full bg-[#ff2626] bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 text-white" />}
                            <img className={`rounded-full max-h-[60px] ${isFollow ? `` : `bg-white p-[1px]`}`} width="60" src={post?.profile?.image ? useUploadsUrl(post?.profile?.image) : `/images/placeholder-user.jpg`} />
                        </button>
                    </div>
                    <div className="pb-4 text-center">
                        <button
                            disabled={hasClickedLike}
                            onClick={() => likeOrUnlike()}
                            className="rounded-full bg-gray-200 p-2 cursor-pointer"
                        >
                            {!hasClickedLike ? (
                                <AiFillHeart color={likes?.length > 0 && userLiked ? '#ff2626' : '#000'} size="25" />
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
                            <FaCommentDots color="#000" size="25" />
                        </div>
                        <span className="text-xs text-white sm:text-gray-800 font-semibold">{commentsByPost[post.id]?.length || 0}</span>
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <ModalPost post={post} closeModal={closeModal} videoRef={videoRef} />
                    </Modal>
                    <button className="text-center" onClick={() => openModalShare(post?.profile?.user_id, post?.id)}>
                        <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                            <FaShare color="#000" size="25" />
                        </div>
                        {/* <span className="text-xs text-white sm:text-gray-800 font-semibold">55</span> */}
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
export default PostMainLikes;