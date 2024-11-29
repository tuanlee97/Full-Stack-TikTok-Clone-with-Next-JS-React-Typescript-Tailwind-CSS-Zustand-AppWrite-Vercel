"use client"

import { useUser } from "@/app/context/user"
import MainLayout from "@/app/layouts/MainLayout"
import { useGeneralStore } from "@/app/stores/general"
import { useProfileStore } from "@/app/stores/profile"
import { ProfilePageTypes } from "@/app/types"
import { useEffect } from "react"

export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser()
    let { setCurrentProfile, currentProfile } = useProfileStore()
    let { isEditProfileOpen, setIsEditProfileOpen } = useGeneralStore()

    useEffect(() => {
        setCurrentProfile(params?.id)
    }, [])

    return (
        <>
            <MainLayout>
                <section className="p-4 flex flex-col items-center justify-center w-full">
                    <svg width="12em" data-e2e height="12em" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.4977 9C10.1195 9 9.0013 10.1153 8.99767 11.4934L8.94239 32.4934C8.93875 33.8767 10.0591 35 11.4424 35H18.7895L22.0656 39.004C23.0659 40.2265 24.9352 40.2264 25.9354 39.0039L29.2111 35H36.5587C37.942 35 39.0623 33.8767 39.0587 32.4934L39.0029 11.4934C38.9993 10.1152 37.8811 9 36.5029 9H11.4977ZM29 21H19C18.4477 21 18 21.4477 18 22V23C18 23.5523 18.4477 24 19 24H29C29.5523 24 30 23.5523 30 23V22C30 21.4477 29.5523 21 29 21Z" /></svg>
                    <div className="text-4xl text-white">Inbox</div>
                    <p className="text-lg text-gray-400">Comming soon ...</p>
                </section>


            </MainLayout>
        </>
    )
}
