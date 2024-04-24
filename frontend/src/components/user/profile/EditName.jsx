import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function EditName({ isOpen, onOpen, onClose }) {
    const { name } = useSelector(state => state.auth);
    const handleChangeName = async (e) => {
        const response = await AxiosWithBaseURLandCredentials.post(`/profile/update-name`, { name: formData.name });
        if (response.status === 200) {
            toast.success("Name Updated")
        }
    }
    const [formData, setFormData] = useState({
        name: '',
        nameError: '',
    });

    useEffect(() => {
        setFormData({
            name: name || '',
            nameError: '',
        });
    }, [name]);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="dark text-white">
                <ModalContent>
                    <ModalHeader>Change Your Name</ModalHeader>  
                    <ModalBody>
                        <form onSubmit={handleChangeName}>
                            <Input
                                type="text"
                                label="New Name"
                                variant="bordered"
                                defaultValue={formData.name}
                                name="name" 
                                onChange={handleInputChange}
                                isInvalid={false} 
                                errorMessage={formData.nameError}
                            />
                            <ModalFooter className="px-0">
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button type="submit" color="primary">
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
