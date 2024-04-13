// OtpInput.js
import { Input, Button } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OtpInput({ otp, setOtp, setOtpVerify, onResend }) {
    const [seconds, setSeconds] = useState(300); // Initial countdown time in seconds

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

    const handleResend = async () => {
        setSeconds(300);
        try {
            const response = await axios.post('http://localhost:8000/user/resend-otp', null, {
                withCredentials: true
            });

            if (response.data.error) {
                toast.error(`${ response.data.error }`);
            } else {
                toast.success(`OTP resent successfully`);
            }
        } catch (error) {
            toast.error("Failed to resend OTP.");
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
            <div className="ps-1">
                {seconds <= 0 ? <div>Otp Expired</div>: 
                <div>Otp expires in {minutes} min {remainingSeconds} sec</div>
                }
            </div>
            <Button onClick={handleResend}>Resend OTP</Button>
        </>
    );
}
