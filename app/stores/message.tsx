import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useGetAllConversation from '../hooks/useGetAllConversation';
import { Message } from '../types';

interface MessageStore {
    results: { [postId: string]: { total: number, conversations: Message[] } };
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
                results: {},
                total: 0,
                loading: false,
                error: null,
                setAllConversation: async (userId: string) => {
                    set({ loading: true, error: null });
                    try {
                        const result = await useGetAllConversation()

                        if (result.status && result.status != 200) return set({ error: `${result.status}` })

                        set((state) => ({
                            results: {
                                ...state.results,
                                [userId]: result,
                            },
                            loading: false,
                            error: null
                        }));

                    } catch (error) {
                        set({ error: "Không thể tải bình luận. Vui lòng thử lại.", loading: false });
                    }
                },
                clearMessages: () => set({ results: {}, loading: false, error: null }),
            }),

            {
                name: 'store',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)
