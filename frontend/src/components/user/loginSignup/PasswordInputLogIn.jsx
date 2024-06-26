/* eslint-disable react/prop-types */
// PasswordInput.js

import { Input } from "@nextui-org/react";
import { validatePassword } from "../../../utils/validation/formValidation";
import { useMemo } from "react";

export default function PasswordInputLogIn({password,setPassword,passwordValid ,setPasswordValid}) {
    console.log(passwordValid)

    const isInvalid = useMemo(() => {
        if (password === ""){
            setPasswordValid(false)
            return false
        } 
        if (validatePassword(password)){
            setPasswordValid(true)
            return false
        } else{
            setPasswordValid(false)
            return true
        }
    }, [password,setPasswordValid]);

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
