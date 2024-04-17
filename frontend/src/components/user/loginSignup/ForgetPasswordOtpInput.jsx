

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { validatePassword } from "../../../utils/validation/formValidation";
import toast from 'react-hot-toast';
import {  useNavigate } from "react-router-dom";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function ForgetPasswordOtpInput({email,otp}) {
    const [passwordValid, setPasswordValid] = useState(false);
    const navigate = useNavigate()
    const [password, setPassword] = useState("");
    const isInvalid = React.useMemo(() => {
        if (password === "") {
            setPasswordValid(false)
            return false
        }
        if (validatePassword(password)) {
            setPasswordValid(true)
            return false
        } else {
            setPasswordValid(false)
            return true
        }
    }, [password, setPasswordValid]);
    const handleForgotPasswordChange = async () => {
        try {
            if (!passwordValid) {
                return;
            }
            const response = await AxiosWithBaseURLandCredentials.post('/user/forget-password-change', {
                password,
                email,
                otp
            }, {
                withCredentials: true
            });
            toast.success(` ${ response.data.message } `)
            setTimeout(() => {
                navigate("/login");
            }, 2000)
            console.log(response);
        } catch (error) {
            toast.error(`${error.response.data.error}`)
        }
    }
    return (
        <>

            <Input
                value={password}
                placeholder="Enter New Password"
                type="password"
                label="Password"
                variant="bordered"
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage={isInvalid && "Password must be 8+ characters with uppercase, lowercase, digit, & special character"}
                onChange={(e) => setPassword(e.target.value)}
                className="max-w-xs"
            />
            <Button color="secondary" onClick={handleForgotPasswordChange}>Confirm New Password</Button>
        </>
    );
}
