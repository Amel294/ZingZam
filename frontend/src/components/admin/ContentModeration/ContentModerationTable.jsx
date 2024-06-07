import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DetailedView from "./DetailedView";

export default function UserManagement() {
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const rowsPerPage = 10;
    const [totalPages, setTotalPages] = useState()
    const [isDetailedOpen, setIsDetailedOpen] = useState(false);
    const [reportId,setReportId] = useState(null)
    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/report/reports?page=${ activePage }&limit=${ rowsPerPage }`, {
                withCredentials: true
            });

            if (response.data.error) {
                toast.error(`${ response.data.error }`);
            } else {
                setReports(response.data.reports);
                setTotalPages(response.data.totalPage)
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong, please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [activePage]);

    const handleChangePage = (newPage) => {
        setActivePage(newPage);
    };

    const handleChangeStatus = async (reportId) => {
        try {
                const response = await AxiosWithBaseURLandCredentials.patch(`/report/report-status`, {
                    reportId,
                    reportStatus :"in_review"
            }, { withCredentials: true });
    
            if (response.data.message) {  
                setReportId(reportId)
                setIsDetailedOpen(true);
                toast.success('Status changed successfully');
                fetchData(); 
            } else {
                toast.error('Failed to update status. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const columns = [
        { name: "ID", uid: "id" },
        { name: "TYPE", uid: "type" },
        { name: "REASON", uid: "reason" },
        { name: "DESCRIPTION", uid: "description" },
        { name: "REPORTED BY", uid: "reportedBy" },
        { name: "REPORTED USER", uid: "reportedUser" },
        { name: "STATUS", uid: "status" },
        { name: "REPORTED AT", uid: "createdAt" },
        { name: "ACTION", uid: "action" },
    ];

    const renderCell = (report, columnKey) => {
        switch (columnKey) {
            case "id":
                return report.type === "stream" ? report.streamKey : report.postId;
            case "reportedBy":
            case "reportedUser":
                return report[columnKey].name;
            case "status":
                return report.status.toUpperCase();
            case "createdAt":
                return new Date(report[columnKey]).toLocaleString();
            case "action":
                return <Button size="sm" onClick={() => handleChangeStatus(report._id)}>View Details</Button>
                default:
                return report[columnKey];
        }
    };

    return (
        <div className="text-left p-10 h-screen w-full">
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            total={totalPages}
                            onChange={(newPage) => handleChangePage(newPage)}
                            defaultValue={1}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} style={{ width: `${ 100 / columns.length }%` }}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={reports}>
                    {(report) => (
                        <TableRow key={report._id}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.uid}
                                    style={{ width: `${ 100 / columns.length }%` }}
                                >
                                    {renderCell(report, column.uid)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
                <DetailedView isDetailedOpen = {isDetailedOpen} setIsDetailedOpen={setIsDetailedOpen} reportId={reportId}/>
        </div>
    );
}
