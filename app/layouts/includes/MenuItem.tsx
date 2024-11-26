"use client"

import { MenuItemTypes } from "@/app/types"
import { AiOutlineHome } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { CiInboxIn } from "react-icons/ci"
import { MdHomeFilled } from "react-icons/md"
import { RiCompassDiscoverLine, RiGroupLine } from "react-icons/ri"
export default function MenuItem({ iconString, colorString, sizeString }: MenuItemTypes) {

    const icons = () => {
        if (iconString == 'For You') return <AiOutlineHome size={sizeString} color={colorString} />
        if (iconString == 'Following') return <RiGroupLine size={sizeString} color={colorString} />
        if (iconString == 'Discover') return <RiCompassDiscoverLine size={sizeString} color={colorString} />
        if (iconString == 'Inbox') return <CiInboxIn size={sizeString} color={colorString} />
        if (iconString == 'Profile') return <CgProfile size={sizeString} color={colorString} />
        if (iconString == 'Home') return <MdHomeFilled size={sizeString} color={colorString} />
    }

    return (
        <>
            <div className="w-full flex items-center p-2.5 rounded-md">
                <div className="flex items-center lg:mx-0 mx-auto">

                    {icons()}

                    <p className={`lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px] text-[${colorString}]`}>
                        {iconString}
                    </p>
                </div>
            </div>
        </>
    )
}
