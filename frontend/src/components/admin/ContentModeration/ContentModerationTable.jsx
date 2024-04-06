import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Pagination, Tooltip, Switch, Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserManagement() {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));
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

    // const columns = [
    //     { name: "REPORT ID", uid: "id" },
    //     { name: "REPORTED USER", uid: "reported_user" },
    //     { name: "NO OF REPORTS", uid: "total" },
    //     { name: "LAST REPORT AT", uid: "date" },
    //     { name: "TYPE", uid: "report_type" },
    //     { name: "ACTIONS", uid: "see details" },
    // ];
    const columns = [
        { name: "USER", uid: "name" },
        { name: "EMAIL", uid: "email" },
        { name: "VERIFIED", uid: "verified" },
        { name: "BLOCK", uid: "blocked" },
        { name: "DELETE", uid: "delete" },
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
            case "verified":
                return <>{user.verified === true ? 'Verified' : 'Unverified'}</>
            case "blocked":
                return (
                    <div className="relative flex items-center justify-between" >
                        <Button size="sm" className="min-w-20" color={user.isBlocked ? "warning" : "success"}>
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
