// OtpInput.js
import { Input, Button } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OtpInputForgetPassword({ step, setStep,email,otp,setOtp }) {
    const [seconds, setSeconds] = useState(300);
    const [isLoading, setIsLoading] = useState(false)
    const [otpVerify, setOtpVerify] = useState(false)
    useEffect(() => {
        const timer =
            seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
        return () => clearInterval(timer);
    }, [seconds]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const isInvalid = useMemo(() => {
        if (otp === "") {
            setOtpVerify(false);
            return false;
        }
        if (otp.length === 6) {
            setOtpVerify(true);
            return false;
        } else {
            setOtpVerify(false);
            return true;
        }
    }, [otp, setOtpVerify]);

    const handleOtpVerify = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/user/forget-password-otp-verify', {
                otp,
                email
            }, {
                withCredentials: true
            });
            if (response.data.error) {
                toast.error(`${ response.data.error }`)
            } else {
                setStep(3)
                toast.success(`${ response.data.message }`)
            }
            await setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            toast.error("This didn't work.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        
            <Input
                value={otp}
                type="text"
                label="OTP"
                placeholder="Enter OTP Sent to Your Mail"
                variant="bordered"
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage={isInvalid && "OTP must be 6 digits"}
                onChange={(e) => setOtp(e.target.value.trim())}
                className="max-w-xs"
            />

            <Button color="secondary" onClick={handleOtpVerify}>Verify</Button>

        </>
    );
}
