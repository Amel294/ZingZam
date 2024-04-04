import SignUpSide from "../../components/user/loginSignup/SignUpSide"
function Signup() {
    return (
        <>
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-1 order-1  flex justify-center items-center">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold flex flex-col gap-4"><span className="text-9xl md:text-6xl">Zing Zam</span>  <span className="md:text-4xl">The Social Gamer</span> </h1>
                    </div>
                </div>
                <div className="col-span-1 order-1 flex justify-center items-center py-9">
                    <SignUpSide />
                </div>
            </div>
        </>
    );
}

export default Signup;
