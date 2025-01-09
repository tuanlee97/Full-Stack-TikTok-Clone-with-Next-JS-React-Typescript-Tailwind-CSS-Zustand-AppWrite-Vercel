import { useUser } from "@/app/context/user"
import useDeleteInbox from "@/app/hooks/useDeleteInbox"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
import { useCommentStore } from "@/app/stores/comment"
import { Message } from "@/app/types"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { BiLoaderCircle } from "react-icons/bi"
import { BsTrash3 } from "react-icons/bs"
interface SingleMessageProps {
    conversation: Message;
    activeSwipeId: string | null;
    setActiveSwipeId: (id: string | null) => void;
    fetchConversations: () => Promise<void>;
}
const SingleMessage: React.FC<SingleMessageProps> = ({ conversation, activeSwipeId, setActiveSwipeId, fetchConversations }) => {
    const router = useRouter()
    const contextUser = useUser()

    let { setCommentsByPost } = useCommentStore();
    let connectId = String(conversation.receiver_id) === contextUser?.user?.id ? conversation.sender_id : conversation.receiver_id

    const [isDeleting, setIsDeleting] = useState(false)
    const [swipeOffset, setSwipeOffset] = useState(false) // Khoảng cách swipe
    // const swipeStartRef = useRef(0) // Lưu vị trí bắt đầu swipe
    const [swiping, setSwiping] = useState(false) // Trạng thái swipe
    const singleMessageRef = useRef<HTMLDivElement | null>(null);
    const deleteThisComment = async () => {
        let res = confirm("Are you sure you weant to delete this comment?")
        if (!res) return

        try {
            setIsDeleting(true)
            await useDeleteInbox(conversation?.id)
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

        router.push(`/profile/${connectId}`)
    }
    const onClickDetail = async () => {
        router.push(`/inbox/${contextUser?.user?.id}/${connectId}`)
    }
    // Xử lý sự kiện khi bắt đầu swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setSwiping(true);
        //swipeStartRef.current = e.touches[0].clientX;
        setSwipeOffset(false);
        setActiveSwipeId(conversation.id);  // Thiết lập trạng thái vuốt cho tin nhắn này
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
        console.log("New active swipe id " + conversation.id)
        setActiveSwipeId(conversation.id);  // Thiết lập trạng thái vuốt cho tin nhắn này
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
            console.log(event.target)
            console.log(singleMessageRef.current)
            if (singleMessageRef.current && !singleMessageRef.current.contains(event.target as Node)) {
                console.log("click outside " + activeSwipeId)
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

    return (
        <div className="flex" ref={singleMessageRef} >
            <div className={`w-full cursor-pointer bg-[#181818] hover:bg-[#212121] duration-200 px-4`}
                // onClick={onClickDetail}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="py-4 SingleMessage transition-transform duration-200 ease-out" style={{ transform: `translateX(-${swipeOffset}px)` }}>
                    <div className="flex items-start relative w-full">
                        <div className="">
                            <div onClick={onClickProfile} className="cursor-pointer">
                                <img
                                    className="rounded-full min-w-[40px] h-[40px] lg:mx-0 mx-auto"
                                    width={"40"}
                                    height={"40"}
                                    src={useUploadsUrl(conversation.profile?.image || "")}
                                />
                            </div>
                        </div>

                        <div className="ml-3  text-[18px] text-white sm:text-gray-600 flex items-center justify-between">
                            <div className="">
                                <p className="text-[15px] font-semibold ">{conversation?.profile?.name}</p>
                                <p className="text-[13px] font-normal text-white sm:text-black line-clamp-1 ">{conversation.message}</p>
                                <span className="text-[12px] text-gray-300 sm:text-gray-600 font-light sm:ml-1">
                                    {moment(conversation?.created_at).calendar()}
                                </span>
                            </div>
                            {/* 
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
                            ) : null} */}

                        </div>




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