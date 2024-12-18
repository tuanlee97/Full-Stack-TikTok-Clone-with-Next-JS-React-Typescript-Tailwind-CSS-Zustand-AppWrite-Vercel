"use client"

import { useUser } from "@/app/context/user"
import useCreateLike from "@/app/hooks/useCreateLike"
import useDeleteLike from "@/app/hooks/useDeleteLike"
import useDeletePostById from "@/app/hooks/useDeletePostById"
import useIsLiked from "@/app/hooks/useIsLiked"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
import { useCommentStore } from "@/app/stores/comment"
import { useGeneralStore } from "@/app/stores/general"
import { useLikeStore } from "@/app/stores/like"
import { CommentsHeaderCompTypes } from "@/app/types"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import { BiLoaderCircle } from "react-icons/bi"
import { BsChatDots, BsTrash3 } from "react-icons/bs"
import { ImMusic } from "react-icons/im"
import ClientOnly from "../ClientOnly"

export default function CommentsHeader({ post, params }: CommentsHeaderCompTypes) {

    let { setLikesByPost, likesByPost } = useLikeStore()
    let { commentsByPost, setCommentsByPost } = useCommentStore()
    let { setIsLoginOpen } = useGeneralStore()

    const contextUser = useUser()
    const router = useRouter()
    const [hasClickedLike, setHasClickedLike] = useState<boolean>(false)
    const [isDeleteing, setIsDeleteing] = useState<boolean>(false)
    const [userLiked, setUserLiked] = useState<boolean>(false)

    useEffect(() => {
        setCommentsByPost(params?.postId)
        setLikesByPost(params?.postId)
    }, [post.id])
    useEffect(() => { hasUserLikedPost() }, [likesByPost])

    const hasUserLikedPost = () => {
        if (likesByPost.length < 1 || !contextUser?.user?.id) {
            setUserLiked(false)
            return
        }
        let res = useIsLiked(contextUser.user.id, params.postId, likesByPost)
        setUserLiked(res ? true : false)
    }

    const like = async () => {
        try {
            setHasClickedLike(true)
            try {
                await useCreateLike(params.postId)
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
            setLikesByPost(params.postId)
            setHasClickedLike(false)
        } catch (error) {
            console.log(error)
            alert(error)
            setHasClickedLike(false)
        }
    }

    const unlike = async (id: string) => {
        try {
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
            setLikesByPost(params.postId)
            setHasClickedLike(false)
        } catch (error) {
            console.log(error)
            alert(error)
            setHasClickedLike(false)
        }
    }

    const likeOrUnlike = () => {
        if (!contextUser?.user?.id) return setIsLoginOpen(true)

        let res = useIsLiked(contextUser.user.id, params.postId, likesByPost)
        if (!res) {
            like()
        } else {
            likesByPost.forEach(like => {
                if (contextUser?.user?.id && contextUser.user.id == like.user_id && like.post_id == params.postId) {
                    unlike(like.post_id)
                }
            })
        }
    }

    const deletePost = async () => {
        let res = confirm('Are you sure you want to delete this post?')
        if (!res) return

        setIsDeleteing(true)

        try {
            await useDeletePostById(params?.postId, post?.video_url)
            router.push(`/profile/${params.userId}`)
            setIsDeleteing(false)
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                console.log(error)
                setIsDeleteing(false)
                alert(error)
            }
        }
    }
    return (
        <div className="hidden sm:block">
            <div className="flex items-center justify-between px-8">
                <div className="flex items-center">
                    <Link href={`/profile/${post?.user_id}`}>
                        <img className="rounded-full lg:mx-0 mx-auto" width="40" src={useUploadsUrl(post.profile.image)} />
                    </Link>
                    <div className="ml-3 pt-0.5">

                        <Link
                            href={`/profile/${post?.user_id}`}
                            className="relative z-10 text-[17px] font-semibold hover:underline"
                        >
                            {post?.profile.name}
                        </Link>

                        <div className="relative z-0 text-[13px] -mt-5 font-light">
                            {post?.profile.name}
                            <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5 ">.</span>
                            <span className="font-medium">{moment(post?.created_at).calendar()}</span>
                        </div>
                    </div>
                </div>

                {contextUser?.user?.id == post?.user_id ? (
                    <div>
                        {isDeleteing ? (
                            <BiLoaderCircle className="animate-spin" size="25" />
                        ) : (
                            <button disabled={isDeleteing} onClick={() => deletePost()}>
                                <BsTrash3 className="cursor-pointer" size="25" />
                            </button>
                        )}
                    </div>
                ) : null}
            </div>

            <p className="px-8 mt-4 text-sm">{post?.text}</p>

            <p className="flex item-center gap-2 px-8 mt-4 text-sm font-bold">
                <ImMusic size="17" />
                original sound - {post?.profile.name}
            </p>

            <div className="flex items-center px-8 mt-8">
                <ClientOnly>
                    <div className="pb-4 text-center flex items-center">
                        <button
                            disabled={hasClickedLike}
                            onClick={() => likeOrUnlike()}
                            className="rounded-full bg-gray-200 p-2 cursor-pointer"
                        >
                            {!hasClickedLike ? (
                                <AiFillHeart color={likesByPost.length > 0 && userLiked ? '#ff2626' : ''} size="25" />
                            ) : (
                                <BiLoaderCircle className="animate-spin" size="25" />
                            )}
                        </button>
                        <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
                            {likesByPost.length}
                        </span>
                    </div>
                </ClientOnly>

                <div className="pb-4 text-center flex items-center">
                    <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                        <BsChatDots size={25} />
                    </div>
                    <span className="text-xs pl-2 text-gray-800 font-semibold">{commentsByPost?.length}</span>
                </div>
            </div>
        </div>
    )
}
