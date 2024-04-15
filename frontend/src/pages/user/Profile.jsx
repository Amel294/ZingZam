
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import defaultAvatar from '../../../public/Avatar/default.png'
import OwnPostProfile from '../../components/user/profile/PostProfile';
import ProfileTabs from '../../components/user/profile/ProfileTabs';
import Friends from '../../components/user/profile/Friends';
import { UserProfile } from '../../components/user/profile/UserProfile';
import EditUserData from '../../components/user/profile/EditName';

function Profile() {
    const [userData, setUserData] = useState();
    const { username } = useParams();
    const [liked, setLiked] = useState(false);
    const [picture, setPicture] = useState(defaultAvatar);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/profile/${ username }`, {
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
        <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center '>
            {userData && <>
                <UserProfile   userData={userData} picture={picture} defaultAvatar={defaultAvatar}  />
            <Friends friends={userData.friends}/>
            </>}
            <div className='sticky top-16 z-20  pt-2 rounded-b-lg w-[400px]'>
                <ProfileTabs />
            </div>
            <EditUserData/>
            <OwnPostProfile />
        </div>
    );
}

export default Profile;
