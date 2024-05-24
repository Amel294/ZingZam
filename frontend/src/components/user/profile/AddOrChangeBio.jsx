import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "../../../store/auth/authSlice";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function AddOrChangeBio({ addOrEditBio, setAddOrEditBio }) {
    const dispatch = useDispatch();
    const bio = useSelector(state => state.auth.bio);
    const [newBio, setNewBio] = useState(bio);
    const [bioError, setBioError] = useState('');

    const handleChangeBio = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/profile/add-or-change-bio`, { bio: newBio });
            if (response.status === 200) {
                dispatch(updateUser({ field: "bio", value: newBio }));
                setAddOrEditBio(false);
            }
        } catch (error) {
            console.error("Error updating bio:", error);
            setBioError("Failed to update bio. Please try again.");
        }
    };

    const handleInputChange = (event) => {
        setNewBio(event.target.value);
    };

    const handleClose = () => {
        setAddOrEditBio(false);
    };

    return (
        <Modal isOpen={addOrEditBio} onClose={handleClose} className="dark text-white" placement="center" size="md" hideCloseButton={false} backdrop="opaque">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Change Your Bio</ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                label="New Bio"
                                variant="bordered"
                                value={newBio}
                                onChange={handleInputChange}
                                isInvalid={!!bioError}
                                errorMessage={bioError}
                            />
                        </ModalBody>
                        <ModalFooter className="px-6">
                            <Button color="danger" variant="light" onPress={handleClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleChangeBio}>
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
