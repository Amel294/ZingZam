import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import defaultAvatar from '../../../public/Avatar/default.png'
import EditIcon from '../../../public/icons/EditIcon';
import OwnPostProfile from '../../components/user/profile/PostProfile';
import ProfileTabs from '../../components/user/profile/ProfileTabs';
import Followers from '../../components/user/profile/Followers';
function Profile() {
    const [userData, setUserData] = useState();
    const { username } = useParams();
    const [liked, setLiked] = useState(false);

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
                <Card className='w-[400px]'>
                    <CardBody >
                        <div className=' grid grid-cols-3 w-full'>
                            <Image className='col-span-1'
                                shadow="sm"
                                radius="lg"
                                alt="Profile pic"
                                src={userData?.picture == "" ? defaultAvatar : userData.picture}
                            />
                            <div className='col-span-2 ps-4 grid grid-rows-2'>
                                <div className="flex justify-between items-start row-span-1">
                                    <div className="flex flex-col gap-0 w-full">
                                        <div className='flex justify-between w-full ' >
                                            <h3 className="font-semibold ">{userData.name}</h3>
                                            <Button isIconOnly variant="ghost" color="secondary" size='sm' className='p-2  fill-secondary-500 hover:fill-white '><EditIcon /></Button>
                                        </div>
                                        <p className="text-small text-foreground/80">{userData.username}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start row-span-1 overflow-auto text-sm">
                                    <div className="flex flex-col gap-0 w-full">
                                        sdasdasdsdasdasdsdasdasdsdasdasdsdasdasdsdasdasdsdasdasdasdasdasdasdasdadasddadasdasdasd
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </>}
            <Followers/>
            <div className='sticky top-16 z-20  pt-2 rounded-b-lg w-[400px]'>
                <ProfileTabs />
            </div>
            <OwnPostProfile />
        </div>
    );
}

export default Profile;
