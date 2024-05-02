
import { Modal, ModalContent,  ModalBody, Button, Input, Avatar } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../../../../public/icons/SearchIcon";
import { useState } from "react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function App({ isSearchOpen, setIsSearchOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const handleClose = () => {
        setIsSearchOpen(false)
    }

    const handleSearch = async () => {
        console.log("Enter pressed");
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/connections/search-users`, {
                params: {
                    query: searchQuery
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            setUsers([])
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handleClear = () => {
        setSearchQuery('');
        setUsers([])
    }
    const handleGoToProfile = (userName) => {
        setIsSearchOpen(false)
        navigate(`/profile/${userName}`);
    }
    return (
        <Modal isOpen={isSearchOpen} onClose={handleClose} className="dark text-white w-full bg-transparent shadow-none" placement="center" size="md" backdrop="blur" >
            <ModalContent>
                {(onClose) => (
                    <>
                        <Input
                            placeholder="Type to search..."
                            startContent={
                                <SearchIcon className="text-black/50  dark:text-white/90 text-slate-400" />
                            }
                            endContent={
                                <div className="flex justify-between gap-2">
                                    <Button onClick={handleClear} size="sm" type="reset" color="danger" variant="ghost">Clear</Button>
                                    <Button onClick={handleSearch} size="sm" type="submit" color="secondary" variant="ghost">Search</Button>
                                </div>
                            }

                            value={searchQuery}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        {users.length > 0 &&
                            <ModalBody className="dark shadow-none bg-zinc-900 rounded-xl mt-1 max-h-[300px] overflow-y-auto">
                                <div className="flex flex-col gap-2 py-4">
                                    {users.map((user) => (
                                        <div key={user._id} className="flex justify-between items-center bg-zinc-800 p-2 rounded-md">
                                            <div className="flex gap-2 items-center">
                                                <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.picture} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{user.username}</span>
                                                    <span className="text-xs text-default-400">{user.name}</span>
                                                </div>
                                            </div>
                                            <Button size="sm" color="secondary" onClick={()=>handleGoToProfile(user.username)}>Visit Profile</Button>
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>
                        }
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
