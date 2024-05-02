import { Card, CardBody, Image, CardFooter, Avatar } from "@nextui-org/react";
import LiveIcon from "../../../../public/icons/LiveIcon";

export default function GamesStreamedCard() {
    return (
        <Card className=" max-w-[400px]">
            <CardBody className="">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src="https://nextui.org/images/hero-card-complete.jpeg"
                    width={400}
                />
                <div className="flex justify-between pt-2">
                    <div className="flex items-center gap-4">
                        <Avatar showFallback name='Jane' src='https://images.unsplash.com/broken' />
                        <h4 className="font-bold text-small">Amel K Umesh</h4>
                    </div>
                    <div className="flex  items-center gap-4">
                        <h4 className="text-xs">1000 Watching</h4>
                        <LiveIcon fill="green" />
                    </div>

                </div>
            </CardBody>
            <CardFooter className="pt-1">
                <h4 className="text-left text-small">GTA  V - Online Multiplayer - Live & On The Move Live & On The Move</h4>
            </CardFooter>
        </Card>
    );
}
