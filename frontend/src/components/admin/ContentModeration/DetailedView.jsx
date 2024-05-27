import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Dropdown, DropdownTrigger, Image, Modal, ModalBody, ModalContent, Spinner } from "@nextui-org/react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Comments from "../../user/postComponents/Comments";
import MenuDots from "../../../../public/icons/MenuDots";

export default function DetailedView({ isDetailedOpen, setIsDetailedOpen, reportId }) {
    const [post, setPost] = useState();
    const [reportDetails, setReportDetails] = useState();
    const [isLoading, setIsLoading] = useState(false);
    console.log({ reportDetails })
    const handleClose = () => {
        setIsDetailedOpen(false);
    };

    const handleChangeStatus = async () => {
        try {
            setIsLoading(true)
            const response = await AxiosWithBaseURLandCredentials.post(`/admin/block-user/${ reportDetails.reportedUser._id }/${ reportId }`, {}, { withCredentials: true });
            if (response) {
                toast.success('User blocked and report updated successfully');
                setReportDetails(prevDetails => ({
                    ...prevDetails,
                    status: 'closed',
                    actionTaken: 'block'
                }));
            } else {
                toast.error('Failed to update the report status');
            }
            handleClose()
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const getDetails = async () => {
        if (reportId == null) return;
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/report/details/${ reportId }`);
            if (response) {
                setPost(response.data.post[0]);
                setReportDetails(response.data.reportDetails);
                toast.success("Data Fetched");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        getDetails();
    }, [reportId]);

    return (
        <Modal isOpen={isDetailedOpen} onClose={handleClose} className="dark text-white w-full shadow-none"
            placement="center" size="5xl" backdrop="blur">
            <ModalContent className="pb-2">
                <ModalBody>
                    <div className="grid grid-cols-2">
                        {post && (
                            <Card className="max-w-[400px] flex col-span-1">
                                <CardHeader className="flex justify-between">
                                    <div className="flex gap-3 cursor-pointer">
                                        <Avatar showFallback name={post?.postedBy?.name} alt="nextui logo" height={40} radius="full" src={post?.postedBy?.picture} width={40} />
                                        <div>
                                            <p className="text-md">{post?.postedBy[0]?.name}</p>
                                            <p className="text-xs">@{post?.postedBy[0]?.username}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <Image
                                        alt="nextui logo"
                                        radius="sm"
                                        src={post?.imageUrl}
                                        width={380}
                                        onError={() => console.error("Error loading image:", img)}
                                    />
                                    <p className="pt-2">{post?.caption}</p>
                                </CardBody>
                                {/* <Comments postId={post?._id} postType={post?.type}  /> */}
                            </Card>
                        )}
                        {reportDetails && (
                            <div className="col-span-1 p-4 border rounded-md shadow-sm">
                                <span className="font-semibold">Reported for: </span>
                                <span>{reportDetails.reason}</span>
                                <hr className="my-2" />
                                <div className="font-semibold">Report description:</div>
                                <div className="mb-2">{reportDetails.description}</div>
                                <hr className="my-2" />
                                <div className="font-semibold">Reported by:</div>
                                <div className="mb-2">{reportDetails.reportedBy.name}</div>
                                <hr className="my-2" />
                                <div className="flex gap-4 pt-4">
                                    {isLoading ? <Spinner /> :
                                        <Button color="danger" onClick={() => handleChangeStatus()}>Block user</Button>
                                    }
                                    <Button color="warning">Delete Post</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
