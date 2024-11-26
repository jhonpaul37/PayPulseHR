import { Select } from 'antd';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function Create({ uacsCodes, fundClusters, auth, users, employee, filEmployees }) {
    const { data, setData, post, errors, processing } = useForm({
        jev_no: '',
        f_cluster: '',
        ors_burs_no: '',
        div_num: '',
        uacs_code: [],
        user_id: auth.id,
        code: '',
        autoIncrement: '',
        amount: '',
        ApproveAmount: '',
        particulars: '',
        address: '',
        payee: '',
        tin_no: '',
        bankName: '',
        approved_by: '', // Add a field to store selected employee ID
    });

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        if (data.f_cluster) {
            fetchAutoIncrementValue();
        }
    }, [data.f_cluster]);

    const fetchAutoIncrementValue = async () => {
        try {
            const response = await fetch('/autoIncrement');
            const result = await response.json();

            if (result.incrementNumber) {
                setData((prevData) => ({
                    ...prevData,
                    autoIncrement: result.incrementNumber,
                }));
                generateCode(result.incrementNumber);
            }
        } catch (error) {
            console.error('Failed to fetch auto-increment value:', error);
        }
    };

    const generateCode = (incrementNumber) => {
        const currentYearMonth = new Date().toISOString().slice(2, 7).replace('-', '');
        const fundCluster = data.f_cluster;

        const generatedCode = `${currentYearMonth}-${fundCluster}-${incrementNumber}`;
        setData((prevData) => ({
            ...prevData,
            code: generatedCode,
        }));
    };

    const handleInputChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEmployeeChange = (value) => {
        setData((prevData) => ({
            ...prevData,
            approved_by: value, // Update the selected employee in form data
        }));

        const employee = filEmployees.find((emp) => emp.id === parseInt(value));
        setSelectedEmployee(employee);
    };

    function submit(e) {
        e.preventDefault();
        post('/voucher');
    }

    return (
        <>
            <AuthenticatedLayout user={auth}>
                <form onSubmit={submit} className="w-[1000px]">
                    {/* Certified Section */}
                    <div className="border-2 border-black bg-white shadow-md">
                        <div className="border-b border-black p-2">
                            <div className="text-xs">
                                A. Certified: Expenses/Cash Advance necessary, lawful and incurred
                                under my direct supervision
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="mt-2 text-center font-bold">Name</div>
                                <div className="text-xs">Position</div>
                            </div>
                        </div>

                        {/* "Prepared by" Section */}
                        <div className="grid grid-cols-2">
                            <div className="p-2">
                                <div className="">Prepared by:</div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="font-bold">
                                        {employee
                                            ? `${employee.first_name} ${employee.last_name}`
                                            : 'N/A'}
                                    </span>
                                    {errors.user_id && (
                                        <div className="text-red-600">{errors.user_id}</div>
                                    )}
                                    <span>{employee?.position || 'N/A'}</span>
                                </div>
                            </div>

                            {/* "Approved by" Section */}
                            <div className="border-l border-black p-2">
                                <div>Approved by:</div>
                                <div className="flex flex-col items-center justify-center">
                                    <Select
                                        name="approved_by"
                                        value={data.approved_by}
                                        onChange={handleEmployeeChange}
                                        placeholder="Select an employee"
                                    >
                                        {filEmployees.map((emp) => (
                                            <Option key={emp.id} value={emp.id}>
                                                {emp.first_name} {emp.last_name}
                                            </Option>
                                        ))}
                                    </Select>
                                    {selectedEmployee && (
                                        <div className="mt-2 text-center">
                                            <div className="text-xs">
                                                {selectedEmployee.position}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit and Print Buttons */}
                    <div className="flex items-center justify-between pt-5">
                        <PrimaryButton disabled={processing}>Add</PrimaryButton>
                        <button
                            className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                            type="button"
                        >
                            Print
                        </button>
                    </div>
                </form>
            </AuthenticatedLayout>
        </>
    );
}
