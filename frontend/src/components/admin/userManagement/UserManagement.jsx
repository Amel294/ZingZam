import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Pagination, Tooltip, Switch, Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function UserManagement() {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(users.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users]);
    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await AxiosWithBaseURLandCredentials.get('/admin/usermanagement', {
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

    useEffect(() => {
        fetchData();
    }, []);
    const handleBlockUnblock = async (userID) => {
        setIsLoading(true);
    
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/admin/blockunblock/${userID}`, {
                withCredentials: true
            });
    
            if (response.data.error) {
                toast.error(`${ response.data.error }`);
            } else {
                if(page !== 1) {
                    setPage(page - 1);
                }
                fetchData(); // Refetch data after modifying the user's block status
            }
        } catch (error) {
            console.error(error);
            toast.error("This didn't work.");
        } finally {
            setIsLoading(false);
        }
    };
    const columns = [
        { name: "USER", uid: "name" },
        { name: "EMAIL", uid: "email" },
        { name: "BLOCK", uid: "blocked" },
        { name: "DELETE", uid: "delete" },
    ];

    const renderCell = React.useCallback((user, columnKey) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.picture }}
                        description={user.email}
                        name={user.name}
                    >
                        {user.email}
                    </User>
                );
            case "email":
                return <>{user.email}</>
            case "blocked":
                return (
                    <div className="relative flex items-center justify-between" >
                        <Button size="sm" className="min-w-20" color={user.isBlocked ? "warning" : "success"} onClick={() => handleBlockUnblock(user._id)}>
                            {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                    </div>
                );
            case "delete":
                return (
                    <div className="relative flex items-center justify-between" >
                        <Button size="sm" className="min-w-20" color= "danger">
                            Delete User
                        </Button>
                    </div>
                );

            default:
                return <>{user[columnKey]}</>;
        }
    }, []);

    return (
        <div className=" text-left p-10 h-screen w-full">
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                </TableHeader>
                <TableBody items={items}>
                    {(user) => (
                        <TableRow key={user._id}>
                            {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
