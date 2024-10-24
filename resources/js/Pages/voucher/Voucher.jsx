import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import { FloatButton as Btn, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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

export default function Voucher({ vouchers, auth }) {
    const route = useRoute();
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="">
                {/* <Link href="../voucher/create" className="rounded-md bg-high px-10 py-3 font-bold">
                    Create
                </Link> */}
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
                    {vouchers.data && vouchers.data.length > 0 ? (
                        vouchers.data.map((voucher) => (
                            <div key={voucher.id} className="my-2 border bg-white p-4">
                                <div className="text-sm text-gray-500">
                                    <span>Created at </span>
                                    <span>{new Date(voucher.created_at).toLocaleDateString()}</span>
                                </div>
                                <p>{voucher.jev_no}</p>
                                <Link
                                    href={route(`voucher.show`, voucher)}
                                    className="font-bold text-main"
                                >
                                    View
                                </Link>
                            </div>
                        ))
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No vouchers available"
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
