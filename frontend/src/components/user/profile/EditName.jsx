import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'

export default function EditName() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { name } = useSelector(state => state.auth);

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

    const handleOpen = () => {
        onOpen();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Send the updated name to your backend
        const response = await fetch('/api/update-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ newName: formData.name }) 
        });

        if (response.ok) {
            // Handle successful update
            onClose();
        } else {
            // Handle error
        }
    };

    return (
        <>
            <Button onClick={handleOpen}>Change Name</Button> 
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="dark text-white">
                <ModalContent>
                    <ModalHeader>Change Your Name</ModalHeader>  
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
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
