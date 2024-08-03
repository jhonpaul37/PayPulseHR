import { Link } from "@inertiajs/react";
export default function Layout({ children }) {
    return (
        <>
            {/* icon links */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
            />

            {/* NavBar */}
            <nav className="bg-main text-white flex justify-between items-center px-10 py-3">
                {/* Logo */}

                <div>
                    <Link>PayPulseHR</Link>
                </div>

                {/* navbar links (middle)*/}

                <div className="flex gap-10">
                    <div>
                        <Link href="/">Home</Link>
                    </div>
                    <div>
                        <Link href="">Dashboard</Link>
                    </div>
                    <div>
                        <Link href="/disVoucher">Voucher</Link>
                    </div>
                    <div>
                        <Link href="">Release</Link>
                    </div>
                    <div>
                        <Link href="">Reports</Link>
                    </div>
                    <div>
                        <Link href="">Settings</Link>
                    </div>
                </div>

                {/* navbar (right) */}
                <div className="flex gap-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 px-2 py-2 ">
                        {/* "hover:bg-gray-200" hover settings*/}
                        <Link href="">
                            <i className="fas fa-regular fa-bell"></i>
                        </Link>
                    </div>

                    {/* user profile icon */}
                    <div>
                        <div>
                            <button
                                onclick="toggleDropdown('dropdown2')"
                                className="flex h-10 w-10 items-center justify-center rounded-full border-2 px-2 py-2 hover:shadow-md"
                            >
                                <i className="fas fa-user"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* main content */}
            <main>{children}</main>

            {/* Footer  */}
            <footer className="fixed bottom-0 w-full border-t border-gray-300 bg-gray-50 px-20 py-2 text-xs">
                &copy; 2024 PaypulseHR Capstone project
            </footer>
        </>
    );
}
