import React, { useState } from 'react';
import { Col, Divider, Drawer, Row, Button, Space } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';

const DescriptionItem = ({ title, content }) => (
    <div className="">
        <p className="text-gray-500">{title}:</p>
        <span className="font-bold">{content}</span>
    </div>
);

const EmployeeInfo = ({ visible, onClose, employee }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showTerminationForm, setShowTerminationForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [terminationData, setTerminationData] = useState({
        termination_date: '',
        termination_reason: '',
    });

    const handleEdit = (id) => {
        Inertia.get(`/hr/employees/${id}/edit`);
    };

    const handleTerminationChange = (e) => {
        setTerminationData({
            ...terminationData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitTermination = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmTermination = () => {
        Inertia.post(`/hr/employees/${employee.id}/terminate`, terminationData, {
            onFinish: () => {
                setShowConfirmation(false);
                setShowTerminationForm(false);
            },
        });
    };

    if (!employee) return null;

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
                    <DescriptionItem title="Position" content={employee.position?.name} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Department" content={employee.department?.name} />
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
                    <DescriptionItem
                        title="Salary"
                        content={`$${employee.salary_grade?.monthly_salary || 'N/A'}`}
                    />
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

            <Divider />
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
                <Button onClick={onClose}>Close</Button>
                <Button
                    onClick={() => handleEdit(employee.id)}
                    className="border-high bg-high font-bold"
                >
                    Edit
                </Button>
                <Button
                    onClick={() => setShowTerminationForm(true)}
                    className="rounded bg-red-500 text-white"
                >
                    Terminate
                </Button>
            </Space>

            {/* Termination Form */}
            {showTerminationForm && !showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="rounded bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold">Terminate Employee</h2>
                        <form onSubmit={handleSubmitTermination}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Termination Date</label>
                                <input
                                    type="date"
                                    name="termination_date"
                                    value={terminationData.termination_date}
                                    onChange={handleTerminationChange}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Reason</label>
                                <textarea
                                    name="termination_reason"
                                    value={terminationData.termination_reason}
                                    onChange={handleTerminationChange}
                                    className="w-full rounded border px-3 py-2"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowTerminationForm(false)}
                                    className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-red-500 px-4 py-2 text-white"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="rounded bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold">Confirm Termination</h2>
                        <p className="mb-4">Are you sure you want to terminate this employee? 😢</p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmTermination}
                                className="rounded bg-red-500 px-4 py-2 text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default EmployeeInfo;
