import { useEffect, useState } from "react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import Post from "../postComponents/Post";
import { Modal, ModalContent } from "@nextui-org/react";

export default function PostPopUpModel({ handleClose, setIsPostOpen, isPostOpen, postId }) {
    const [post, setPost] = useState(null)
    useEffect(() => {
        const fetchPost = async () => {
            if (postId == null) return;
            try {
                const response = await AxiosWithBaseURLandCredentials.get(`/post/get-Post/${ postId }`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <>
            <Modal isOpen={isPostOpen} onClose={handleClose} className="dark text-white" placement="center" size="sm" hideCloseButton={false} backdrop="opaque">
                <ModalContent>
                        <Post post={post} postId={postId}  />
                </ModalContent>
            </Modal>
        </>
    );
}
