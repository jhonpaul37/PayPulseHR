import Layout from '../layouts/layout';
import { Link } from '@inertiajs/react';

export default function Voucher({ vouchers }) {
    return (
        <>
            {/* display */}
            <div className="px-20 pt-10">
                <span>Recent</span>
                {vouchers.data.map((vouchers) => (
                    <div key={vouchers.id} className="border p-4 bg-white">
                        <div>
                            <span>
                                {new Date(
                                    vouchers.created_at
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <p>{vouchers.jev_no}</p>
                    </div>
                ))}
            </div>
            <div className="px-20 pt-5">
                {vouchers.links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className="m-1 p-1"
                    />
                ))}
            </div>
        </>
    );
}
