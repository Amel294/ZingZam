import { Input } from "@nextui-org/react";
import { useMemo } from "react";
import { validateEmail } from "../../../utils/validation/formValidation";

export default function EmailInput({ email, setEmail, emailValid, setEmailValid, emailTouched }) {
    const isInvalid = useMemo(() => {
        if (!emailTouched) {
            return false; // Don't show error if the input hasn't been touched
        }
        if (email === "") {
            setEmailValid(false);
            return true;
        }
        if (validateEmail(email)) {
            setEmailValid(true);
            return false;
        } else {
            setEmailValid(false);
            return true;
        }
    }, [email, emailTouched, setEmailValid]);

    return (
        <Input
            value={email}
            type="email"
            label="Email"
            placeholder="Enter your Email"
            variant="bordered"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "secondary"}
            errorMessage={isInvalid && "Please enter a valid email"}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
        />
    );
}
