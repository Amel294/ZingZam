import { Modal, ModalContent, ModalHeader, ModalFooter, Button, Input } from "@nextui-org/react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateCaption } from "../../../store/auth/postsSlice";
import { useDispatch } from "react-redux";

export default function CaptionModal({ handleClose, setIsCaptionOpen, isCaptionOpen, postId, captionText }) {
    const [caption, setCaption] = useState(captionText);
    const dispatch = useDispatch();
    const changeCaption = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.put('/post/change-caption', { postId, caption });
            if(response.data.success) {
                toast.success("Caption changed successfully");
                dispatch(updateCaption({postId,caption}))
            }else{
                toast.error("Caption not changed");
            }
            console.log(response.data);
            handleClose()
        } catch (error) {
            console.error('Error changing caption:', error);
        }
    };

    return (
        <Modal isOpen={isCaptionOpen} onClose={handleClose} className="dark text-white px-4" placement="center" size="md" hideCloseButton={false} backdrop="opaque">
            <ModalContent>
                <ModalHeader className="w-full flex text-center">Change caption</ModalHeader>
                <Input
                    size="md"
                    label="Enter new caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <ModalFooter>
                    <Button color="default" onClick={changeCaption}  >Update</Button>
                    <Button color="danger" variant="ghost" onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
