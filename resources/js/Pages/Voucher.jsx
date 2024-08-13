import React from 'react';
import { Link } from '@inertiajs/react';

export default function Voucher({ vouchers }) {
    return (
        <div className="">
            {/* button to add */}
            <Link
                href="../voucher/create"
                className="rounded-md bg-high px-10 py-3 font-bold"
            >
                Create
            </Link>
            {/* display the recent*/}
            <div className="my-10">
                <div className="mb-2">Recent</div>
                {vouchers.data.map((vouchers) => (
                    <div key={vouchers.id} className="my-2 border bg-white p-4">
                        <div className="text-sm text-gray-500">
                            <span>Created at </span>
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

            {/* pagination recent*/}
            <div className="fixed bg-white py-5">
                {vouchers.links.map((link) =>
                    link.url ? (
                        <Link
                            key={link.label}
                            href={link.url}
                            className={`${link.active ? 'bg-high font-bold' : ''} m-2 rounded-md border px-3 py-2`}
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Link>
                    ) : (
                        <span
                            key={link.label}
                            className="m-1 p-1 text-slate-300"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        ></span>
                    )
                )}
            </div>
        </div>
    );
}
