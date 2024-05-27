import { Button, Card, CardHeader, Divider, Input, Modal, ModalContent } from "@nextui-org/react";
import { useState } from "react";

function SendCoinsModel({ isSendCoinOpen, setIsSendCoinOpen, streamKey, onSendGift }) {
    const [coins, setCoins] = useState('');
    const [message, setMessage] = useState('');

    const handleCoinChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        setCoins(value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const sendCoins = async () => {
        try {
            await onSendGift(coins, message);
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setMessage('');
        setCoins('');
        setIsSendCoinOpen(false);
    };

    return (
        <Modal isOpen={isSendCoinOpen} onClose={handleClose} className="dark text-white" placement="center" size="md" hideCloseButton={false} backdrop="opaque">
            <ModalContent>
                {(onClose) => (
                    <Card className="dark text-white">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">Send Zing Coins</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <div className="p-3 ">
                            <div className="flex flex-col items-center pb-4">
                                <span className="w-full pb-2">Send Coins</span>
                                <Input
                                    placeholder="Enter how many coins you want to send"
                                    value={coins}
                                    onChange={handleCoinChange}
                                />
                            </div>
                            <div className="flex flex-col items-center pb-4">
                                <span className="w-full pb-2">Enter Message</span>
                                <Input
                                    placeholder="Message"
                                    value={message}
                                    onChange={handleMessageChange}
                                />
                            </div>
                            <Button color="secondary" className="w-full" onClick={sendCoins}>Send</Button>
                        </div>
                    </Card>
                )}
            </ModalContent>
        </Modal>
    );
}

export default SendCoinsModel;
