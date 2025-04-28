import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ForReview = ({ auth, ReviewLeave }) => {
    console.log(ReviewLeave);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-4">
                <div className="mb-10 border-b pb-6">
                    <header className="flex p-1 text-xl font-bold">For Review</header>
                </div>

                {/* Displaying the review leave requests */}
                <div className="mt-4">
                    {ReviewLeave.data.length > 0 ? (
                        ReviewLeave.data.map((leave) => (
                            <div key={leave.id} className="mb-2 border p-4">
                                <div>Requestor: {leave.requestor_name}</div>
                                <div>Office: {leave.office_unit}</div>
                                <div>
                                    Dates: {leave.from_date} to {leave.to_date}
                                </div>
                                <div>Status: {leave.status}</div>
                            </div>
                        ))
                    ) : (
                        <div>No leave requests for review.</div>
                    )}
                </div>

                {/* Pagination controls */}
                <div className="mt-4">
                    {ReviewLeave.links && (
                        <div className="flex justify-between">
                            <button
                                onClick={() => Inertia.get(ReviewLeave.prev_page_url)}
                                disabled={!ReviewLeave.prev_page_url}
                                className="text-blue-600"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => Inertia.get(ReviewLeave.next_page_url)}
                                disabled={!ReviewLeave.next_page_url}
                                className="text-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ForReview;
