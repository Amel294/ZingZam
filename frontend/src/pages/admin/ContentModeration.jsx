import SidebarAdmin from "../../components/admin/SidebarAdmin"
import ContentModerationTable from "../../components/admin/ContentModeration/ContentModerationTable"
import { useNavigate } from "react-router-dom";

function ContentModeration() {
    const navigate = useNavigate();

    return (
        <div className="flex ">
            <SidebarAdmin />
            <div className="w-full">
                <div className="space-y-1 text-left pt-6 pl-9">
                    <h4 className="text-2xl font-medium hover:cursor-pointer" onClick={()=>navigate('/admin')}>Content Moderation </h4>
                    <p className="text-small text-default-400 hover:cursor-pointer"  onClick={()=>navigate('/usermanagement')}>See reports from users and take action.</p>
                </div>
                < ContentModerationTable />
            </div>
        </div >
    )
}

export default ContentModeration
