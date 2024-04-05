import SidebarAdmin from "../../components/admin/SidebarAdmin"
import UserManagement from "../../components/admin/userManagement/UserManagement"

function AdminHome() {
    return (
        <div className="flex ">
            <SidebarAdmin/>
            <UserManagement/>
        </div>
    )
}

export default AdminHome
