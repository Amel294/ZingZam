import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, User } from "@nextui-org/react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function App({ isLikeOpen, setIsLikeOpen, postId }) {
    const [likedUsers, setLikedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const closeModal = () => {
        setIsLikeOpen(false);
    };

    useEffect(() => {
        if (isLikeOpen) {
            setPage(1); 
            fetchLikedUsers();
        }
    }, [isLikeOpen]);

    const fetchLikedUsers = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/post/liked-users/${postId}/${page}`);
            if (response.data.isEnd === false) {
                setPage(page + 1);
                setLikedUsers((prevUsers) => [...prevUsers, ...response.data.likedUsers]);
            } else if (response.data.isEnd === true) {
                toast.error("No more liked users");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch liked users");
        }
    };

    const handleVisitProfile = (userName) => {
        navigate(`/profile/${userName}`);
    };
    const handleClose = ()=>{
        closeModal()
        setPage(1)
        setLikedUsers([])
    }

    return (
        <>
            <Modal isOpen={isLikeOpen} onClose={handleClose} className="dark text-white" placement="center" size="md" hideCloseButton="true" backdrop="opaque">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"><span>Liked Users</span> </ModalHeader>
                            <ModalBody>
                                {likedUsers.map((user) => (
                                    <div className="flex w-full justify-between" key={user._id}>
                                        <User
                                            name={user.name}
                                            description={user.username}
                                            avatarProps={{
                                                src: user.picture
                                            }}
                                        />
                                        <Button size="sm" color="secondary" onClick={() => handleVisitProfile(user.username)}>Visit Profile</Button>
                                    </div>
                                ))}
                                <Button size="sm" color="default" onClick={fetchLikedUsers}>Show more</Button>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="ghost" onPress={handleClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
