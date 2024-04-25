import SignUpSide from "../../components/user/loginSignup/SignUpSide"
import AuthPageLeftSideName from "./AuthPageLeftSideName";

function Signup() {
    return (
        <>
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                <AuthPageLeftSideName/>
                <div className="col-span-1 order-1 flex justify-center items-center py-9">
                    <SignUpSide />
                </div>
            </div>
        </>
    );
}

export default Signup;
