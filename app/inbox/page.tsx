"use client"

import SingleMessage from "@/app/components/message/SingleMessage"
import { useUser } from "@/app/context/user"
import useGetAllConversation from "@/app/hooks/useGetAllConversation"
import MainLayout from "@/app/layouts/MainLayout"
import { useGeneralStore } from "@/app/stores/general"
import { Conversation, ProfilePageTypes, RandomUsers } from "@/app/types"
import { debounce } from "debounce"
import { useEffect, useState } from "react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { BiLoaderCircle } from "react-icons/bi"
import { FiLogIn } from "react-icons/fi"
import { IoIosSearch } from "react-icons/io"
import { PiHandWavingDuotone } from "react-icons/pi"
import Modal from "../components/Modal"
import useCreateConversation from "../hooks/useCreateConversation"
import useSearchProfilesByName from "../hooks/useSearchProfilesByName"
import useUploadsUrl from "../hooks/useUploadsUrl"
import useWebSocket from "../hooks/useWebSocket"
export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser();
    const [searchProfiles, setSearchProfiles] = useState<RandomUsers[]>([])
    const [listUserIds, setListUserIds] = useState<number[]>([])
    const [results, setResults] = useState<{ total: number, conversations: Conversation[] }>({ total: 0, conversations: [] });
    const [activeSwipeId, setActiveSwipeId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isPendingCreateConversation, setIsPendingCreateConversation] = useState<boolean>(false);

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

    const handleSearchName = debounce(async (event: { target: { value: string } }) => {
        if (event.target.value == "") return setSearchProfiles([])

        try {
            const result = await useSearchProfilesByName(event.target.value)
            if (result) return setSearchProfiles(result)
            setSearchProfiles([])
        } catch (error) {
            console.log(error)
            setSearchProfiles([])
            alert(error)
        }
    }, 500)

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setListUserIds([...listUserIds, parseInt(e.target.value)])
        } else {
            if (listUserIds.includes(parseInt(e.target.value))) {
                setListUserIds(listUserIds.filter(id => id !== parseInt(e.target.value)))
            }
        }
    }
    const handleCreateConversation = async () => {
        if (!contextUser?.user) return setIsLoginOpen(true);
        let currentUser = contextUser.user.id;
        setIsPendingCreateConversation(true)
        try {

            console.log("listUserIds", listUserIds)
            await useCreateConversation([Number(currentUser), ...listUserIds]);



        } catch {

        } finally {
            await fetchConversations();
            setListUserIds([]);
            setIsPendingCreateConversation(false);
            toggleModal();
        }
    }
    const total = results ? results.total : 0;
    const conversations = results ? results.conversations : [];
    console.log(isPendingCreateConversation)
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
                            <section className="bg-[#181818] h-[calc(100dvh-100px)] ">
                                <div className="wrapper pt-[80px] flex flex-col">
                                    <div className="px-5">
                                        <div className="bg-white mb-5 py-[4px] px-[6px]  flex items-center justify-evenly rounded-full overflow-hidden">
                                            <input onChange={handleSearchName} type="text" placeholder="Type name to search" className="w-full py-2 px-3 border border-none rounded focus:outline-none text-black outline-[#D3427A]" />
                                            <button className="min-w-[40px] h-[40px] rounded-full bg-[#D3427A] flex items-center justify-center"><IoIosSearch size={28} /> </button>
                                        </div>
                                    </div>
                                    <ul className="ml-0 list-none overflow-scroll h-[calc(100dvh-350px)]">

                                        {searchProfiles.length > 0 ?
                                            <div className="w-full">
                                                {searchProfiles.map((profile, index) => (
                                                    contextUser?.user?.id !== String(profile.id) && (
                                                        <li key={profile.id} className="px-5 cursor-pointer hover:bg-[#F12B56]">
                                                            <label htmlFor={profile.id} className="p-0 flex items-center  relative mb-3">
                                                                <input onChange={handleChecked} type="checkbox" id={profile.id} name={profile.id} value={profile.id} className="hidden peer" />
                                                                <span className="w-5 h-5 rounded-full border-2  peer-checked:bg-white peer-checked:border-[#D3427A] transition-all mr-3 inline-block relative before:content-[''] before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 peer-checked:before:opacity-100"></span>
                                                                <div className="p-1" key={index}>
                                                                    <div

                                                                        className="flex items-center justify-between w-full  p-1 px-2 hover:text-white"
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <img className="rounded-full" width="40" src={useUploadsUrl(profile?.image)} />
                                                                            <div className="truncate ml-2">{profile?.name}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>
                                                    )
                                                ))}
                                            </div>
                                            : <p className="text-center py-5">Search for a user to start a conversation</p>}

                                    </ul>


                                </div>
                                <div className="fixed bottom-0 bg-black w-full p-5">
                                    <button disabled={listUserIds.length === 0 || isPendingCreateConversation} onClick={handleCreateConversation}
                                        className={`${listUserIds.length === 0 || isPendingCreateConversation ? `bg-[#D3427A]/50 text-white/50 cursor-not-allowed` : `bg-[#D3427A] text-white`} w-full  p-4 rounded-md font-medium`}>
                                        {isPendingCreateConversation ? <span className="flex items-center justify-center"><BiLoaderCircle className="animate-spin text-center" color="#ffffff" size={25} /></span> : `Start a conversation${listUserIds.length > 1 ? ` (${listUserIds.length})` : ''}`}

                                    </button>
                                </div>
                            </section>
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
