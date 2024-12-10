import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="relative bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                {/* Background Image with blur effect */}
                <img
                    src="/images/BSC.jpg"
                    alt="Background Image"
                    className="absolute left-0 top-0 h-full w-full object-cover opacity-50 blur-sm filter"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        {/* Fixed Header at the Top */}
                        <header className="fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-main px-6 py-4">
                            {/* Logo Section */}
                            <div className="flex items-center">
                                <img
                                    src="/images/PayPulseHRWhite.png"
                                    alt="PayPulseHR Logo"
                                    className="h-16"
                                />
                                <span className="font-bold text-white">PayPulseHR</span>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex justify-end gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboards')}
                                        className="rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-high focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-high focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-high focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Main Content */}
                        <main className="mt-32 text-center">
                            <h1 className="text-4xl font-bold text-black dark:text-white">
                                Welcome to PayPulseHR
                            </h1>
                            <p className="mt-4 text-lg text-black/70 dark:text-white/70">
                                A complete HR solution for managing payroll, benefits, and more.
                            </p>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
