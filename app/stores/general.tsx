import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useGetRandomUsers from '../hooks/useGetRandomUsers';
import { RandomUsers } from '../types';

interface GeneralStore {
    isLoginOpen: boolean,
    isEditProfileOpen: boolean,
    randomUsers: RandomUsers[]
    setIsLoginOpen: (val: boolean) => void,
    setIsEditProfileOpen: (val: boolean) => void,
    setRandomUsers: () => void,
}

export const useGeneralStore = create<GeneralStore>()(
    devtools(
        persist(
            (set) => ({
                isLoginOpen: false,
                isEditProfileOpen: false,
                randomUsers: [],

                setIsLoginOpen: (val: boolean) => set({ isLoginOpen: val }),
                setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }),
                setRandomUsers: async () => {
                    const result = await useGetRandomUsers()
                    set({ randomUsers: result })
                },
            }),
            {
                name: 'store',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)
