import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Tabs,
    Tab,
    Button,
    Textarea,
    Modal,
    ModalContent,
    Checkbox
} from "@nextui-org/react";
import DeleteIcon from '../../../../public/icons/DeleteIcon';
import UploadImage from "../../../../public/icons/UploadImage";
import { useState, useRef, useCallback } from "react";
import { Progress } from "@nextui-org/react";
import toast from "react-hot-toast";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

// eslint-disable-next-line react/prop-types
export default function AddPostModal({ isOpen, onOpenChange }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [caption, setCaption] = useState("")
    const fileInputRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
    const [showProgress, setShowProgress] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const handlePrivate = () => {
        setIsPrivate(!isPrivate)
    }
    const handleDragEvents = useCallback((e) => {
        e.preventDefault();

        switch (e.type) {
            case 'dragover':
            case 'dragenter':
                break;
            case 'dragleave':
            case 'drop':
                break;
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImageChange(file);
    }, []);

    const handleUpload = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (file) => {
        if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result);
            reader.readAsDataURL(file);
        } else {
            toast.error("Only PNG and JPEG files are accepted.");
        }
    };

    const handleDelete = () => {
        setImageSrc(null);
    };

    const handlePostImage = () => {
        try {
            if (!imageSrc) {
                toast.error("Please upload an image.");
                return;
            }
            if (caption.trim() === "") {
                toast.error("Please add a caption");
                return;
            }
            setShowProgress(true);
            const formData = new FormData();
            formData.append("image", fileInputRef.current.files[0]);
            formData.append("caption", caption);
            formData.append("isPrivate", isPrivate);

            AxiosWithBaseURLandCredentials.post('/post/uploadPhoto', formData, {
                withCredentials: true, // Include withCredentials option here
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                }
            })
                .then(response => {
                    if (response.data.posted === true) {
                        toast.success(response.data.message)
                        setUploadProgress(0)
                        setImageSrc(null)
                        onOpenChange(false)
                        setCaption("")
                        setShowProgress(false)
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle error here if needed
                });
        } catch (error) {
            console.error('Error:', error);
            // Handle error here if needed
        }
    };

    return (
        <>
            <Modal placement="center" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} className="dark  ">
                <ModalContent >
                    {/* eslint-disable-next-line no-unused-vars */}
                    {(onClose) => (
                        <Card className="text-white">
                            <CardHeader className=" ">
                                <CardBody className="flex flex-row w-full justify-between items-center px-1  ">
                                    <p className="text-xl">Add Post</p>
                                    <Tabs key="bordered" variant="underlined" aria-label="Tabs variants" color="secondary" size="lg">
                                        <Tab color="secondary" key="photos" title="Photos" />
                                        <Tab key="videos" title="Feelings" />
                                    </Tabs>
                                    <div className="bg-gray-500 px-3 pb-1 pt-1 rounded-3xl text-md" onClick={onOpenChange}><span>x</span></div>
                                </CardBody>
                            </CardHeader>
                            <CardBody className="   " >
                                <Card className="   ">
                                    <CardBody
                                        className="overflow-visible flex items-center    text-white border-0"
                                        onDragOver={handleDragEvents}
                                        onDragEnter={handleDragEvents}
                                        onDragLeave={handleDragEvents}
                                        onDrop={handleDrop}
                                        onClick={handleUpload}
                                    >
                                        {imageSrc ? (
                                            <Image
                                                alt="Uploaded image"
                                                className="object-scale-down rounded-xl w-screen h-64 "
                                                src={imageSrc}
                                            />
                                        ) : (
                                            <div className="object-cover rounded-xl w-full h-64 flex items-center justify-center border-2 border-dashed space-x-4 flex-col">
                                                <div className="opacity-50">
                                                    <UploadImage />
                                                </div>
                                                <h3 className="font-small text-large pt-4 px-2 text-center opacity-50">Drag and drop or press to Upload image</h3>
                                                <h3 className="font-small text-small text-center pt-4 px-4 opacity-50">PNG and JPG files are accepted.</h3>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".png, .jpg, .jpeg"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleImageChange(e.target.files[0])}
                                        />
                                    </CardBody>
                                    <div className="pb-3 flex px-3 justify-end gap-5    ">
                                        {imageSrc && (
                                            <Button onClick={handleDelete} color="danger" variant="bordered" size="sm" endContent={<DeleteIcon />}></Button>
                                        )}
                                    </div>
                                    <p className="text-gray-300 px-4 text-sm">Caption</p>
                                    <Textarea
                                        color="secondary"
                                        variant="underlined"
                                        className=" px-3     text-white "
                                        maxRows={3}
                                        placeholder="Enter your caption..."
                                        onValueChange={setCaption}
                                        value={caption}
                                    />
                                </Card>
                            </CardBody>

                            <CardFooter className="px-5 pb-5">
                                <Checkbox color="secondary" size="sm" className="dark" onValueChange={handlePrivate}>
                                    Set as Private
                                </Checkbox>

                            </CardFooter>
                            <CardFooter className="px-5 pb-5">

                                <Button color="secondary" className="w-full " onClick={handlePostImage}>
                                    Post
                                </Button>

                            </CardFooter>
                            {showProgress &&

                                <CardFooter className="px-5 pb-5">
                                    <Progress aria-label="Loading..." value={uploadProgress} className="max-w-md" />
                                </CardFooter>
                            }
                        </Card>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
