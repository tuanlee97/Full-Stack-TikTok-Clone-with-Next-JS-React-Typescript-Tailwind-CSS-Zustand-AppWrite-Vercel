import { useUser } from "@/app/context/user"
import useDeleteConversation from "@/app/hooks/useDeleteConversation"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
// import { useCommentStore } from "@/app/stores/comment"
import { Conversation, Receiver } from "@/app/types"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { BiLoaderCircle } from "react-icons/bi"
import { BsTrash3 } from "react-icons/bs"
interface SingleMessageProps {
    conversation: Conversation;
    activeSwipeId: number | null;
    setActiveSwipeId: (id: number | null) => void;
    fetchConversations: () => Promise<void>;
}
const SingleMessage: React.FC<SingleMessageProps> = ({ conversation, activeSwipeId, setActiveSwipeId, fetchConversations }) => {
    const router = useRouter()
    const contextUser = useUser()

    // let { setCommentsByPost } = useCommentStore();
    //let conversationId = String(conversation.receiver_ids) === contextUser?.user?.id ? conversation.sender_id : conversation.receiver_ids
    const conversationId = conversation.id;
    const messages = conversation.messages;


    const latestMessage = messages ? messages[messages.length - 1] : null;
    const isSeen = latestMessage?.seen_by?.find((id: number) => String(id) === contextUser?.user?.id)


    const [isDeleting, setIsDeleting] = useState(false)
    const [swipeOffset, setSwipeOffset] = useState(false) // Khoảng cách swipe
    // const swipeStartRef = useRef(0) // Lưu vị trí bắt đầu swipe
    const [swiping, setSwiping] = useState(false) // Trạng thái swipe
    const singleMessageRef = useRef<HTMLDivElement | null>(null);
    const deleteThisComment = async () => {
        let res = confirm("Are you sure you weant to delete this conversation?")
        if (!res) return

        try {
            setIsDeleting(true)
            await useDeleteConversation(conversationId)
            // setCommentsByPost(params?.postId)
            setIsDeleting(false)
            setSwipeOffset(false);
            fetchConversations();
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                console.log(error)
                alert(error)
            }
        }
    }
    const onClickProfile = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // router.push(`/profile/${conversationId}`)
    }
    const onClickDetail = async () => {
        router.push(`/inbox/${conversationId}`)
    }
    // Xử lý sự kiện khi bắt đầu swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setSwiping(true);
        //swipeStartRef.current = e.touches[0].clientX;
        setSwipeOffset(false);
        setActiveSwipeId(conversationId);  // Thiết lập trạng thái vuốt cho tin nhắn này
    };

    // Xử lý khi di chuyển ngón tay
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!swiping) return;
        // const touchMove = e.touches[0].clientX;
        setSwipeOffset(true);
    };

    // Xử lý khi kết thúc swipe
    const handleTouchEnd = () => {
        setSwiping(false);
    };

    // Xử lý sự kiện khi bắt đầu swipe (desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
        setSwiping(true);
        //swipeStartRef.current = e.clientX;
        setSwipeOffset(false);
        setActiveSwipeId(conversationId);  // Thiết lập trạng thái vuốt cho tin nhắn này
    };

    // Xử lý khi di chuyển chuột (desktop)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!swiping) return;
        // const mouseMove = e.clientX;
        // let offset = swipeStartRef.current - mouseMove;
        // offset = offset <= 100 ? offset : 100;
        setSwipeOffset(true);
    };

    // Xử lý khi kết thúc swipe (desktop)
    const handleMouseUp = () => {
        setSwiping(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (singleMessageRef.current && !singleMessageRef.current.contains(event.target as Node)) {

                setSwipeOffset(false);
                setSwiping(false); // Đóng trạng thái swiping nếu click ra ngoài
                setActiveSwipeId(null); // Đặt lại activeSwipeId khi click ra ngoài
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('click', handleClickOutside);


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('click', handleClickOutside);

        };
    }, [setActiveSwipeId]);

    const limitReceivers = conversation.receivers.length > 4 ? conversation.receivers.slice(0, 4) : conversation.receivers

    return (
        <div className="flex" ref={singleMessageRef} >
            <div className={`w-full cursor-pointer bg-[#181818] hover:bg-[#212121] duration-200 px-4`}
                onClick={onClickDetail}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="py-4 SingleMessage transition-transform duration-200 ease-out" style={{ transform: `translateX(-${swipeOffset}px)` }}>
                    <div className="flex items-start relative w-full">
                        {
                            limitReceivers.length > 1 ?
                                <div className="w-[40px] h-[40px] rounded-full bg-gray-200 overflow-hidden relative">
                                    <div className={`grid grid-cols-2 ${limitReceivers.length > 2 ? 'grid-cols-3' : 'grid-rows-1'} gap-1`}>
                                        {
                                            limitReceivers.map((receiver: Receiver) => (
                                                <img key={receiver.id}
                                                    className={` min-w-[${40 / limitReceivers.length}px] h-[${limitReceivers.length > 2 ? 40 / limitReceivers.length : 40}px] lg:mx-0 mx-auto object-cover`}
                                                    width={40 / limitReceivers.length}
                                                    height={limitReceivers.length > 2 ? 40 / limitReceivers.length : 40}
                                                    src={useUploadsUrl(receiver.image || "")}
                                                />
                                            ))
                                        }

                                    </div>
                                </div>
                                :
                                <div className="inline-flex">
                                    {
                                        conversation.receivers.map((receiver: Receiver) => (
                                            <div key={receiver.id} onClick={onClickProfile} className="cursor-pointer group-user">
                                                <img
                                                    className="rounded-full min-w-[40px] h-[40px] lg:mx-0 mx-auto"
                                                    width={"40"}
                                                    height={"40"}
                                                    src={useUploadsUrl(receiver.image || "")}
                                                />
                                            </div>
                                        ))
                                    }

                                </div>
                        }


                        {
                            latestMessage && (
                                <div className="ml-3  text-[18px] text-white sm:text-gray-600 flex items-center justify-between">
                                    <div className="">
                                        <p className={`text-[15px]  ${isSeen ? 'font-normal' : 'font-semibold'}`}>{conversation.conversation_name || conversation.receivers.map((receiver: Receiver) => receiver.name).join(', ')}</p>

                                        <p className={`text-[13px] ${isSeen ? 'font-normal' : 'font-semibold'} text-white sm:text-black line-clamp-1 `}>{latestMessage.message}</p>
                                        <span className="text-[12px] text-gray-300 sm:text-gray-600 font-light sm:ml-1">
                                            {moment(latestMessage?.created_at).calendar()}
                                        </span>
                                    </div>
                                </div>
                            )

                        }

                    </div>
                </div>
            </div>
            {swipeOffset && (
                <button className={`w-[100px] bg-red-500 flex items-center justify-center `}
                    disabled={isDeleting}
                    onClick={() => deleteThisComment()}
                >
                    {

                        isDeleting
                            ? <BiLoaderCircle className="animate-spin" color="#E91E62" size="20" />
                            : <BsTrash3 className="cursor-pointer" size="16" />


                    }
                </button>
            )}


        </div>
    )
}
export default SingleMessage;