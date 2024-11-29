import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"
import { PostUserCompTypes } from "@/app/types"
import Link from "next/link"
import { useEffect } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function PostUser({ post }: PostUserCompTypes) {

    useEffect(() => {
        const video = document.getElementById(`video${post?.id}`) as HTMLVideoElement

        setTimeout(() => {
            video.addEventListener('mouseenter', () => { video.play() })
            video.addEventListener('mouseleave', () => { video.pause() })
        }, 50)

    }, [])

    return (
        <>
            <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
                {!post.video_url ? (
                    <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
                        <AiOutlineLoading3Quarters className="animate-spin ml-1" size="80" color="#FFFFFF" />
                    </div>
                ) : (
                    <Link href={`/post/${post.id}/${post.user_id}`}>
                        <div className="aspect-[3/4] rounded-md bg-[#1F1F1F]">
                            <video
                                id={`video${post.id}`}
                                muted
                                loop
                                className="aspect-[3/4] object-cover rounded-md"
                                src={useCreateBucketUrl(post.video_url)}
                            />
                        </div>
                    </Link>
                )}
                <div className="px-1">
                    <p className="sm:text-gray-700 text-[15px] pt-1 break-words truncate">
                        {post.text}
                    </p>

                </div>
            </div>
        </>
    )
}
