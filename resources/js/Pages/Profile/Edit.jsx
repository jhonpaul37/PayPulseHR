import { Card, Col, Row, Typography, Image } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const { Title, Text } = Typography;

export default function Edit({ auth, mustVerifyEmail, status, employee }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<Title level={2}>Profile</Title>}>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Employee Profile Information */}
                    <Card title="Employee Profile" bordered={false} className="mb-6">
                        <Row gutter={[16, 16]}>
                            {/* <Col span={12}>
                                <Text strong>Photo: </Text>
                                <Image
                                    width={100}
                                    height={100}
                                    src={employee.photo_url || '/default-avatar.png'} // Use default image if no photo URL
                                    alt={`${employee.first_name} ${employee.last_name}`}
                                    style={{ borderRadius: '50%' }}
                                />
                            </Col> */}
                            <Col span={24}>
                                <Text strong>Name: </Text>
                                {employee.first_name} {employee.middle_name} {employee.last_name}
                            </Col>
                            <Col span={12}>
                                <Text strong>Position: </Text>
                                {employee.position}
                            </Col>
                            <Col span={12}>
                                <Text strong>Department: </Text>
                                {employee.department}
                            </Col>
                            <Col span={12}>
                                <Text strong>Employee ID: </Text>
                                {employee.employee_id}
                            </Col>
                            <Col span={12}>
                                <Text strong>Birthdate: </Text>
                                {employee.birthdate}
                            </Col>
                            <Col span={12}>
                                <Text strong>Phone: </Text>
                                {employee.phone}
                            </Col>
                            <Col span={12}>
                                <Text strong>Nationality: </Text>
                                {employee.nationality}
                            </Col>
                            <Col span={12}>
                                <Text strong>Address: </Text>
                                {employee.address}
                            </Col>
                            <Col span={12}>
                                <Text strong>Employment Type: </Text>
                                {employee.employment_type}
                            </Col>
                            <Col span={12}>
                                <Text strong>Start Date: </Text>
                                {employee.start_date}
                            </Col>
                            <Col span={12}>
                                <Text strong>Salary Grade: </Text>
                                {employee.salary_grade?.grade} - {employee.salary_grade?.step}
                            </Col>
                        </Row>
                    </Card>

                    {/* Update Profile Information Form */}
                    <Card title="Update Profile Information" bordered={false} className="mb-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </Card>

                    {/* Update Password Form */}
                    <Card title="Update Password" bordered={false} className="mb-6">
                        <UpdatePasswordForm className="max-w-xl" />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
