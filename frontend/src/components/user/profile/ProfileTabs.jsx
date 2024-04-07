import { Tabs, Tab } from "@nextui-org/react";

function ProfileTabs() {
    return (
        <div>
            <Tabs variant="underlined" aria-label="Tabs variants">
                <Tab key="post" title="Post" />
                <Tab key="friends" title="Friends" />
            </Tabs>
        </div>
    )
}

export default ProfileTabs
