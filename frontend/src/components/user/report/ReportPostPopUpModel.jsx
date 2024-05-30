import {
    Modal, ModalContent, ModalBody, Button, Textarea, Divider, Autocomplete, AutocompleteItem
} from "@nextui-org/react";
import { useState } from "react";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor"; // Replace with your Axios setup
import toast from "react-hot-toast";

export default function ReportPostPopUpModal({ isReportOpen, setIsReportOpen, postId }) {
    const [reportReason, setReportReason] = useState('spam');
    const [reportDescription, setReportDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);

    const validationRules = {
        required: true,
        minLength: 10
    };
    const validateDescription = () => {
        if (validationRules.required && reportDescription.trim().length === 0) {
            setDescriptionError('Description is required');
            return false;
        }

        if (reportDescription.length < validationRules.minLength) {
            setDescriptionError(`Description must be at least ${validationRules.minLength} characters`);
            return false;
        }

        setDescriptionError(null); 
        return true;
    };
    const reasonsToReport = [
        { value: 'inappropriate_content', label: 'Inappropriate Content' },
        { value: 'spam', label: 'Spam' },
        { value: 'harassment', label: 'Harassment' },
        { value: 'violence', label: 'Violence' },
        { value: 'hate_speech', label: 'Hate Speech' },
        { value: 'intellectual_property_violation', label: 'Intellectual Property Violation' },
    ];

    const handleReportSubmit = async () => {
        setIsSubmitting(true);
        try {
            const isDescriptionValid = validateDescription(); 
        if (!isDescriptionValid) return; 
            const response = await AxiosWithBaseURLandCredentials.post(`/report/report`, {
                postId: postId,
                reason: reportReason,
                description: reportDescription,
                type:"post"
            });
            toast.success(response.data.message);
            setIsReportOpen(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsReportOpen(false);
        setReportReason('spam');
        setReportDescription('');
        setError(null);
    };

    return (
        <Modal isOpen={isReportOpen} onClose={handleClose} className="dark text-white w-full shadow-none"
            placement="center" size="md" backdrop="blur">
            <ModalContent className="pb-2">
                <ModalBody>
                    <h2 className="text-xl font-bold mb-4">Report Post</h2>
                    <Divider />
                    <p className="mb-1">Please select reason for reporting this post:</p>
                    <div className="flex w-full flex-col">
                        <Autocomplete
                            label="Select a Report Reason"
                            variant="bordered"
                            defaultSelectedKey="spam"
                            defaultItems={reasonsToReport}
                            className="max-w-xs"
                            allowsCustomValue={false}
                            onSelect={(value) => setReportReason(value)}
                            onSelectionChange={(value) => setReportReason(value)}

                        >
                            {reasonsToReport.map((reason) => (
                                <AutocompleteItem key={reason.value}>
                                    {reason.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>

                    <p className="mb-1">Describe reason for reporting this post:</p>
                    <Textarea
                        placeholder="Enter reason for reporting..."
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        disabled={isSubmitting}
                        errorMessage={descriptionError}
                    />

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <div className="mt-6 flex justify-end">
                        <Button color="error" size="small" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button color="secondary" size="small" onClick={handleReportSubmit} loading={isSubmitting}>
                            Submit Report
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
