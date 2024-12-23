"use client"

import ClientOnly from "@/app/components/ClientOnly"
import Comments from "@/app/components/post/Comments"
import CommentsHeader from "@/app/components/post/CommentsHeader"
import useDeviceType from "@/app/hooks/useDeviceType"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
import { useCommentStore } from "@/app/stores/comment"
import { useLikeStore } from "@/app/stores/like"
import { usePostStore } from "@/app/stores/post"
import { PostPageTypes } from "@/app/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"

export default function Post({ params }: PostPageTypes) {

    let { postById, postsByUser, setPostById, setPostsByUser } = usePostStore()
    let { setLikesByPost } = useLikeStore()
    const deviceType = useDeviceType();
    let { setCommentsByPost } = useCommentStore()
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const router = useRouter()

    useEffect(() => {
        setPostById(params.postId)
        setCommentsByPost(params.postId)
        setLikesByPost(params.postId)
        setPostsByUser(params.userId)

    }, [])

    useEffect(() => {
        const index = postsByUser.findIndex((video) => video.id === params.postId);
        setCurrentIndex(index)
    }, [postsByUser])

    const loopThroughPostsUp = () => {
        postsByUser.forEach(post => {
            if (post.id > params.postId) {
                router.push(`/post/${post.id}/${params.userId}`)
            }
        });
    }

    const loopThroughPostsDown = () => {
        postsByUser.forEach(post => {
            if (post.id < params.postId) {
                router.push(`/post/${post.id}/${params.userId}`)
            }
        });
    }
    const handleGoBack = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = '/'; // Redirect to '/'
    };

    return (

        <div
            id="PostPage"
            className="lg:flex justify-between w-full sm:h-screen  sm:bg-black"
        >

            <div className="lg:w-[calc(100%-540px)] h-full relative">
                <Link
                    href={`#`}
                    className="absolute text-white z-20 m-5 rounded-full bg-black p-1.5 hover:bg-gray-800"
                >
                    <span onClick={handleGoBack}>
                        <AiOutlineClose size="27" />
                    </span>
                </Link>

                <div className="absolute z-30 right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    <button
                        onClick={() => loopThroughPostsUp()}
                        className={`${currentIndex > 0 ? 'opacity-100' : 'opacity-20 select-none cursor-not-allowed'} flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800`}
                    >
                        <BiChevronUp size="30" color="#FFFFFF" />
                    </button>

                    <button
                        onClick={() => loopThroughPostsDown()}
                        className={`${currentIndex < postsByUser.length - 1 ? 'opacity-100' : 'opacity-20 select-none cursor-not-allowed'} flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800`}
                    >
                        <BiChevronDown size="30" color="#FFFFFF" />
                    </button>
                </div>

                <img
                    className="absolute z-20 top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
                    width="45"
                    src="/images/nailpro-logo.png"
                />

                <ClientOnly>
                    {/* {postById?.video_url ? (
                                <video
                                    className="fixed object-cover w-full my-auto z-[0] h-screen"
                                    src={useUploadsUrl(postById?.video_url)}
                                />
                            ) : null} */}

                    <div className="bg-black lg:min-w-[480px] z-10 relative">
                        {postById?.video_url ? (
                            <video
                                autoPlay
                                controls
                                loop
                                muted
                                className="h-screen mx-auto"
                                src={useUploadsUrl(postById.video_url)}
                            />
                        ) : null}
                    </div>
                </ClientOnly>

            </div>



            <div id="InfoSection" className="lg:max-w-[550px] relative w-full h-full rounded-t-[20px] sm:rounded-none bg-black sm:bg-white">
                <div className="sm:py-7" />
                <div
                    className="flex sm:hidden justify-end text-white  px-5 pt-4">
                    <AiOutlineClose size="24" />
                </div>

                <ClientOnly>
                    {postById ? (
                        <CommentsHeader post={postById} params={params} />
                    ) : null}
                </ClientOnly>

                <Comments params={params} />

            </div>
        </div>

    )
}
