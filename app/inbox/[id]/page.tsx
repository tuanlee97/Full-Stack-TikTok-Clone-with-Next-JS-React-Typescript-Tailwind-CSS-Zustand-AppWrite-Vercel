"use client"
import DetailModal from "@/app/components/inbox/DetailModal";
import MediaOverlay from "@/app/components/MediaOverlay";
import FileUploadWithIcon from "@/app/components/message/FileUpload";
import UploadDisplay from "@/app/components/message/UploadDisplay";
import Modal from "@/app/components/Modal";
import { useUser } from "@/app/context/user";
import useCheckBase64 from "@/app/hooks/useCheckBase64";
import useDeviceType from "@/app/hooks/useDeviceType";
import useGenerateThumbnail from "@/app/hooks/useGenerateThumbnail";
import useGetMessageByConversationId from "@/app/hooks/useGetMessageByReceiverId";
import useSendMessage from "@/app/hooks/useSendMessage";
import useUnsendMessage from "@/app/hooks/useUnsendMessage";
import useUpdateSeenMessage from "@/app/hooks/useUpdateSeenMessage";
import useUploadsUrl from "@/app/hooks/useUploadsUrl";
import useWebSocket from "@/app/hooks/useWebSocket";
import ChatLayout from "@/app/layouts/ChatLayout";
import { useGeneralStore } from "@/app/stores/general";
import { Message, Profile, Receiver, Thumbnail } from "@/app/types";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { FaPaperPlane } from "react-icons/fa";
import { HiArrowNarrowLeft } from "react-icons/hi";
type ConversationInfo = {
    id: number;
    name: string;
    members: number[];
}
export default function Inbox({ params }: { params: { id: number } }) {
    const router = useRouter()
    let { setIsLoginOpen } = useGeneralStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [conversationInfo, setConversationInfo] = useState<ConversationInfo>({ id: params.id, name: '', members: [] });
    const [text, setText] = useState<string>("")
    const [files, setFiles] = useState<File[]>([]);
    const [receivers, setReceivers] = useState<Profile[]>([]);

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isExpandMenu, setExpandMenu] = useState<boolean>(false);
    const deviceType = useDeviceType();
    // const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [conversationSelected, setConversationSelected] = useState<string>("");
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

    const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState<Thumbnail>({ url: '', type: 'image' });

    const contextUser = useUser();

    const getUserId = parseInt(contextUser?.user?.id || "")

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { generateThumbnails } = useGenerateThumbnail();
    // WebSocket reference
    // const wsRef = useRef<WebSocket | null>(null);

    const handleFileSelected = (files: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...files]);
    }
    const handleChangeFileSelected = (index: number) => {
        setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            return newFiles;
        });
    }
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
            setMessages(res.messages);
            setReceivers(res.receivers);
            setConversationInfo(res.conversation);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setIsLoginOpen(true);
                contextUser?.logout();
            } else {
                console.error("Error fetching messages:", error.message);
            }
        }
    }, [params.id, contextUser, setIsLoginOpen]);
    console.log(messages)
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
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(event.target.value);
            adjustTextareaHeight();
        }, []);
    const handleGenerateThumbnails = async () => {

        const generatedThumbnails = await generateThumbnails(files);
        const videos = generatedThumbnails.filter((thumbnail) => thumbnail.type === 'video');
        const images = generatedThumbnails.filter((thumbnail) => thumbnail.type === 'image');
        return {
            videos,
            images
        };
    };
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() && (!files || files.length === 0)) return;

        const receiver_ids = receivers.map(item => parseInt(item.id));

        const medias = await handleGenerateThumbnails();
        const listMessages: Message[] = [];
        if (text.trim()) {
            const newMessage = {
                id: Math.random().toString(36).slice(2, 22),
                sender_id: contextUser?.user?.id || '0',
                conversation_id: params.id,
                message: text,
                created_at: new Date().toISOString(),
                receiver_ids: receiver_ids,
                hidden_id: []
            }
            listMessages.push(newMessage);
            sendMessage(newMessage);
            await sendMessageToServer(newMessage, 'text');
            console.log(newMessage)
        }

        if (medias.images.length > 0) {

            files.forEach((file) => {
                if (file.type.startsWith('image/')) {

                }
            });
            const newMessage = {
                id: Math.random().toString(36).slice(2, 22),
                sender_id: contextUser?.user?.id || '0',
                conversation_id: params.id,
                message: '',
                medias: medias.images,
                created_at: new Date().toISOString(),
                receiver_ids: receiver_ids,
                hidden_id: []
            }
            listMessages.push(newMessage)
            sendMessage(newMessage);
            await sendMessageToServer(newMessage, 'image');
            console.log(newMessage)
        }
        if (medias.videos.length > 0) {
            for (const item of medias.videos) {
                const newMessage = {
                    id: Math.random().toString(36).slice(2, 22),
                    sender_id: contextUser?.user?.id || '0',
                    conversation_id: params.id,
                    message: '',
                    medias: [{ ...item, thumbnail: item.url }],
                    created_at: new Date().toISOString(),
                    receiver_ids: receiver_ids,
                    hidden_id: []
                }
                listMessages.push(newMessage);
                sendMessage(newMessage);
                await sendMessageToServer(newMessage, 'video');
                console.log(newMessage)
            }

        }


        setMessages((prevMessages) => [...prevMessages, ...listMessages]);

        // Gửi tin nhắn qua WebSocket

        // Sau khi gửi tin nhắn qua WebSocket, gửi request HTTP tới backend để thêm tin nhắn vào cơ sở dữ liệu



        if (textareaRef.current)
            textareaRef.current.value = "";

        setText("");
        setFiles([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    }
    const sendMessageToServer = async (message: Message, type: string = 'text | image | video') => {
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('conversationId', String(message.conversation_id));
            if (type === 'video') formData.append('thumbnail', message.medias?.[0]?.thumbnail || '');

            if (message.message) formData.append('message', message.message);

            if (message.medias) {
                message.medias.forEach((media, index) => {
                    if (media.file)
                        formData.append(`files[${index}]`, media.file);
                });
            }



            const result = await useSendMessage(formData);

            if (result.status === 201) {
                console.log('Message added to backend successfully');
            }

        } catch (error) {
            console.error('Failed to add message to backend:', error);
        }

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

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        let currentUserId = contextUser?.user?.id || '';
        if (!currentUserId || messages.length === 0) return

        const isUpdate = checkSeenBy(messages, currentUserId);

        if (isUpdate) useUpdateSeenMessage(params.id);

    }, [contextUser?.user?.id, messages])
    const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent) => {
        if ('key' in e && e.key === 'Enter') {
            if (e.shiftKey) return;
            handleSendMessage(e as any);  // Gọi hàm gửi tin nhắn

        } else if (!('key' in e)) {
            // Nếu là sự kiện click chuột, gửi tin nhắn
            handleSendMessage(e as any);
        }
    };

    //Menu Context


    // Hàm xử lý chuột phải (desktop)
    const handleContextMenu = (event: React.MouseEvent, conversationId: string) => {
        event.preventDefault();
        setConversationSelected(conversationId);
        // setMenuPosition({ x: event.pageX, y: event.pageY });
        setShowMenu(true);
    };

    // Hàm xử lý click để đóng menu
    const handleClick = () => {
        setShowMenu(false);
        setConversationSelected("");
    };

    // Hàm xử lý long press (mobile)
    const handleTouchStart = (conversationId: string) => {
        const timer = setTimeout(() => {
            alert('Long press detected, showing menu.');
            setShowMenu(true);
            setConversationSelected(conversationId);
        }, 1000); // Thời gian long press (1 giây)
        setLongPressTimer(timer);
    };

    const handleTouchEnd = (): void => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
        }
        setConversationSelected("");
    };

    // Hàm thu hồi tin nhắn
    const recallMessage = (option: 'self' | 'both', messageId: string): void => {
        alert(`Thu hồi tin nhắn ${messageId} với tùy chọn: ${option}`);
        setShowMenu(false);
        setConversationSelected('');
        unSendMessage({
            messageId: messageId,
            type: option
        })
    };

    const unSendMessage = async ({ messageId, type }: { messageId: string, type: string }) => {
        await useUnsendMessage({
            messageId: messageId,
            type: type
        });
        fetchMessages();
    }

    const receiversObj = receivers.reduce((acc: Record<string, Profile>, receiver: Profile) => {
        acc[receiver.id] = receiver;
        return acc;
    }, {});
    const handleImageClick = (url: string, type: 'image' | 'video') => {
        setShowMediaModal(true);
        setSelectedMedia({ url, type });
    }

    const toggleExpandMenu = () => {
        setExpandMenu(!isExpandMenu);
    }
    const setConversationName = (conversationName: string) => {
        setConversationInfo({ ...conversationInfo, name: conversationName });
    }
    return (
        <ChatLayout conversationId={params.id}>
            <div className="sm:mt-[80px] w-full sm:grow sm:max-w-[calc(100vw-80px)] lg:max-w-[calc(100vw-250px)]  ml-auto sm:px-12 ">
                <section className="flex flex-col h-screen sm:h-full bg-[#181818] sm:bg-inherit">
                    {/* Header */}
                    <div className="fixed sm:static z-10 sm:z-0 top-0 left-0 w-full bg-black sm:bg-[#D3427A]/30 sm:rounded-3xl py-4 px-6 text-white sm:text-black flex items-center gap-5">
                        <HiArrowNarrowLeft className="cursor-pointer sm:hidden" onClick={() => router.push(`/inbox`)} size={24} />
                        <div className="flex items-center gap-3 relative w-full">

                            <div className="cursor-pointer border border-[#D3427A] rounded-full">
                                <img
                                    className="rounded-full min-w-[34px] h-[34px] lg:mx-0 mx-auto"
                                    width={"34"}
                                    height={"34"}
                                    src={useUploadsUrl("")}
                                />
                            </div>
                            <p className="text-[18px] font-semibold truncate">

                                {conversationInfo.name || receivers.map((receiver: Receiver) => receiver.name).join(', ')}
                            </p>

                        </div>

                        {
                            deviceType === 'mobile' && (
                                <>
                                    <BsThreeDots className="cursor-pointer" size={24} onClick={toggleExpandMenu} />
                                    <Modal isOpen={isExpandMenu} onClose={toggleExpandMenu} customClassName="animate-slide-right">
                                        <DetailModal conversation={conversationInfo} setConversationName={setConversationName} />
                                    </Modal>
                                </>

                            )
                        }

                    </div>
                    {/* Media Overlay */}
                    {showMediaModal && <MediaOverlay onClose={() => setShowMediaModal(false)} media={{ url: selectedMedia.url, type: selectedMedia.type }} />}

                    {/* Message Area */}
                    <div className="pt-[75px] pb-[95px] flex-1 overflow-y-auto px-6 space-y-2 ">
                        {
                            messages.map((_) =>
                                contextUser?.user?.id && !_.hidden_id.includes(getUserId) &&
                                (
                                    <div id={`message-${_.id}`} key={_.id}
                                        onContextMenu={(e) => handleContextMenu(e, _.id)}
                                        onClick={handleClick}
                                        onTouchStart={() => handleTouchStart(_.id)}
                                        onTouchEnd={handleTouchEnd}

                                        className={`w-full inline-flex gap-1 ${conversationSelected !== _.id && showMenu ? 'blur-sm' : ''}`}>
                                        {
                                            contextUser?.user?.id !== String(_.sender_id) &&
                                            <img src={useUploadsUrl(receiversObj[_.sender_id]?.image || "")} className="rounded-full border border-[#D3427A] min-w-[24px] h-[24px]" width={"24"} height={"24"} />
                                        }

                                        <div className={`relative text-white py-2 px-4 rounded-lg w-1/2 ${contextUser?.user?.id === String(_.sender_id) ? "ml-auto bg-[#D3427A] " : "mr-auto bg-gray-600"}`}>
                                            {_.message && <p className="mb-0" dangerouslySetInnerHTML={{ __html: _.message.replace(/\n/g, '<br />') }} />}
                                            {_.medias && (
                                                <div className={`${_.medias.length > 1 ? 'grid grid-cols-2 gap-2' : ''} w-full`}>
                                                    {_.medias.map((media, index) => (
                                                        media.type === 'image' ? <img onClick={() => handleImageClick(media.url, media.type)} key={index} src={useCheckBase64(media.url) ? media.url : useUploadsUrl(media.url)} className="w-full rounded-xl cursor-pointer" />
                                                            : <video controls onClick={() => handleImageClick(media.url, media.type)} key={index} src={useCheckBase64(media.url) ? media.url : useUploadsUrl(media.url)} className="w-full rounded-xl cursor-pointer" />
                                                        // : <div className="relative" key={index}>
                                                        //     <IoPlayCircleOutline
                                                        //         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl"
                                                        //         color="#FFFFFF"
                                                        //         size={40}
                                                        //     /><img onClick={() => handleImageClick(media.url, media.type)} key={index} src={useCheckBase64(media.url) ? media.url : media.thumbnail} className="w-full mx-auto rounded-xl object-contain cursor-pointer" /></div>

                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-[10px] text-right">{moment(_.created_at).calendar()}</p>
                                            {conversationSelected === _.id && showMenu && (
                                                <div
                                                    className="context-menu top-auto right-0 mt-3 w-full absolute text-black bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    <ul className="list-none p-0 divide-y-2">
                                                        <li className="cursor-pointer  p-4 hover:bg-gray-100 text-sm font-semibold"
                                                            onClick={() => recallMessage('self', _.id)}
                                                        >
                                                            {contextUser?.user?.id === String(_.sender_id) ? `Unsend for you` : `Remove`}
                                                            <p className="text-xs text-gray-500 font-normal">This will remove the message from your devices. Other chat members will still be able to see it.</p>
                                                        </li>
                                                        {
                                                            contextUser?.user?.id === String(_.sender_id) &&
                                                            <li
                                                                onClick={() => recallMessage('both', _.id)}
                                                                className="cursor-pointer  p-4 hover:bg-gray-100 text-sm font-semibold"
                                                            >
                                                                Unsend for everyone
                                                                <p className="text-xs text-gray-500 font-normal">This message will be unsent for everyone in the chat. Others may have already seen or forwarded it. Unsent messages can still be included in reports.</p>
                                                            </li>
                                                        }

                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Context Menu (Desktop) */}

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
                    <div className="fixed  sm:static bottom-0 left-0 w-full bg-black sm:rounded-3xl sm:bg-[#D3427A]/30 px-4 py-4">
                        <form className="bg-[#181818] sm:bg-white rounded-[20px]" onSubmit={handleSendMessage}>
                            <div className="flex items-center gap-3 px-2">
                                <textarea
                                    onKeyUp={handleEnter}
                                    ref={textareaRef}
                                    className="w-full p-2 resize-none border-none bg-transparent focus:outline-none accent-white text-white sm:text-black sm:accent-black py-3 px-5"
                                    placeholder="Type a message..."
                                    onChange={onChangeText}
                                    rows={1}
                                ></textarea>

                                <FileUploadWithIcon handleFileSelected={handleFileSelected} />
                                <button disabled={!text.length && !files.length} className={`cursor-pointer ${!text.length && !files.length ? "cursor-not-allowed" : ""} ${text.length || files.length ? "bg-[#D3427A]" : ""} rounded-full`}>
                                    <FaPaperPlane onClick={handleEnter} color="#FFFFFF" size={36} className="p-2" />
                                </button>
                            </div>
                            {/* Hiển thị ảnh đã chọn */}
                            <UploadDisplay handleChange={handleChangeFileSelected} files={files} />
                        </form>
                    </div>
                </section>
            </div>
        </ChatLayout>
    )
}
