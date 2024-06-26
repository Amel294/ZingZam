// EmailInputLogin.js
import { Input } from "@nextui-org/react";
import { useMemo } from "react";
import { validateEmail } from "../../../utils/validation/formValidation";

// eslint-disable-next-line react/prop-types
export default function EmailInputLogin({ email, setEmail,setEmailValid }) {
    
    const isInvalid = useMemo(() => {
        if (email === ""){
            setEmailValid(false);
            return false;
        } 
        if(validateEmail(email)){
            setEmailValid(true);
            return false;
        }else{
            setEmailValid(false);
            return true;
        }
    }, [email,setEmailValid]);
    return (
        <Input
            value={email}
            type="email"
            label="Email"
            placeholder="Enter your Email"
            variant="bordered"
            isInvalid={isInvalid || false}
            color={isInvalid ? "danger" : "secondary"}
            errorMessage={isInvalid && "Please enter a valid email"}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
        />
    );
}
