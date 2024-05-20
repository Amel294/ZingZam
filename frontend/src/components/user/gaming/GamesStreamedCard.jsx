import { Card, CardBody, Image, CardFooter, Avatar, Button } from "@nextui-org/react";
import LiveIcon from "../../../../public/icons/LiveIcon";
import { useNavigate } from "react-router-dom";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useEffect, useState } from "react";
import MainLogo from '/icons/ZingZamLogo.svg';
export default function GamesStreamedCard({ stream }) {
    const [imageData, setImageData] = useState(null);
    console.log(stream);
    const navigate = useNavigate();

    const fetchImage = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/stream/getScreenshots/${ stream.streamKey }`, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'image/png' });
            const imageData = URL.createObjectURL(blob);
            setImageData(imageData);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [stream.streamKey]);

    return (
        <Card className="max-w-[400px]">
            <CardBody>
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src={imageData || MainLogo}
                    width={400}
                />
                <div className="flex justify-between pt-2">
                    <div className="flex items-center gap-4">
                        <Avatar showFallback name={stream.userId.name} src={stream.userId.picture} />
                        <h4 className="font-bold text-small">{stream.userId.username}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <LiveIcon fill="green" />
                    </div>
                </div>
                <div className="pt-3 ">
                        <h4 className="text-left pb-3">{stream.title}</h4>
                        <Button className="w-full" color="secondary" onClick={() => navigate(`/streamgame/${ stream.streamKey }`)}>Watch now</Button>
                </div>
            </CardBody>
        </Card>
    );
}
