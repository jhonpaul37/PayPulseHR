import React from 'react';
import { Col, Divider, Drawer, Row, Button, Space } from 'antd';
import { Inertia } from '@inertiajs/inertia';

const DescriptionItem = ({ title, content }) => (
    <div className="">
        <p className="text-gray-500">{title}:</p>
        <span className="font-bold">{content}</span>
    </div>
);

const EmployeeInfo = ({ visible, onClose, employee }) => {
    if (!employee) return null;

    const handleEdit = (id) => {
        Inertia.get(`/employees/${id}/edit`);
    };

    return (
        <Drawer width={800} placement="right" closable={false} onClose={onClose} open={visible}>
            <p className="font-bold text-main" style={{ marginBottom: 24 }}>
                Employee Profile
            </p>
            <p className="font-bold text-main">Personal</p>
            <Row>
                <Col span={12}>
                    <DescriptionItem
                        title="Full Name"
                        content={`${employee.first_name} ${employee.middle_name || ''} ${employee.last_name}`}
                    />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Email" content={employee.email} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Birthdate" content={employee.birthdate} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Sex" content={employee.sex} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Address" content={employee.address} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Phone" content={employee.phone} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Nationality" content={employee.nationality} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Civil Status" content={employee.civil_status} />
                </Col>
            </Row>
            <Divider />
            <p className="font-bold text-main">Employment</p>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Position" content={employee.position} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Department" content={employee.department} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Start Date" content={employee.start_date} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Employment Type" content={employee.employment_type} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Salary" content={`$${employee.salary}`} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Leave Balance" content={employee.leave_balance} />
                </Col>
            </Row>
            <Divider />
            <p className="font-bold text-main">Additional Information</p>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Vacation Days" content={employee.vacation_days} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Sick Days" content={employee.sick_days} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem
                        title="Photo"
                        content={
                            employee.photo_url ? (
                                <img
                                    src={`/storage/${employee.photo_url}`}
                                    alt="Profile"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            ) : (
                                'No photo'
                            )
                        }
                    />
                </Col>
                <Col span={12}>
                    <DescriptionItem
                        title="Termination Date"
                        content={employee.termination_date || 'N/A'}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem
                        title="Termination Reason"
                        content={employee.termination_reason || 'N/A'}
                    />
                </Col>
            </Row>

            {/* Add buttons inside the Drawer body */}
            <Divider />
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
                <Button onClick={onClose}>Close</Button>
                <Button
                    onClick={() => handleEdit(employee.id)}
                    className="border-high bg-high font-bold"
                >
                    Edit
                </Button>
            </Space>
        </Drawer>
    );
};

export default EmployeeInfo;
