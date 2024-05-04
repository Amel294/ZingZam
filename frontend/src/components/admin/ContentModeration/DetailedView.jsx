import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Dropdown, DropdownTrigger, Image, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Comments from "../../user/postComponents/Comments";
import MenuDots from "../../../../public/icons/MenuDots";

export default function DetailedView({ isDetailedOpen, setIsDetailedOpen, reportId }) {
    const [post, setPost] = useState()
    const [reportDetails, setReportDetails] = useState()
    const handleClose = () => {
        setIsDetailedOpen(false);
    };
    const getDetails = async () => {
        if (reportId == null) return
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/report/details/${ reportId }`);
            if (response) {
                setPost(response.data.post[0])
                setReportDetails(response.data.reportDetails)
                toast.success("Data Fetched");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };
    useEffect(() => {
        getDetails()
    }, [reportId])
    return (
        <Modal isOpen={isDetailedOpen} onClose={handleClose} className="dark text-white w-full shadow-none"
            placement="center" size="5xl" backdrop="blur">
            <ModalContent className="pb-2">
                <ModalBody>
                    <div className="grid grid-cols-2">

                        {post &&
                            <Card className="max-w-[400px] flex col-span-1">
                                {console.log(post)}
                                <CardHeader className="flex justify-between">
                                    <div className="flex gap-3 cursor-pointer">
                                        <Avatar showFallback name={post?.postedBy?.name} alt="nextui logo" height={40} radius="full" src={post?.postedBy?.picture} width={40} />
                                        <div>
                                            <p className="text-md" >{post?.postedBy[0]?.name}</p>
                                            <p className="text-xs" >@{post?.postedBy[0]?.username}</p>

                                        </div>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <Image
                                        alt="nextui logo"
                                        // height={40}
                                        radius="sm"
                                        src={post?.imageUrl}
                                        width={380}
                                        onError={() => console.error("Error loading image:", img)}

                                    />
                                    <p className="pt-2">{post?.caption} </p>
                                </CardBody>

                                {/* <Comments postId={post?._id} postType={post?.type}  /> */}

                            </Card >
                        }
                        {reportDetails &&
                            <div className="col-span-1">
                                <span className="">reported for : </span>
                                <span>{reportDetails.reason}</span>
                                <Divider/>
                                <div> Report description</div>
                                <div>{reportDetails.description}</div>
                                <Divider/>
                                <div> Reported by</div>
                                <div> {reportDetails.reportedBy.name} </div>
                                <Divider/>
                            </div>
                        }
                    </div>

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
