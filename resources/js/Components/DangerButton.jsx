export default function DangerButton({ className = '', disabled, danger, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-gray-400 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 transition duration-150 ease-in-out ${danger ? 'hover:border-transparent hover:bg-red-600 hover:text-white focus:ring-red-500 active:bg-red-700' : ''} ${disabled ? 'opacity-25' : ''} ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
