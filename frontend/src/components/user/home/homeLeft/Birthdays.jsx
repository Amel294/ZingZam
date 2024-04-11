import { Card,  Chip,  Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import SavedIcon from "../../../../../public/icons/SavedIcon";
import BirthdayLogo from "../../../../../public/icons/BirthdayLogo";
function Birthdays() {
    const userDetails = useSelector(state => state.auth);
    console.log("user details are");
    console.log(userDetails);
    return (
        <>
            <div className="w-[300px]">
                <Card className="pb-2">
                    <div className=" w-full bg-secondary-400 flex justify-center p-2">
                        <BirthdayLogo />
                        <Chip className="text-md w-full" variant="light"  >
                            Birthday&apos;s
                        </Chip>

                    </div>
                    <Button className="m-2 flex justify-start" al startContent={<SavedIcon />} variant="light">
                        Saved Posts
                    </Button>
                    
                </Card>
            </div>
        </>
    )
}

export default Birthdays
