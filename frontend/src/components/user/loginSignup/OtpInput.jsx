// OtpInput.js
import { Input } from "@nextui-org/react";
import { useMemo } from "react";

// eslint-disable-next-line react/prop-types
export default function OtpInput({otp,setOtp,setOtpVerify}) {
    console.log(otp)
    
    const isInvalid = useMemo(() => {
        
        if (otp === ""){
            setOtpVerify(false);
            return false;
        } 
        if(otp.length  === 6 ){
            setOtpVerify(true);
            return false;
        }else{
            setOtpVerify(false);
            return true;
        }
    }, [otp,setOtpVerify]);
    return (
        <Input
            value={otp}
            type="text"
            label="OTP"
            placeholder="Enter OTP Send to Your Mail"
            variant="bordered"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "secondary"}
            errorMessage={isInvalid && "OTP is 6 digits"}
            onChange={(e) => setOtp(e.target.value.trim())}
            className="max-w-xs"
        />
    );
}
