import SidebarAdmin from "../../components/admin/SidebarAdmin"
import ContentModerationTable from "../../components/admin/ContentModeration/ContentModerationTable"

function ContentModeration() {
    return (
        <div className="flex ">
            <SidebarAdmin />
            <div className="w-full">
                <div className="space-y-1 text-left pt-6 pl-9">
                    <h4 className="text-2xl font-medium">Content Moderation </h4>
                    <p className="text-small text-default-400">See reports from users and take action.</p>
                </div>
                < ContentModerationTable/>
            </div>
        </div>
    )
}

export default ContentModeration
