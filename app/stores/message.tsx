import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useGetAllConversation from '../hooks/useGetAllConversation';
import { Message } from '../types';

interface MessageStore {
    conversations: { [postId: string]: Message[] };
    total: number;
    loading: boolean;
    error: string | null;
    setAllConversation: (userId: string) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>()(
    devtools(
        persist(
            (set) => ({
                conversations: {},
                total: 0,
                loading: false,
                error: null,
                setAllConversation: async (userId: string) => {
                    set({ loading: true, error: null });
                    try {
                        const result = await useGetAllConversation()

                        set((state) => ({
                            conversations: {
                                ...state.conversations,
                                [userId]: result, // Lưu bình luận cho từng postId
                            },
                            loading: false,
                        }));
                    } catch (error) {
                        set({ error: "Không thể tải bình luận. Vui lòng thử lại.", loading: false });
                    }
                },
                clearMessages: () => set({ conversations: {}, loading: false, error: null }),
            }),

            {
                name: 'store',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)
