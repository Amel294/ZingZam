// ForgotPassword.jsx
import { useMemo, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { validateEmail } from "../../../utils/validation/formValidation";
import OtpInputForgetPassword from "./OtpInputForgetPassword";
import ForgetPasswordOtpInput from "./ForgetPasswordOtpInput";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
export default function ForgotPasswordSide() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("")

    const [emailValid, setEmailValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleForgotEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (emailValid === false) {
                toast.error("Invalid Username or password")
                return
            }
            const response = await AxiosWithBaseURLandCredentials.post('/user/forget-password', {
                email,
            }, {
                withCredentials: true
            });
            console.log("responde isssssss")
            console.log(response);
            if (response.data.error) {
                toast.error(`${ response.data.error }`)
            } else {
                toast.success(` ${ response.data.message }`)
                setStep(2)
            }
        } catch (error) {
            toast.error(`${ error.response.data.error }`)
        } finally {
            setIsLoading(false);
        }
    };

    const emailIsInvalid = useMemo(() => {
        if (email === "") {
            setEmailValid(false);
            return false;
        }
        if (validateEmail(email)) {
            setEmailValid(true);
            return false;
        } else {
            setEmailValid(false);
            return true;
        }
    }, [email, setEmailValid]);

    return (
        <div className="flex flex-col w-full items-center">
            <Card className="max-w-full w-[340px] h-auto">
                <CardHeader className="flex justify-center items-center gap-4">
                    <div className="flex flex-col ">
                        <p className="text-lg">Forgot your password</p>
                    </div>
                </CardHeader>
                <CardBody className="overflow-hidden">
                    <form className="flex flex-col gap-4" onSubmit={handleForgotEmail}>
                        {step === 1 &&
                            <Input
                                value={email}
                                type="email"
                                label="Email"
                                placeholder="Enter your Email"
                                variant="bordered"
                                isInvalid={emailIsInvalid || false}
                                color={emailIsInvalid ? "danger" : "secondary"}
                                errorMessage={emailIsInvalid && "Please enter a valid email"}
                                onChange={(e) => setEmail(e.target.value)}
                                className="max-w-xs"

                            />}
                        {step === 2 &&
                            <OtpInputForgetPassword step={step} setStep={setStep} email={email} otp={otp} setOtp={setOtp} />
                        }
                        {step === 3 &&
                            <ForgetPasswordOtpInput email={email} otp={otp} />
                        }

                        {step === 1 &&
                            <div className="flex gap-2 justify-end">
                                <Button type="submit" fullWidth color="secondary" onClick={handleForgotEmail} >
                                    Continue
                                </Button>
                            </div>
                        }
                        <div className="text-center text-small">
                            <div>
                                Already have an Account
                                <Link to="/login" className="text-purple-400">  Log in </Link>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
            <Toaster
                position="top-left"
                reverseOrder={false}
            />
        </div>
    );
}