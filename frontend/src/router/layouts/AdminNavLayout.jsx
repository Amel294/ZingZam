import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/admin/navbarAdmin/AdminNavbar';

const AdminNavLayout = () => {
    return (
        <>
            <AdminNavbar />
            <Outlet />
        </>
    );
};

export default AdminNavLayout;
