import SidebarAdmin from "../../components/admin/SidebarAdmin"
import UserManagement from "../../components/admin/userManagement/UserManagement"

function AdminHome() {
    return (
        <div className="flex ">
            <SidebarAdmin />
            <div className="w-full">
                <div className="space-y-1 text-left pt-6 pl-9">
                    <h4 className="text-2xl font-medium">User Management</h4>
                    <p className="text-small text-default-400">See your users block or delete their account.</p>
                </div>
                <UserManagement />
            </div>
        </div>
    )
}

export default AdminHome
