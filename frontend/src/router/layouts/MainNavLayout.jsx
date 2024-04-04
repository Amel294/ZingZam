import { Outlet } from 'react-router-dom';
import MainNavbar from '../../components/user/common/MainNavbar';

const MainNavLayout = () => {
    return (
        <>
            <MainNavbar />
            <Outlet />
        </>
    );
};

export default MainNavLayout;
