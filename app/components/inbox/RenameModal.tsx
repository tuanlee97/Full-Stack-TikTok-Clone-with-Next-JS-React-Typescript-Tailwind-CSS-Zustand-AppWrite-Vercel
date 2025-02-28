import useUpdateConversation from "@/app/hooks/useLeaveConversation";
import { DetailModalProps } from "@/app/types";
import { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

interface RenameModalProps extends DetailModalProps {
    onClose: () => void
}
const RenameModal = ({ conversation, setConversationName, onClose }: RenameModalProps) => {
    const [name, setName] = useState<string>(conversation.name);
    const handleChangeName = (event: { target: { value: string } }) => {
        setName(event.target.value);
    }
    const updateName = async () => {
        //Check
        if (name === conversation.name) {
            onClose();
        } else {
            //Call API
            await useUpdateConversation({ id: conversation.id, conversation_name: name });
            setConversationName(name);
            onClose();
        }


    }
    return (
        <div className="h-[300px] bg-[#242424] rounded-t-[20px] overflow-hidden">
            <section className="flex flex-col h-full">
                <div className="flex justify-between items-center my-5 px-4 border-b pb-5 border-gray-500">
                    <button onClick={onClose} className="text-[#F02C56]">Cancel</button>
                    <h1 className="font-semibold text-md">Rename</h1>
                    <button onClick={updateName} className="text-[#F02C56] font-semibold">Done</button>
                </div>
                <div className="mx-4 relative">
                    <input placeholder="Conversation Name" value={name} onChange={handleChangeName} className="w-full outline-none h-[40px] rounded-md py-2 ps-2 pe-6 bg-[#F1F1F2] text-black  border-gray-500" />
                    <FaTimesCircle onClick={() => setName('')} className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer" size="18" />
                </div>
            </section>
        </div>
    );
}
export default RenameModal;