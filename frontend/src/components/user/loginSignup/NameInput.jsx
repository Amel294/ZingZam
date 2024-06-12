import { Input } from "@nextui-org/react";
import { useMemo } from "react";

export default function NameInput({ name, setName, setNameValid, nameTouched }) {
    const isInvalid = useMemo(() => {
        if (!nameTouched) {
            return false;
        }
        if (name.trim() === "") {
            setNameValid(false);
            return true;
        } 
        if (name.length >= 6) {
            setNameValid(true);
            return false;
        } else {
            setNameValid(false);
            return true;
        }
    }, [name, nameTouched, setNameValid]);

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
