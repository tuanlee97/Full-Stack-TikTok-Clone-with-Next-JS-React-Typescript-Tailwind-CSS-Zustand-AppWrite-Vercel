"use client"

import SingleMessage from "@/app/components/message/SingleMessage"
import { useUser } from "@/app/context/user"
import MainLayout from "@/app/layouts/MainLayout"
import { useGeneralStore } from "@/app/stores/general"
import { useMessageStore } from "@/app/stores/message"
import { ProfilePageTypes } from "@/app/types"
import { useEffect } from "react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoIosSearch } from "react-icons/io"
import { PiHandWavingDuotone } from "react-icons/pi"
export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser()
    let { setIsLoginOpen } = useGeneralStore();
    let { conversations, setAllConversation, clearMessages } = useMessageStore();

    useEffect(() => {
        if (!contextUser?.user) clearMessages();
    }, [contextUser, clearMessages]);

    useEffect(() => {
        console.log(contextUser?.user)
        if (contextUser?.user)
            setAllConversation(params.id);
    }, [params?.id])

    console.log(conversations);
    console.log(params?.id);
    console.log(!contextUser?.user)
    return (
        <>
            <MainLayout>
                <section className="flex flex-col p-4 w-full">
                    <nav className="flex items-center justify-between w-full">
                        <button> <AiOutlineUsergroupAdd size={28} /> </button>
                        <div className="flex items-center">
                            <svg width="1.5em" data-e2e height="1.5em" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.4977 9C10.1195 9 9.0013 10.1153 8.99767 11.4934L8.94239 32.4934C8.93875 33.8767 10.0591 35 11.4424 35H18.7895L22.0656 39.004C23.0659 40.2265 24.9352 40.2264 25.9354 39.0039L29.2111 35H36.5587C37.942 35 39.0623 33.8767 39.0587 32.4934L39.0029 11.4934C38.9993 10.1152 37.8811 9 36.5029 9H11.4977ZM29 21H19C18.4477 21 18 21.4477 18 22V23C18 23.5523 18.4477 24 19 24H29C29.5523 24 30 23.5523 30 23V22C30 21.4477 29.5523 21 29 21Z" /></svg>
                            <div className="text-xl text-white">Inbox</div>
                        </div>
                        <button> <IoIosSearch size={28} /> </button>
                    </nav>
                    <div className="grow">
                        {
                            !contextUser?.user &&
                            (<div className="flex flex-col items-center justify-center h-full text-white">
                                {`Please log in to view conversations`}
                            </div>)
                        }

                        {
                            !conversations[params.id] &&
                            (<div className="flex flex-col items-center justify-center h-full text-white text-xl">
                                <PiHandWavingDuotone size={100} color="#D3427A" className="mb-4" />
                                {`Let's start the conversation!`}
                            </div>)
                        }



                        {
                            conversations[params.id] && conversations[params.id]?.map((conversation) => (
                                <SingleMessage key={conversation.id} conversation={conversation} />
                            ))
                        }

                    </div>

                </section>


            </MainLayout>
        </>
    )
}
