import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { useRoute } from '@ziggy';
import { FloatButton as Btn, Empty, Table, Drawer, Button, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const FloatButton = styled(Btn)`
    background-color: #f0c519 !important;
    color: #fff !important;
    width: 60px;
    height: 60px;
    font-size: 24px;
    position: fixed;
    bottom: 100px;
    right: 100px;
`;

const StyledTable = styled(Table)`
    .table-row-hover {
        background-color: #f5f5f5 !important; /* Light gray for hover effect */
        cursor: pointer; /* Change cursor to pointer */
    }

    .table-row-selected {
        background-color: #ffe58f !important; /* Highlight selected row */
        font-weight: bold; /* Optional: Make text bold */
    }
`;

export default function Voucher({ vouchers, auth }) {
    const route = useRoute();

    // State to control the visibility of the Drawer, selected voucher, div_num input, and confirmation modal
    const [visible, setVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [divNum, setDivNum] = useState(''); // For div_num input
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [showInput, setShowInput] = useState(false); // Control visibility of the input field

    // Columns for the table
    const columns = [
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'JEV No',
            dataIndex: 'jev_no',
            key: 'jev_no',
        },
        {
            title: 'ORS/BURS No.',
            dataIndex: 'ors_burs_no',
            key: 'ors_burs_no',
        },
        {
            title: 'Payee',
            dataIndex: 'payee',
            key: 'payee',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Link href={route('voucher.show', record)} className="font-bold text-main">
                    View
                </Link>
            ),
        },
    ];

    // Function to show the drawer with transaction details
    const showDrawer = (voucher) => {
        setSelectedVoucher(voucher);
        setVisible(true);
    };

    // Function to close the drawer
    const onClose = () => {
        setVisible(false);
        setShowInput(false); // Reset the input field visibility
        setDivNum(''); // Reset the input value
    };

    // Function to handle the complete action
    const handleComplete = () => {
        setShowInput(true); // Show the input field
    };

    // Function to confirm completing the transaction
    const handleConfirmComplete = () => {
        if (!divNum) {
            alert('Please enter the div_num to complete the transaction.');
        } else {
            // Send data to the backend
            Inertia.post(route('voucher.complete', { id: selectedVoucher.id }), {
                div_num: divNum, // Ensure that divNum is being sent correctly
            });

            // Close the confirmation modal
            setConfirmModalVisible(false);
            setVisible(false); // Close the drawer
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="">
                <div className="border-b pb-6">
                    <header className="flex justify-center text-xl font-bold">
                        Disbursement Voucher
                    </header>
                </div>

                {/* Add BTN */}
                <FloatButton
                    onClick={() => (window.location.href = route('voucher.add'))}
                    tooltip="Add"
                    icon={<PlusOutlined />}
                    className="border-high bg-high font-bold"
                />

                <div className="my-10">
                    <div className="mb-2 flex justify-between">
                        <div className="mb-2 text-lg font-bold">Recent</div>
                        <div>
                            {/* Pagination */}
                            <div className="bg-white py-5">
                                {vouchers.links.map((link) =>
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
                    </div>

                    {/* Conditional rendering for vouchers */}
                    {vouchers.data &&
                    vouchers.data.filter(
                        (voucher) => !voucher.div_num || voucher.div_num === '0000'
                    ).length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={vouchers.data.filter(
                                (voucher) => !voucher.div_num || voucher.div_num === '0000'
                            )} // Filtered data
                            rowKey="id"
                            pagination={false} // You can manage pagination separately
                            onRow={(record) => ({
                                onClick: () => showDrawer(record), // Show drawer on row click
                            })}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No vouchers available"
                        />
                    )}
                </div>

                {/* Drawer for displaying voucher details */}
                <Drawer
                    title="Voucher Details"
                    width={600}
                    open={visible}
                    onClose={onClose}
                    closable={true}
                >
                    {selectedVoucher ? (
                        <div>
                            <p>
                                <strong>JEV No:</strong> {selectedVoucher.jev_no}
                            </p>
                            <p>
                                <strong>ORS/BURS No.:</strong> {selectedVoucher.ors_burs_no}
                            </p>
                            <p>
                                <strong>Payee:</strong> {selectedVoucher.payee}
                            </p>
                            <p>
                                <strong>Created At:</strong>{' '}
                                {new Date(selectedVoucher.created_at).toLocaleDateString()}
                            </p>

                            {/* Edit, Close, and Complete Buttons */}
                            <div className="mt-4">
                                <Button
                                    className="mr-2"
                                    onClick={() => alert('Edit functionality not implemented yet.')}
                                >
                                    Edit
                                </Button>
                                <Button className="mr-2" onClick={onClose}>
                                    Close
                                </Button>
                                <PrimaryButton
                                    className="mr-2"
                                    type="primary"
                                    onClick={handleComplete}
                                >
                                    Complete
                                </PrimaryButton>
                            </div>

                            {/* Conditionally show Input for div_num */}
                            {showInput && (
                                <div className="mt-4">
                                    <Input
                                        value={divNum} // Use divNum state here
                                        onChange={(e) => setDivNum(e.target.value)} // Update state on change
                                        placeholder="Enter div_num"
                                    />
                                    <PrimaryButton
                                        className="mt-2"
                                        type="primary"
                                        onClick={() => setConfirmModalVisible(true)}
                                    >
                                        Submit
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>No voucher selected</p>
                    )}
                </Drawer>

                {/* Confirmation Modal for Complete */}
                <Modal
                    title="Confirm Transaction Completion"
                    open={confirmModalVisible}
                    onOk={handleConfirmComplete}
                    onCancel={() => setConfirmModalVisible(false)}
                    okText="Confirm"
                    cancelText="Cancel"
                >
                    <p>
                        Are you sure you want to complete this transaction with div_num: {divNum}?
                    </p>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
