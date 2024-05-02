import { useEffect, useState } from "react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import Post from "../postComponents/Post";
import { Modal, ModalContent } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsSuccess } from "../../../store/auth/postsSlice";
import PostProfile from "../postComponents/PostProfile";

export default function PostPopUpModel({ handleClose, setIsPostOpen, isPostOpen, postId }) {
    
    return (
        <>
            <Modal isOpen={isPostOpen} onClose={handleClose} className="dark text-white flex justify-center" placement="center" size="sm" hideCloseButton={false} backdrop="opaque">
                <ModalContent>
                    {postId &&
                        <PostProfile  postId={postId}  />
                    }
                </ModalContent>
            </Modal>
        </>
    );
}
