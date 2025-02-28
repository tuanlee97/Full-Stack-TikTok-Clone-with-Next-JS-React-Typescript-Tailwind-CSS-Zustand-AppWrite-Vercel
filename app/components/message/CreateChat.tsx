import { useUser } from "@/app/context/user";
import useCreateConversation from "@/app/hooks/useCreateConversation";
import useSearchProfilesByName from "@/app/hooks/useSearchProfilesByName";
import useUploadsUrl from "@/app/hooks/useUploadsUrl";
import { useGeneralStore } from "@/app/stores/general";
import { RandomUsers } from "@/app/types";
import { debounce } from "debounce";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

interface CreateChatProps {
    fetchConversations: () => Promise<void>;
    toggleModal: () => void;
}

const CreateChat = ({ fetchConversations, toggleModal }: CreateChatProps) => {
    let { setIsLoginOpen } = useGeneralStore();
    const contextUser = useUser();
    const [searchProfiles, setSearchProfiles] = useState<RandomUsers[]>([])
    const [listUserIds, setListUserIds] = useState<number[]>([])
    const [isPendingCreateConversation, setIsPendingCreateConversation] = useState<boolean>(false);
    const handleSearchName = debounce(async (event: { target: { value: string } }) => {
        if (event.target.value == "") return setSearchProfiles([])

        try {
            const result = await useSearchProfilesByName(event.target.value)
            if (result) return setSearchProfiles(result)
            setSearchProfiles([])
        } catch (error) {
            console.log(error)
            setSearchProfiles([])
            alert(error)
        }
    }, 500);
    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setListUserIds([...listUserIds, parseInt(e.target.value)])
        } else {
            if (listUserIds.includes(parseInt(e.target.value))) {
                setListUserIds(listUserIds.filter(id => id !== parseInt(e.target.value)))
            }
        }
    }

    const handleCreateConversation = async () => {
        if (!contextUser?.user) return setIsLoginOpen(true);
        let currentUser = contextUser.user.id;
        setIsPendingCreateConversation(true)
        try {

            console.log("listUserIds", listUserIds)
            await useCreateConversation([Number(currentUser), ...listUserIds]);



        } catch {

        } finally {
            await fetchConversations();
            setListUserIds([]);
            setIsPendingCreateConversation(false);
            toggleModal();
        }
    }

    return (
        <section className="bg-[#181818] sm:bg-inherit h-[calc(100dvh-100px)] sm:h-full">
            <div className="wrapper pt-[80px] flex flex-col">
                <div className="px-5">
                    <div className="bg-white mb-5 py-[4px] px-[6px]  flex items-center justify-evenly rounded-full sm:border overflow-hidden">
                        <input onChange={handleSearchName} type="text" placeholder="Type name to search" className="w-full py-2 px-3 border border-none rounded focus:outline-none text-black outline-[#D3427A]" />
                        <button className="min-w-[40px] h-[40px] rounded-full bg-[#D3427A] flex items-center justify-center"><IoIosSearch className="sm:text-white" size={28} /> </button>
                    </div>
                </div>
                <ul className="ml-0 list-none overflow-scroll h-[calc(100dvh-350px)] sm:h-full sm:min-h-[300px] sm:max-h-[400px] sm:overflow-auto">

                    {searchProfiles.length > 0 ?
                        <div className="w-full">
                            {searchProfiles.map((profile, index) => (
                                contextUser?.user?.id !== String(profile.id) && (
                                    <li key={profile.id} className="px-5 cursor-pointer hover:bg-[#F12B56]">
                                        <label htmlFor={profile.id} className="p-0 flex items-center  relative mb-3">
                                            <input onChange={handleChecked} type="checkbox" id={profile.id} name={profile.id} value={profile.id} className="hidden peer" />
                                            <span className="w-5 h-5 rounded-full border-2  peer-checked:bg-white peer-checked:border-[#D3427A] transition-all mr-3 inline-block relative before:content-[''] before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 peer-checked:before:opacity-100"></span>
                                            <div className="p-1" key={index}>
                                                <div

                                                    className="flex items-center justify-between w-full  p-1 px-2 hover:text-white"
                                                >
                                                    <div className="flex items-center">
                                                        <img className="rounded-full" width="40" src={useUploadsUrl(profile?.image)} />
                                                        <div className="truncate ml-2">{profile?.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </li>
                                )
                            ))}
                        </div>
                        : <p className="text-center py-5">Search for a user to start a conversation</p>}

                </ul>


            </div>
            <div className="fixed sm:static bottom-0 bg-black sm:bg-inherit w-full p-5 ">
                <button disabled={listUserIds.length === 0 || isPendingCreateConversation} onClick={handleCreateConversation}
                    className={`${listUserIds.length === 0 || isPendingCreateConversation ? `bg-[#D3427A]/50 text-white/50 cursor-not-allowed` : `bg-[#D3427A] text-white`} w-full  p-4 rounded-md font-medium`}>
                    {isPendingCreateConversation ? <span className="flex items-center justify-center"><BiLoaderCircle className="animate-spin text-center" color="#ffffff" size={25} /></span> : `Start a conversation${listUserIds.length > 1 ? ` (${listUserIds.length})` : ''}`}

                </button>
            </div>
        </section>);
};
export default CreateChat;