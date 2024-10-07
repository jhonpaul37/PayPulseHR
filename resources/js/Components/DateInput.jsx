import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const DateInput = ({ value, onChange }) => {
    return (
        <DatePicker
            value={value ? dayjs(value) : null} // Convert value to dayjs
            onChange={(date, dateString) => onChange(date, dateString)}
        />
    );
};

export default DateInput;
