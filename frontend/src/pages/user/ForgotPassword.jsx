import ForgotPasswordSide from '../../components/user/loginSignup/ForgotPasswordSide';
import AuthPageLeftSideName from './AuthPageLeftSideName';

const ForgotPassword = () => {
    return (
        <>
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
                <AuthPageLeftSideName/>
                <div className="col-span-1 order-1 flex justify-center items-center py-9">
                    <ForgotPasswordSide />
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;