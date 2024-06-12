import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalContent, Spinner } from "@nextui-org/react";
import CopyIcon from '../../../../public/icons/CopyIcon';
import AxiosWithBaseURLandCredentials from '../../../axiosInterceptor';

function ServerAndKeyModel({ isServerAndKeyModelOpen, setIsServerAndKeyModelOpen }) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [streamData, setStreamData] = useState(null);

    const handleClose = () => {
        setIsServerAndKeyModelOpen(false);
    };

    const handleNewKey = () => {
        setStreamData(null);
        setTitle("");
    };

    return (
        <Modal isOpen={isServerAndKeyModelOpen} onClose={handleClose} className="dark text-white" placement="center" size="md" hideCloseButton={false} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <Card className="dark text-white">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">Start Stream</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        {streamData ? (
                            <GeneratedApiAndServer streamData={streamData} handleNewKey={handleNewKey} />
                        ) : (
                            <SetTitle
                                title={title}
                                setTitle={setTitle}
                                setLoading={setLoading}
                                loading={loading}
                                setStreamData={setStreamData}
                                onClose={onClose} 
                            />
                        )}
                    </Card>
                )}
            </ModalContent>
        </Modal>
    );
}

function SetTitle({ title, setTitle, setLoading, loading, setStreamData, onClose }) {
    const fetchApiAndServerKey = async () => {
        if (!title.trim()) {
            console.log("Title is empty");
            return;
        }
        
        try {
            setLoading(true);
            const response = await AxiosWithBaseURLandCredentials.post('/stream/stream-keys-generate', { title: title });
            setStreamData(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const handleTitleChange = (e) => {
        if (e.target.value.length <= 75) {
            setTitle(e.target.value);
        }
    };

    return (
        <CardBody className="flex gap-2 py-4">
            <Input placeholder="Enter title for stream" value={title} onChange={handleTitleChange} maxLength={75} />
            <div className="flex items-center w-full justify-center">
                <Button className="bg-secondary-400 w-full" variant="solid" onClick={fetchApiAndServerKey} disabled={!title.trim()}> {/* Disable button if title is empty */}
                    {loading ? <Spinner className='min-h-[200px]' /> : "Generate Stream Key"}
                </Button>
            </div>
        </CardBody>
    );
}

function GeneratedApiAndServer({ streamData, handleNewKey }) {
    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log("Copied to clipboard:", text);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <CardBody className="flex flex-col gap-4 py-4">
            <div className='flex justify-between items-center'>
                <p>API Key: </p>
                <div className='flex gap-2 items-center'>
                    <span>{streamData.streamKey}</span>
                    <Button variant='light' isIconOnly={true} size='sm' onClick={() => handleCopy(streamData.streamKey)}>
                        <CopyIcon />
                    </Button>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <p>Streaming Server: </p>
                <div className='flex gap-2 items-center'>
                    <span>{streamData.serverLink}</span>
                    <Button variant='light' isIconOnly={true} size='sm' onClick={() => handleCopy(streamData.serverLink)}>
                        <CopyIcon />
                    </Button>
                </div>
            </div>
            <Button className="bg-secondary-400 w-full" variant="solid" onClick={handleNewKey}>
                Generate New Stream Key
            </Button>
        </CardBody>
    );
}

export default ServerAndKeyModel;
