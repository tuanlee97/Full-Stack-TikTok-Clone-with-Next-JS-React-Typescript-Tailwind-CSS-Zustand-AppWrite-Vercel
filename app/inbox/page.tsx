"use client"

import SingleMessage from "@/app/components/message/SingleMessage"
import { useUser } from "@/app/context/user"
import useGetAllConversation from "@/app/hooks/useGetAllConversation"
import MainLayout from "@/app/layouts/MainLayout"
import { useGeneralStore } from "@/app/stores/general"
import { Conversation, ProfilePageTypes } from "@/app/types"
import { useEffect, useState } from "react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { FiLogIn } from "react-icons/fi"
import { IoIosSearch } from "react-icons/io"
import { PiHandWavingDuotone } from "react-icons/pi"
import CreateChat from "../components/message/CreateChat"
import Modal from "../components/Modal"
import useWebSocket from "../hooks/useWebSocket"
export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser();


    const [results, setResults] = useState<{ total: number, conversations: Conversation[] }>({ total: 0, conversations: [] });
    const [activeSwipeId, setActiveSwipeId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    let { setIsLoginOpen } = useGeneralStore();
    const { sendMessage, pendingMessages, newTempMessages, setNewTempMessages } = useWebSocket(contextUser?.user?.id || '');
    const fetchConversations = async () => {
        if (contextUser?.user) {
            try {
                const res = await useGetAllConversation();
                if (res) {
                    setResults(res);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized access, logging out...');
                    // Handle 401 Unauthorized error
                    setIsLoginOpen(true)
                    contextUser?.logout();  // Assuming logout method exists in the context
                } else {
                    // Handle other errors
                    console.error('Error:', error.message);
                }
            }

        }
    }

    useEffect(() => {

        fetchConversations();

    }, [contextUser?.user])

    // Lắng nghe tin nhắn mới
    useEffect(() => {
        if (newTempMessages.length > 0) {
            // Cập nhật danh sách cuộc trò chuyện với tin nhắn mới
            setResults((prev) => {
                const updatedConversations = prev.conversations.map((conversation: Conversation) => {
                    // Kiểm tra xem tin nhắn mới có thuộc về cuộc trò chuyện này không
                    const newMessages = newTempMessages.filter(
                        (msg) => msg.conversation_id === conversation.id
                    );
                    return {
                        ...conversation,
                        messages: [...(conversation.messages || []), ...newMessages],
                    };
                });
                return { ...prev, conversations: updatedConversations };
            });
            // Xóa tin nhắn tạm thời sau khi đã xử lý
            setNewTempMessages([]);
        }
    }, [newTempMessages]);


    const handleClickLogin = () => {
        setIsLoginOpen(true)
    }
    const handleSwipe = (id: number | null) => {
        // Khi vuốt tin nhắn, thiết lập tin nhắn đó là active
        setActiveSwipeId(id);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };





    const total = results ? results.total : 0;
    const conversations = results ? results.conversations : [];

    return (
        <>
            <MainLayout>
                <section className="flex flex-col w-full">
                    <nav className="flex items-center justify-between w-full p-4">
                        <button> <AiOutlineUsergroupAdd onClick={toggleModal} size={28} /> </button>
                        <div className="flex items-center">
                            <svg width="1.5em" data-e2e height="1.5em" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.4977 9C10.1195 9 9.0013 10.1153 8.99767 11.4934L8.94239 32.4934C8.93875 33.8767 10.0591 35 11.4424 35H18.7895L22.0656 39.004C23.0659 40.2265 24.9352 40.2264 25.9354 39.0039L29.2111 35H36.5587C37.942 35 39.0623 33.8767 39.0587 32.4934L39.0029 11.4934C38.9993 10.1152 37.8811 9 36.5029 9H11.4977ZM29 21H19C18.4477 21 18 21.4477 18 22V23C18 23.5523 18.4477 24 19 24H29C29.5523 24 30 23.5523 30 23V22C30 21.4477 29.5523 21 29 21Z" /></svg>
                            <div className="text-xl text-white">Inbox</div>
                        </div>
                        <button> <IoIosSearch size={28} /> </button>
                    </nav>
                    <div className="grow mt-0 sm:mt-60 bg-[#181818]">
                        {
                            !contextUser?.user &&
                            (<div onClick={handleClickLogin} className="cursor-pointer flex flex-col items-center justify-center h-full ">
                                <FiLogIn size={50} className="mb-4" />
                                {`Please log in to view conversations`}
                            </div>)
                        }

                        {
                            contextUser?.user && !conversations &&
                            (<div className="flex flex-col items-center justify-center h-full  text-xl">
                                <PiHandWavingDuotone size={100} color="#D3427A" className="mb-4" />
                                {`Let's start the conversation!`}
                            </div>)
                        }

                        <Modal isOpen={isModalOpen} onClose={toggleModal}>
                            <CreateChat fetchConversations={fetchConversations} toggleModal={toggleModal} />
                        </Modal>
                        <div className="divide-y divide-gray-400">
                            {
                                conversations && conversations?.map((conversation: Conversation) => (
                                    <SingleMessage fetchConversations={fetchConversations} activeSwipeId={activeSwipeId}
                                        setActiveSwipeId={handleSwipe} key={conversation.id} conversation={conversation} />
                                ))
                            }

                        </div>
                    </div>

                </section>


            </MainLayout>
        </>
    )
}
