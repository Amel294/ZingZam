import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "../../../store/auth/authSlice";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useNavigate } from "react-router-dom";

export default function EditUserName({ isNameChangeModelOpen, setIsNameChangeModelOpen }) {
    const dispatch = useDispatch();
    const { username } = useSelector(state => state.auth);
    const [newName, setNewName] = useState(username);
    const [nameError, setNameError] = useState('');
    const navigate = useNavigate();

    const handleChangeName = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/profile/update-username`, { username: newName });
            if (response.status === 200) {
                dispatch(updateUser({ field: "username", value: response.data.username }));
                setIsNameChangeModelOpen(false);
                navigate(`/profile/${response.data.username}`);

            }
        } catch (error) {
            console.error("Error updating name:", error);
            setNameError("Failed to update name. Please try again.");
        }
    };

    const handleInputChange = (event) => {
        setNewName(event.target.value);
    };
    const handleClose = () => {
        setIsNameChangeModelOpen(false)
    }

    return (
        <Modal isOpen={isNameChangeModelOpen} onClose={handleClose} className="dark text-white" placement="center" size="md" hideCloseButton={false} backdrop="opaque">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Change Your Username</ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                label="New User Name"
                                variant="bordered"
                                value={newName}
                                onChange={handleInputChange}
                                isInvalid={false}
                                errorMessage={nameError}
                            />
                        </ModalBody>
                        <ModalFooter className="px-6">
                            <Button color="danger" variant="light" onPress={handleClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleChangeName}>
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
