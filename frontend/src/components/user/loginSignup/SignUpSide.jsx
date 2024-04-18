// SignUpSide.js
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import EmailInput from "./EmailInput";
import PasswordInputSignUp from "./PasswordInputSignUp";
import { Link, useNavigate } from "react-router-dom";
import DateInput from "./DateInput";
import GenderRadio from "./GenderRadio";
import NameInput from "./NameInput";
import OtpInput from "./OtpInput";
import { useSelector, useDispatch } from "react-redux";
import { addTempToken } from "../../../store/auth/tempTokenSlice";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
export default function SignUpSide() {
    const dispatcher = useDispatch()
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [bday, setBday] = useState("")
    const [bdayValid, setBdayValid] = useState("")
    const [gender, setGender] = useState("male")
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [nameValid, setNameValid] = useState(false)
    const [otpPage, setOtpPage] = useState(true)
    const [otp, setOtp] = useState('')
    const [otpVerify, setOtpVerify] = useState(true)
    const tempToken = useSelector(state => state.otp.tempToken);

    const handleSignUp = async () => {
        if (emailValid && passwordValid && bdayValid && nameValid) {
            console.log('validated');
            setIsLoading(true);
            try {
                const response = await AxiosWithBaseURLandCredentials.post('/user/register', {
                    email: email,
                    password: password,
                    name: name,
                    gender: gender,
                    birthday: bday
                }, {
                    withCredentials: true
                });
                console.log(response);
                console.log("testing toast success")
                if (response.data.error) {
                    toast.error(`${ response.data.error }`)
                } else {
                    toast.success(`You're halfway there! ${ response.data.name }. Now verify the otp`)
                    setOtpPage(false)
                    dispatcher(addTempToken(response.data.tempToken))
                    console.log("Otp page set to" + otpPage)
                }
                await setTimeout(() => {
                    setIsLoading(false);
                }, 2000);

            } catch (error) {
                console.log("testing toast error")
                toast.error("This didn't work.")
            } finally {
                setIsLoading(false);
            }
        }
    };
    const handleOtpVerify = async () => {
        if (tempToken !== null) {
            setIsLoading(true);
            try {
                const response = await AxiosWithBaseURLandCredentials.post('/user/verify', {
                    otp: otp,
                }, {
                    withCredentials: true
                });
                console.log(response);
                console.log("testing toast success")
                if (response.data.error) {
                    toast.error(`${ response.data.error }`)
                } else {
                    toast.success(`Welcome to the clan! ${ response.data.name }. Redirecting to Sign in `)
                    setOtpPage(false)
                    console.log("Otp page set to" + otpPage)
                }
                await setTimeout(() => {
                    setIsLoading(false);
                    navigate('/login');
                }, 2000);
            } catch (error) {
                toast.error("This didn't work.")
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col w-full items-center over">
            {otpPage ? (
                <Card className="max-w-full w-[340px] h-[540px]">
                    <CardHeader className="flex justify-center items-center gap-4">
                        <div className="flex flex-col ">
                            <p className="text-lg">Sign Up to Zing Zam</p>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-y-auto">
                        <form className="flex flex-col gap-4">
                            <NameInput name={name} setName={setName} setNameValid={setNameValid} />
                            <EmailInput setEmail={setEmail} email={email} emailValid={emailValid} setEmailValid={setEmailValid} />
                            <PasswordInputSignUp password={password} setPassword={setPassword} passwordValid={passwordValid} setPasswordValid={setPasswordValid} />
                            <DateInput bday={bday} setBday={setBday} bdayValid={bdayValid} setBdayValid={setBdayValid} />
                            <GenderRadio gender={gender} setGender={setGender} />
                            <div className="flex gap-2 justify-end">
                                <Button fullWidth color="secondary" onClick={handleSignUp} isDisabled={isLoading}>
                                    Sign Up
                                </Button>
                            </div>
                            <p className="text-center text-small">
                                Already have an account?{" "}
                                <Link to="/login" className="text-purple-400">Log in</Link>
                            </p>
                        </form>
                    </CardBody>
                </Card>
            ) : (
                <div>
                    <Card className="max-w-full w-[340px] h-auto">
                        <CardHeader className="flex justify-center items-center gap-4">
                            <div className="flex flex-col ">
                                <p className="text-lg">Sign Up to Zing Zam</p>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-y-auto">
                            <form className="flex flex-col gap-4">
                                <OtpInput otp={otp} setOtp={setOtp} otpVerify={otpVerify} setOtpVerify={setOtpVerify} />
                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="secondary" onClick={handleOtpVerify} isDisabled={isLoading}>
                                        Verify Otp
                                    </Button>
                                </div>

                            </form>
                        </CardBody>
                    </Card>
                </div>

            )}

            <Toaster
                position="top-left"
                reverseOrder={false}
            />
        </div >
    );
}