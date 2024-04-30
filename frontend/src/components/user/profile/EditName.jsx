import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "../../../store/auth/authSlice";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function EditName({ isOpen, onOpen, onClose }) {
    const dispatch = useDispatch();
    const { name } = useSelector(state => state.auth);
    const [newName, setNewName] = useState(name);
    const [nameError, setNameError] = useState('');

    const handleChangeName = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/profile/update-name`, { name: newName });
            if (response.status === 200) {
                dispatch(updateUser({ field: "name", value: newName }));
                onClose();
            }
        } catch (error) {
            console.error("Error updating name:", error);
            setNameError("Failed to update name. Please try again.");
        }
    };

    const handleInputChange = (event) => {
        setNewName(event.target.value);
    };

    return (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="dark text-white">
            <ModalContent>
                <ModalHeader>Change Your Name</ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        label="New Name"
                        variant="bordered"
                        value={newName}
                        onChange={handleInputChange}
                        isInvalid={false}
                        errorMessage={nameError}
                    />
                </ModalBody>
                <ModalFooter className="px-6">
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleChangeName}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
