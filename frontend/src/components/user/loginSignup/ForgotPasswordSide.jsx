// ForgotPassword.jsx
import { useMemo, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { validateEmail } from "../../../utils/validation/formValidation";
export default function ForgotPasswordSide() {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (emailValid === false) {
                toast.error("Invalid Username or password")
                return
            }
            const response = await axios.post('http://localhost:8000/user/forgotpassword', {
                email,
            }, {
                withCredentials: true
            });
            console.log(response);
            if (response.data.error) {
                toast.error(`${ response.data.error }`)
            } else {

                toast.success(`Otp is send to your email ${ response.data.name }`)

            }
        } catch (error) {
            console.log(error.data)
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
            <Card className="max-w-full w-[340px] h-[240px]">
                <CardHeader className="flex justify-center items-center gap-4">
                    <div className="flex flex-col ">
                        <p className="text-lg">Forgot your password</p>
                    </div>
                </CardHeader>
                <CardBody className="overflow-hidden">
                    <form className="flex flex-col gap-4">
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
                        />
                        <div className="flex gap-2 justify-end">
                            <Button fullWidth color="secondary" onClick={handleLogin} >
                                Continue
                            </Button>
                        </div>
                        <p className="text-center text-small">
                            <div>
                                Already have an Account
                                <Link to="/login" className="text-purple-400">  Log in </Link>
                            </div>
                        </p>
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