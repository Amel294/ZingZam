import { Input } from "@nextui-org/react";
import { useMemo } from "react";

export default function NameInput({ name, setName, setNameValid }) {
    const isInvalid = useMemo(() => {
        if (name.trim() === "") {
            setNameValid(false);
            return true; // Set isInvalid to true for empty input
        } 
        if (name.length > 5) {
            setNameValid(true);
            return false; // Set isInvalid to false for valid input
        } else {
            setNameValid(false);
            return true; // Set isInvalid to true for input length less than or equal to 5
        }
    }, [name, setNameValid]);

    return (
        <Input
            value={name}
            type="text"
            label="Name"
            placeholder="Enter your Name"
            variant="bordered"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "secondary"}
            errorMessage={isInvalid && "Name must be at least 6 characters"}
            onChange={(e) => setName(e.target.value)}
            className="max-w-xs"
        />
    );
}