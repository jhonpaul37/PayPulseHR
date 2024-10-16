export default function CancelButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-red-600 bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 transition duration-150 ease-in-out hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-700 active:text-white ${
                    disabled && 'cursor-not-allowed opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
