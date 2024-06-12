import React from "react";
import { Input } from "@nextui-org/react";
import { validatePassword } from "../../../utils/validation/formValidation";

export default function PasswordInputSignUp({ password, setPassword, passwordValid, setPasswordValid, passwordTouched }) {
    const isInvalid = React.useMemo(() => {
        if (!passwordTouched) {
            return false; // Don't show error if the input hasn't been touched
        }
        if (password === "") {
            setPasswordValid(false);
            return true;
        }
        if (validatePassword(password)) {
            setPasswordValid(true);
            return false;
        } else {
            setPasswordValid(false);
            return true;
        }
    }, [password, passwordTouched, setPasswordValid]);

    return (
        <Input
            value={password}
            placeholder="Enter your Password"
            type="password"
            label="Password"
            variant="bordered"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "secondary"}
            errorMessage={isInvalid && "Password must be 8+ characters with uppercase, lowercase, digit, & special character"}
            onChange={(e) => setPassword(e.target.value)}
            className="max-w-xs"
        />
    );
}
