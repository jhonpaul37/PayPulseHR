import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center bg-gray-50 pt-6 text-black/50 sm:justify-center sm:pt-0 dark:bg-black dark:text-white/50">
            {/* Background Image */}
            <img
                src="/images/BSC.jpg"
                alt="Background Image"
                className="absolute left-0 top-0 h-full w-full object-cover opacity-50 blur-sm filter"
            />

            {/* Logo */}
            <div className="relative z-10">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current" />
                    <span className="font-bold text-white">PayPulseHR</span>
                </Link>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
