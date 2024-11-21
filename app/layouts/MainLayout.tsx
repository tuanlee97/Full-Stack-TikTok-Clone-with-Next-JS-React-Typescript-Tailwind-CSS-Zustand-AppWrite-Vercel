import { usePathname } from "next/navigation"
import React from "react"
import useDeviceType from "../hooks/useDeviceType"
import SideNavMain from "./includes/SideNavMain"
import TopNav from "./includes/TopNav"

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const deviceType = useDeviceType();
	return (
		<>
			{deviceType !== 'mobile' &&
				<TopNav />
			}
			<div className={`flex ${deviceType !== 'mobile' ? `bg-white` : `bg-black`} justify-between mx-auto w-full lg:px-2.5 px-0 `}>
				<SideNavMain />
				{children}
			</div>
		</>
	)
}
