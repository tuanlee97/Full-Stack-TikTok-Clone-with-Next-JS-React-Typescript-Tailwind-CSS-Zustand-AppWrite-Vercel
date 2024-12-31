import { useUser } from "@/app/context/user"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
import { useCommentStore } from "@/app/stores/comment"
import { Message } from "@/app/types"
import moment from "moment"
import Link from "next/link"
import { useState } from "react"
import { BiLoaderCircle } from "react-icons/bi"
import { BsTrash3 } from "react-icons/bs"

export default function SingleMessage({ conversation }: { conversation: Message }) {

    const contextUser = useUser()

    let { setCommentsByPost } = useCommentStore()
    const [isDeleting, setIsDeleting] = useState(false)

    const deleteThisComment = async () => {
        let res = confirm("Are you sure you weant to delete this comment?")
        if (!res) return

        try {
            // setIsDeleting(true)
            // await useDeleteComment(comment?.id)
            // setCommentsByPost(params?.postId)
            // setIsDeleting(false)
        } catch (error: any) {
            // if (error.response && error.response.status === 401) {
            //     console.error('Unauthorized access, logging out...');
            //     // Handle 401 Unauthorized error
            //     contextUser?.logout();  // Assuming logout method exists in the context
            // } else {
            //     // Handle other errors
            //     console.log(error)
            //     alert(error)
            // }
        }
    }
    return (
        <>
            <div id="SingleMessage" className="flex items-center justify-between px-8 mt-4">
                <div className="flex items-center relative w-full">
                    <Link href={`/profile/${conversation.profile.user_id}`}>
                        <img
                            className="absolute top-0 rounded-full lg:mx-0 mx-auto"
                            width="40"
                            src={useUploadsUrl(conversation.profile.image)}
                        />
                    </Link>
                    <div className="ml-14 pt-0.5 w-full">

                        <div className="text-[18px] font-semibold text-white sm:text-gray-600 flex items-center justify-between">
                            <span className="flex  flex-col sm:flex-row sm:items-center">
                                <p className="text-[15px]">{conversation?.profile?.name}</p>
                                <span className="text-[12px] text-white sm:text-gray-600 font-light sm:ml-1">
                                    {moment(conversation?.created_at).calendar()}
                                </span>
                            </span>

                            {contextUser?.user?.id == conversation.profile.user_id ? (
                                <button
                                    disabled={isDeleting}
                                    onClick={() => deleteThisComment()}
                                >
                                    {isDeleting
                                        ? <BiLoaderCircle className="animate-spin" color="#E91E62" size="20" />
                                        : <BsTrash3 className="cursor-pointer" size="16" />
                                    }
                                </button>
                            ) : null}
                        </div>

                        <p className="text-[15px] text-white sm:text-black">{conversation.text}</p>

                    </div>
                </div>
            </div>
        </>
    )
}
