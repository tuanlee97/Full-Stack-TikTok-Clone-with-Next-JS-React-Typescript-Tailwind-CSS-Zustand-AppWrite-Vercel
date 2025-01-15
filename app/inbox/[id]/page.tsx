"use client"
import { useUser } from "@/app/context/user";
import useGetMessageByConversationId from "@/app/hooks/useGetMessageByReceiverId";
import useSendMessage from "@/app/hooks/useSendMessage";
import useUpdateSeenMessage from "@/app/hooks/useUpdateSeenMessage";
import useUploadsUrl from "@/app/hooks/useUploadsUrl";
import useWebSocket from "@/app/hooks/useWebSocket";
import { useGeneralStore } from "@/app/stores/general";
import { Message, Profile, Receiver } from "@/app/types";
import { debounce } from "debounce";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsImage } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { FaPaperPlane } from "react-icons/fa";
import { HiArrowNarrowLeft } from "react-icons/hi";
interface PendingMessage {
    pending: boolean;
    error?: string; // Error message, if any
}
export default function Inbox({ params }: { params: { id: number } }) {
    const router = useRouter()
    let { setIsLoginOpen } = useGeneralStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [conversationName, setConversationName] = useState<string>("")
    const [text, setText] = useState<string>("")
    const [pending, setPending] = useState<boolean>(false)
    const [receivers, setReceivers] = useState<Profile[]>([]);

    const contextUser = useUser()
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // WebSocket reference
    // const wsRef = useRef<WebSocket | null>(null);


    const { sendMessage, pendingMessages, newTempMessages, setNewTempMessages } = useWebSocket(contextUser?.user?.id || '');


    // useEffect(() => {
    //     // Mở kết nối WebSocket
    //     const ws = new WebSocket(`wss://${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}`);
    //     wsRef.current = ws;

    //     // Lắng nghe tin nhắn từ WebSocket
    //     ws.onmessage = (event) => {
    //         const incomingMessage = JSON.parse(event.data);
    //         setMessages(prevMessages => [...prevMessages, incomingMessage]);
    //     };

    //     // Dọn dẹp khi component unmount
    //     return () => {
    //         if (wsRef.current) {
    //             wsRef.current.close();
    //         }
    //     };
    // }, []);

    useEffect(() => {
        // Cuộn đến cuối tin nhắn sau khi render
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages, newTempMessages]); // Mỗi khi tin nhắn thay đổi, cuộn xuống cuối

    const fetchMessages = useCallback(async () => {
        try {
            const res = await useGetMessageByConversationId(params.id);
            console.log(res)
            setMessages(res.messages);
            setReceivers(res.receivers);
            setConversationName(res.conversation_name);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setIsLoginOpen(true);
                contextUser?.logout();
            } else {
                console.error("Error fetching messages:", error.message);
            }
        }
    }, [params.id, contextUser, setIsLoginOpen]);

    // const fetchReceiver = useCallback(async () => {
    //     try {
    //         const receiverInfo = await useGetProfileByUserId(params.receiver);
    //         setReceiver(receiverInfo);
    //     } catch (error) {
    //         console.error("Error fetching receiver:", error);
    //     }
    // }, [params.receiver]);

    useEffect(() => {
        fetchMessages();
        // fetchReceiver();
    }, [fetchMessages,
        //fetchReceiver
    ]);


    const onChangeText = useCallback(
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
        }, 500), []);
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text) return
        setPending(true);
        const receiver_ids = receivers.map(item => parseInt(item.id));
        const newMessage: Message = {
            id: Math.random().toString(36).slice(2, 22),
            sender_id: contextUser?.user?.id || '0',
            conversation_id: params.id,
            message: text,
            created_at: new Date().toISOString(),
            receiver_ids: receiver_ids

        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Gửi tin nhắn qua WebSocket
        sendMessage(newMessage);
        // Sau khi gửi tin nhắn qua WebSocket, gửi request HTTP tới backend để thêm tin nhắn vào cơ sở dữ liệu
        try {
            await useSendMessage(newMessage.conversation_id, newMessage.message);
            console.log('Message added to backend successfully');
        } catch (error) {
            console.error('Failed to add message to backend:', error);
        }

        if (inputRef.current)
            inputRef.current.value = "";

        setText("");
        setPending(false);
    }

    useEffect(() => {
        setMessages((prevMessages) => [...prevMessages, ...newTempMessages]);
        if (newTempMessages.length > 0)
            setNewTempMessages([]);
    }, [newTempMessages])

    const checkSeenBy = (messages: Message[], currentUserId: string) => {
        let isUpdate = false;

        messages.forEach(message => {
            if (currentUserId && message.seen_by && !message.seen_by.includes(Number(currentUserId))) {
                isUpdate = true;
                return;
            }
        });

        return isUpdate;
    }



    useEffect(() => {
        let currentUserId = contextUser?.user?.id || '';
        const isUpdate = checkSeenBy(messages, currentUserId);
        if (isUpdate) useUpdateSeenMessage(params.id);
    }, [])
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage(e as any);
        }
    }
    console.log(messages)
    return (
        <section className="flex flex-col h-screen bg-[#181818]">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full bg-black py-4 px-6 text-white flex items-center gap-5">
                <HiArrowNarrowLeft className="cursor-pointer" onClick={() => router.push(`/inbox`)} size={24} />
                <div className="flex items-center gap-3 relative w-full">

                    <div className="cursor-pointer">
                        <img
                            className="rounded-full min-w-[34px] h-[34px] lg:mx-0 mx-auto"
                            width={"34"}
                            height={"34"}
                            src={useUploadsUrl("")}
                        />
                    </div>
                    <p className="text-[18px] font-semibold ">

                        {conversationName || receivers.map((receiver: Receiver) => receiver.name).join(', ')}
                    </p>

                </div>
            </div>

            {/* Message Area */}
            <div className="pt-[75px] pb-[95px] flex-1 overflow-y-auto px-6 space-y-2 ">
                {
                    messages.map((_, index) => (
                        <div key={_.id} className="w-full">
                            <div className={` text-white py-2 px-4 rounded-lg w-1/2 ${contextUser?.user?.id === String(_.sender_id) ? "ml-auto bg-[#D3427A] " : "mr-auto bg-gray-600"}`}>
                                {_.message}
                                <p className="text-[10px] text-right">{moment(_.created_at).calendar()}</p>
                            </div>
                            {/* {index === messages.length - 1 &&
                                <div>
                                    <img
                                        className="rounded-full min-w-[12px] h-[12px] lg:mx-0 my-1 ml-auto"
                                        width={"12"} height={"12"}
                                        src={useUploadsUrl("")} />
                                </div>
                            } */}

                            {pendingMessages.has(_.id) && pendingMessages.get(_.id)?.pending && (
                                <div className="flex justify-end mt-1">
                                    <CiClock2 color="#FFFFFF" size={14} />
                                </div>
                            )}

                            {pendingMessages.has(_.id) && pendingMessages.get(_.id)?.error && (
                                <div className="flex justify-end mt-1 text-[10px] text-red-600">
                                    {pendingMessages.get(_.id)?.error}
                                </div>
                            )}

                        </div>
                    )
                    )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer (Input Area) */}
            <div className="fixed bottom-0 left-0 w-full bg-black px-4 py-4">
                <form className="bg-[#181818] rounded-full" onSubmit={handleSendMessage}>
                    <div className="flex items-center gap-3 px-2">
                        <input
                            onKeyUp={handleEnter}
                            ref={inputRef}
                            type="text"
                            className="w-full p-2 rounded-lg border-none bg-transparent focus:outline-none accent-white text-white py-3 px-5"
                            placeholder="Type a message..."
                            onChange={onChangeText}
                        />
                        <button className={`cursor-pointer ${text.length > 0 ? "bg-[#D3427A]" : ""} rounded-full`}>
                            {text.length > 0 ?
                                <FaPaperPlane color="#FFFFFF" size={36} className="p-2" />
                                :
                                <BsImage color={"#FFFFFF"} size={36} className="p-2" />
                            }
                        </button>
                    </div>
                </form>
            </div>
        </section>

    )
}
