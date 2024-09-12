import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LeaveRequest({ LeaveRequest, auth }) {
    console.log('LeaveRequest:', LeaveRequest);
    const route = useRoute();
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="">
                {/* Display recent requests */}
                <div className="my-10">
                    <div className="mb-2">Recent</div>
                    {LeaveRequest.data.length > 0 ? (
                        LeaveRequest.data.map((request) => (
                            <div key={request.id} className="my-2 border bg-white p-4">
                                <div className="text-sm text-gray-500">
                                    <span>Requestor: {request.requestor_name}</span>
                                    <br />
                                    <span>Office Unit: {request.office_unit}</span>
                                    <br />
                                    <span>Request Date: {request.request_date}</span>
                                    <br />

                                    <Link
                                        href={route(`LeaveRequest.show`, request)}
                                        className="font-bold text-main"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No recent requests available.</div>
                    )}
                </div>

                {/* Pagination recent */}
                <div className="fixed bg-white py-5">
                    {LeaveRequest.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                className={`${link.active ? 'bg-high font-bold' : ''} m-2 rounded-md border px-3 py-2`}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </Link>
                        ) : (
                            <span
                                key={link.label}
                                className="m-1 p-1 text-slate-300"
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            ></span>
                        )
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
