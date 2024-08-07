import Layout from '../layouts/layout';
import { Link } from '@inertiajs/react';

export default function Voucher({ vouchers }) {
    return (
        <div className="px-20 pt-10">
            {/* button to add */}
            <button className="rounded-md bg-high px-10 py-3 font-bold">
                Create
            </button>

            {/* display the recent*/}
            <div className="my-10">
                <div className="mb-2">Recent</div>
                {vouchers.data.map((vouchers) => (
                    <div key={vouchers.id} className="border bg-white p-4">
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

            <div className="pt-5">
                {vouchers.links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.url}
                        className={`${link.active ? 'font-bold text-high' : ''} m-1 p-1`}
                    >
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
