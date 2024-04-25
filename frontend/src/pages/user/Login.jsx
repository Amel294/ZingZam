import LoginSide from '../../components/user/loginSignup/LoginSide';
import AuthPageLeftSideName from './AuthPageLeftSideName';

const Login = () => {
    return (
        <>
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                <AuthPageLeftSideName/>
                <div className="col-span-1 order-1 flex justify-center items-center py-9">
                    <LoginSide />
                </div>
            </div>
        </>
    );
};

export default Login;