import SingleMessage from "@/app/components/message/SingleMessage"
import { useUser } from "@/app/context/user"

import useGetAllConversation from "@/app/hooks/useGetAllConversation"
import { useGeneralStore } from "@/app/stores/general"
import { Conversation } from "@/app/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SideNavChat({ conversationId, deviceType }: { conversationId: number, deviceType: string }) {
    const router = useRouter();

    let { setRandomUsers, randomUsers } = useGeneralStore()
    let { setIsLoginOpen } = useGeneralStore();

    const contextUser = useUser()

    const [results, setResults] = useState<{ total: number, conversations: Conversation[] }>({ total: 0, conversations: [] });
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

    useEffect(() => {
        setRandomUsers()
    }, [])
    const checkLogin = (type: string) => {
        if (!contextUser?.user?.id) {
            setIsLoginOpen(true)
            return
        }
        if (type == 'profile') return router.push(`/profile/${contextUser?.user?.id}`)
        if (type == 'inbox') return router.push(`/inbox`)
        if (type == 'following') return router.push(`/following`)
    }
    const conversations = results ? results.conversations : [];
    return (
        <>
            {deviceType !== 'mobile' && (
                <div
                    id="SideNavChat"
                    className={`fixed z-10 bg-white mt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto lg:w-[240px]`}>
                    <div className="lg:w-full w-[55px] mx-auto">
                        <div className="divide-y divide-gray-400">
                            {
                                conversations && conversations?.map((conversation: Conversation) => (
                                    <SingleMessage fetchConversations={fetchConversations} activeSwipeId={conversationId}
                                        setActiveSwipeId={() => { }} key={conversation.id} conversation={conversation} />
                                ))
                            }

                        </div>
                    </div>

                </div>
            )

            }
        </>
    )
}
