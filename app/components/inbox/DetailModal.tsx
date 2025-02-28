
import useLeaveConversation from "@/app/hooks/useLeaveConversation";
import { DetailModalProps } from "@/app/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import Modal from "../Modal";
import Switch from "../Switch";
import RenameModal from "./RenameModal";

const DetailModal = ({ conversation, setConversationName }: DetailModalProps) => {
    const router = useRouter()
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    // const [isNotificationsOff, setIsNotificationsOff] = useState<boolean>(false);
    const [isShowRename, setShowRename] = useState<boolean>(false);
    const [isShowConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const handleBlockChange = (newState: boolean) => {
        setIsBlocked(newState);
        console.log('Blocking is', newState ? 'ON' : 'OFF');
    };

    // const handleNotificationsChange = (newState: boolean) => {
    //     setIsNotificationsOff(newState);
    //     console.log('Notifications are', newState ? 'OFF' : 'ON');
    // };
    const toggleConfirmDialog = () => {
        setShowConfirmDialog(!isShowConfirmDialog);
    };
    const handleLeaveGroup = async () => {
        const res = await useLeaveConversation(conversation.id);
        toggleConfirmDialog();

        if (res.status === 200) return router.push(`/inbox`);
    };
    const toggleShowRename = () => {
        setShowRename(!isShowRename);
    }
    return (
        <>
            {/* CONFIRMATION DIALOG  */}
            <ConfirmationDialog
                isOpen={isShowConfirmDialog}
                message="Are you sure you want to leave this group?"
                onConfirm={handleLeaveGroup}
                onCancel={toggleConfirmDialog} />

            {/* RENAME MODAL  */}
            <Modal showClose={false} isOpen={isShowRename} onClose={toggleShowRename} customClassName="animate-slide-up">
                <RenameModal conversation={conversation} setConversationName={setConversationName} onClose={toggleShowRename} />
            </Modal>

            {/* DETAIL MODAL  */}
            <div className="h-screen bg-black sm:h-full">
                <section className="flex flex-col h-full">
                    <div className="text-center my-5 font-semibold border-b pb-5 border-gray-500">Detail</div>
                    <div className="flex-1 overflow-y-auto">
                        <ul className="px-5">
                            <li className="cursor-pointer mb-3" onClick={toggleShowRename}>
                                Rename
                            </li>
                            <li className="flex items-center justify-between mb-3">
                                Turn off notification
                                <Switch initialState={isBlocked} onChange={handleBlockChange} label="Blocking" />
                            </li>
                            {
                                conversation.members.length > 2 &&
                                <li onClick={toggleConfirmDialog} className="text-red-500 cursor-pointer mb-3">Leave Group</li>
                            }
                            {/* <li className="text-red-500 cursor-pointer flex items-center justify-between  mb-3">
                                Block
                                <Switch initialState={isNotificationsOff} onChange={handleNotificationsChange} label="Blocking" />
                            </li>
                            <li className="text-red-500 cursor-pointer  mb-3">Report</li> */}
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
}
export default DetailModal;