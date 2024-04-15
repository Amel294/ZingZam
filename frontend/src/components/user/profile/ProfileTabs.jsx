import { Tabs, Tab } from "@nextui-org/react";

function ProfileTabs() {
    return (
        <div>
            <Tabs size="sm" variant="solid" color="secondary" aria-label="Tabs variants">
                <Tab key="post" title="Post" />
                <Tab key="friends" title="Friends" />
            </Tabs>
        </div>
    )
}

export default ProfileTabs
