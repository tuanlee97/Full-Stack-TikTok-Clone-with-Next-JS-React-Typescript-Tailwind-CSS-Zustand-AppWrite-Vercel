import { useEffect, useRef, useState } from 'react';

import { Message } from '../types';

const useWebSocket = (senderId: string, receiverId: string) => {
    const socket = useRef<WebSocket | null>(null);
    const [pendingMessages, setPendingMessages] = useState<Map<string, any>>(new Map());
    const [newTempMessages, setNewTempMessages] = useState<Message[]>([]);
    useEffect(() => {
        if (!senderId || !receiverId) return;

        const websocketUrl = window.location.hostname === 'localhost'
            ? `ws://${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}?sender_id=${senderId}&receiver_id=${receiverId}`
            : `wss://${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}?sender_id=${senderId}&receiver_id=${receiverId}`;

        // Kết nối WebSocket
        socket.current = new WebSocket(websocketUrl); // URL của WebSocket server

        socket.current.onopen = () => {
            console.log('WebSocket connection established');

        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('New message from server:', message);
            // Giả sử server gửi lại trạng thái hoặc thông tin của tin nhắn
            if (message.type === 'system') {
                setPendingMessages((prev) => {
                    sendMessage
                    const newPendingMessages = new Map(prev);
                    newPendingMessages.delete(message.id); // Xóa tin nhắn đã gửi thành công khỏi pending
                    return newPendingMessages;
                });

            } else if (message.type === 'chat') {
                setNewTempMessages((prev) => {
                    return [...prev, message.data];
                })
            } else {
                setPendingMessages((prev) => {
                    const newPendingMessages = new Map(prev);
                    newPendingMessages.set(message.id, { error: message.message }); // Lưu trạng thái lỗi
                    return newPendingMessages;
                });
            }
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.current?.close(); // Đóng kết nối WebSocket khi component bị unmount
        };
    }, [senderId]);

    const sendMessage = async (newMessage: Message) => {


        // Gửi tin nhắn qua WebSocket
        if (socket.current?.readyState === WebSocket.OPEN) {
            // Thêm tin nhắn vào pending
            setPendingMessages((prev) => {
                const newPendingMessages = new Map(prev);
                newPendingMessages.set(newMessage.id, { pending: true });
                return newPendingMessages;
            });
            console.log(JSON.stringify(newMessage))
            socket.current.send(JSON.stringify(newMessage));
        } else {
            console.error('WebSocket is not open');
            // Thêm thông báo lỗi nếu WebSocket không mở
            setPendingMessages((prev) => {
                const newPendingMessages = new Map(prev);
                newPendingMessages.set(newMessage.id, { error: '' });
                return newPendingMessages;
            });
        }
    };

    return { sendMessage, pendingMessages, newTempMessages, setNewTempMessages };
};

export default useWebSocket;
