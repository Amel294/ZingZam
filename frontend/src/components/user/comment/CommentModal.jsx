import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import user2 from '/Avatar/user2.jpg'
export default function App({isOpen,setIsOpen}) {

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={closeModal} placement="bottom" className="my-0 py-0 h-[75vh] lg:w-[100vw]  lg:rounded-s-lg rounded-lg lg:my-0 bg-black text-white" size="full" hideCloseButton="true">
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col items-center  pb-1  rounded-l-lg rounded-r-lg rounded-b-none bg-secondary-400">Comments</ModalHeader>
                        <ModalBody className="overflow-y-auto ">
                        <comment className="flex flex-row gap-4">
                        <div >
                            <img className="rounded-full" src={user2} alt="avatar" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs">Amel&nbsp;&nbsp;  </span>
                            <span> This is amazing</span>
                        </div>
                    </comment>
                        </ModalBody>
                        <ModalFooter >
                            <Button color="danger" variant="light" onPress={closeModal}>
                                Close
                            </Button>
                            <Button color="primary" onPress={closeModal}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}
