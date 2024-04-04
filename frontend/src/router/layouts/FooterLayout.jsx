import { Outlet } from 'react-router-dom';
import Footer from '../../components/user/common/Footer';

const FooterLayout = () => {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    );
};

export default FooterLayout;
