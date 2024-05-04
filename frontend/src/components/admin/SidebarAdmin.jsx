import { useNavigate } from 'react-router-dom';
import ContentModeration from '../../../public/icons/admin/sideBar/ContentModeration';
import UserManagementIcon from '../../../public/icons/admin/sideBar/UserManagementIcon';
import zingZamLogo from '/icons/ZingZamLogo.svg'
const SidebarAdmin = () => {
    const navigate = useNavigate();

    return (
        <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto">
            <div className='flex items-center gap-2 text-sm'>
                <img className="w-auto h-7" src={zingZamLogo} alt="" />
                <div>Zing Zam</div>
            </div>
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav className="-mx-3 space-y-6 ">
                    <div className="space-y-3 ">

                        <div className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 hover:cursor-pointer" onClick={() => navigate('/admin')} >
                            <UserManagementIcon className="h-5"/>
                            <span className="mx-2 text-sm font-medium">User Management</span>
                        </div>

                        <div className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 hover:cursor-pointer" onClick={() => navigate('/contentmodration')}>
                            <ContentModeration className="h-5"/>

                            <span className="mx-2 text-sm font-medium">Content Moderation</span>
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
