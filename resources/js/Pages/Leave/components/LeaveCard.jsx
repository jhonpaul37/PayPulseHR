import { Card, Col, Row } from 'antd';
import { Link } from '@inertiajs/inertia-react';
import { useRoute } from '@ziggy';

export default function LeaveCard({ leaveRequests }) {
    const route = useRoute();
    return (
        <Row gutter={16}>
            {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                    <Col span={8} key={request.id}>
                        <Card
                            title={
                                <span className="font-bold">
                                    Requestor: {request.requestor_name}
                                </span>
                            }
                            bordered={false}
                            className="m-2 border"
                        >
                            <div className="text-sm text-gray-500">
                                <span>Office Unit: {request.office_unit}</span>
                                <br />
                                <span>Request Date: {request.request_date}</span>
                                <br />
                                <span>Type of Leave: {request.leave_type}</span>
                                <br />
                                <Link
                                    href={route('LeaveRequest.show', request)}
                                    className="mt-4 flex justify-center rounded-md bg-high py-2 font-bold text-main"
                                >
                                    View
                                </Link>
                            </div>
                        </Card>
                    </Col>
                ))
            ) : (
                <Col span={24}>
                    <Card bordered={false}>No recent requests available.</Card>
                </Col>
            )}
        </Row>
    );
}
