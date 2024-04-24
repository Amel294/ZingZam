
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../../../public/Avatar/default.png'
import PostProfile from '../../components/user/profile/PostProfile';
import Friends from '../../components/user/profile/Friends';
import { UserProfile } from '../../components/user/profile/UserProfile';
import EditUserData from '../../components/user/profile/EditName';
import AxiosWithBaseURLandCredentials from '../../axiosInterceptor';
import { Button } from '@nextui-org/react';

function Profile() {
    const [userData, setUserData] = useState();
    const { username } = useParams();
    const [liked, setLiked] = useState(false);
    const [picture, setPicture] = useState(defaultAvatar);
    const [toggle, setToggle] = useState("posts")
    console.log("toggle", toggle)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosWithBaseURLandCredentials.get(`/profile/${ username }`, {
                    withCredentials: true
                });

                setUserData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [username]);

    return (
        <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center min-h-screen '>
            {userData && <>
                <UserProfile userData={userData} picture={picture} defaultAvatar={defaultAvatar} />
                <div className='sticky top-16 z-20  pt-2 rounded-b-lg w-[400px] flex gap-2 justify-center '>
                    <Button size="sm" onClick={() => setToggle("posts")} className='bg-secondary-400'>Post </Button>
                    <Button size="sm" onClick={() => setToggle("friends")} className='bg-secondary-400'>Friends </Button>
                </div>
                {toggle === "friends" && <Friends friends={userData.friends} />}
                {toggle === "posts" && <PostProfile />}
            </>}
            <EditUserData />
        </div>
    );
}

export default Profile;
