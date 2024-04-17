// LoginSide.js
import { useMemo, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/auth/authSlice";
import { validateEmail, validatePassword } from "../../../utils/validation/formValidation";
import axios from "axios";
export default function LoginSide() {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.auth.isLoggedIn)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (emailValid === false || passwordValid === false) {
                console.log(`EmailValid is ${ emailValid }      PasswordValid  is ${ passwordValid }`)
                toast.error("Invalid Username or password")
                return
            }
            const response = await axios.post('http://localhost:8000/user/login', {
                email,
                password,
            },{withCredentials:true});
            console.log(response);
            if (response.data.error) {
                toast.error(`${ response.data.error }`)
            } else {
                await dispatch(loginUser({
                    id: response.data.id,
                    username: response.data.username,
                    name: response.data.name,
                    email: response.data.email,
                    picture: response.data.picture || null,
                    gender: response.data.gender,
                    birthday: response.data.birthday,
                    isLoggedIn: true,
                    bio: response.data.bio,
                }));
                setTimeout(() => {
                    navigate("/home");
                }, 2000)
            }
        } catch (error) {
            console.log(error)
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
    const PasswordIsInvalid = useMemo(() => {
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
    return (
        <div className="flex flex-col w-full items-center">
            <Card className="max-w-full w-[340px] h-[380px]">
                <CardHeader className="flex justify-center items-center gap-4">
                    <div className="flex flex-col ">
                        <p className="text-lg">Login to Zing Zam</p>
                    </div>
                </CardHeader>
                <CardBody className="overflow-hidden">
                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
                        <Input
                            value={password}
                            placeholder="Enter your Password"
                            type="password"
                            label="Password"
                            variant="bordered"
                            isInvalid={PasswordIsInvalid}
                            color={PasswordIsInvalid ? "danger" : "secondary"}
                            errorMessage={PasswordIsInvalid && "Password must be 8+ characters with uppercase, lowercase, digit, & special character"}
                            onChange={(e) => setPassword(e.target.value)}
                            className="max-w-xs"
                        />                        <div className="flex gap-2 justify-end">
                            <Button fullWidth color="secondary" type="submit" >
                                Login
                            </Button>
                        </div>
                        <div className="text-center text-small">
                            <div>
                                Need to create an account?
                                <Link to="/signup" className="text-purple-400">  Sign Up</Link>
                            </div>
                            <Link to="/forgotPassword" className="text-purple-400">Forgot password ? </Link>
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