import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get('http://localhost:8000/admin/usermanagement', {
                    withCredentials: true
                });

                if (response.data.error) {
                    toast.error(`${ response.data.error }`);
                } else {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("This didn't work.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { name: "USER", uid: "name" },
        { name: "EMAIL", uid: "email" },
        { name: "STATUS", uid: "status" },
    ];

    const renderCell = React.useCallback((user, columnKey) => {
        console.log('User:', user, 'isBlocked:', user.isBlocked); 
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar || 'https://i.pravatar.cc/150' }}
                        description={user.email}
                        name={user.name}
                    >
                        {user.email}
                    </User>
                );
            case "email":
                return <>{user.email}</>
            case "status":
                return <>{user.isBlocked === true ? 'Blocked' : 'Active'}</>
            default:
                return <>{user[columnKey]}</>;
        }
    }, []);

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));
    return (
        
        <Table aria-label="Controlled table example with dynamic content"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}>
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={users}>
                {(user) => (
                    <TableRow key={user._id}>
                        {(columnKey) => <TableCell >{renderCell(user, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>

    );
}
