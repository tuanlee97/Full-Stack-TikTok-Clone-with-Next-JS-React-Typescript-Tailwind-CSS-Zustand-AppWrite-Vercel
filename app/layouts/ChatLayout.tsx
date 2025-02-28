import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import Loading from "../components/Loading"
import useDeviceType from "../hooks/useDeviceType"
import SideNavChat from "./includes/SideNavChat"
import TopNav from "./includes/TopNav"

export default function ChatLayout({ conversationId, children }: { conversationId: number, children: React.ReactNode }) {
	const pathname = usePathname()
	const deviceType = useDeviceType();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	useEffect(() => {
		setIsLoading(false)
	}, [])
	if (isLoading) return <Loading />;

	return (
		<>
			{deviceType !== 'mobile' && <TopNav />}
			<div className={`flex ${deviceType !== 'mobile' ? `bg-white h-screen` : `bg-black min-h-screen text-white`} justify-between mx-auto w-full lg:px-2.5 px-0 `}>
				<SideNavChat conversationId={conversationId} deviceType={deviceType} />
				{children}
			</div>
		</>
	)
}
