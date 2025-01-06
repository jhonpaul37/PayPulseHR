import { forwardRef, useEffect, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons'; // Ant Design Search icon

export default forwardRef(function SearchInput(
    { type = 'text', className = '', isFocused = false, onSearch, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(input.current.value); // Call the onSearch function with the input value
        }
    };

    return (
        <div className="relative flex items-center space-x-2">
            <input
                {...props}
                type={type}
                className={
                    'rounded-md border-gray-400 bg-gray-100 pl-10 shadow-sm focus:border-high focus:ring-high ' +
                    className
                }
                ref={input}
            />

            <div className="absolute left-3">
                <SearchOutlined className="text-gray-400" />
            </div>

            {/* Search Button */}
            {/* <button
                onClick={handleSearchClick}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
                Search
            </button> */}
        </div>
    );
});
