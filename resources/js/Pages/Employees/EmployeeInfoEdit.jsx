import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Upload, message, Form, Input, DatePicker, Select, Button, Radio } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// Components
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const { Option } = Select;

export default function EmployeeInfoEdit({ auth, employee, salaryGrades, departments, positions }) {
    const { data, setData, put, errors } = useForm({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        middle_name: employee.middle_name || '',
        birthdate: employee.birthdate || '',
        birthPlace: employee.birthPlace || '',
        sex: employee.sex || '',
        civil_status: employee.civil_status || '',
        nationality: employee.nationality || '',
        address: employee.address || '',
        phone: employee.phone || '',
        email: employee.email || '',
        position: employee.position_id || '',
        department: employee.department_id || '',
        start_date: employee.start_date || '',
        employment_type: employee.employment_type || '',
        salary_grade_id: employee.salary_grade_id || '',
        vacation_days: employee.vacation_days || 0,
        sick_days: employee.sick_days || 0,
        leave_balance: employee.leave_balance || 0,
        photo: employee.photo || null,
        classification: employee.classification || '',
        gsis_no: employee.gsis_no || '',
        hdmf_no: employee.hdmf_no || '',
        phic_no: employee.phic_no || '',
        bir_tin_no: employee.bir_tin_no || '',
    });

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(employee.photo);

    // Set imageUrl when employee data is available
    useEffect(() => {
        setImageUrl(employee.photo);
    }, [employee]);

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
                setData('photo', info.file.originFileObj);
            });
        }
    };

    const handleSubmit = () => {
        put(route('employees.update', employee.id), {
            data: data,
            onSuccess: (response) => {
                console.log('Update successful', response);
            },
            onError: (error) => {
                console.log('Error:', error);
            },
        });
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto">
                <h1 className="pb-10 text-center text-xl font-bold">Edit Employee</h1>
                <Form
                    onFinish={handleSubmit}
                    initialValues={data}
                    layout="vertical"
                    className="flex justify-center gap-20"
                    encType="multipart/form-data"
                >
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center justify-center">
                        <Upload
                            name="photo"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                        {errors.photo && <div>{errors.photo}</div>}
                        <label className="">Profile Picture</label>
                    </div>

                    <div>
                        <div className="pb-2">
                            <label className="text-lg font-bold">Personal Information</label>
                        </div>

                        <div className="flex gap-5 p-2">
                            {/* First Name */}
                            {/* <div className="flex flex-col">
                                <label>First Name</label>
                                <TextInput
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                {errors.first_name && <div>{errors.first_name}</div>}
                            </div> */}
                            <Form.Item
                                label="First Name"
                                name="first_name"
                                validateStatus={errors.first_name ? 'error' : ''}
                                help={errors.first_name}
                                rules={[{ required: true, message: 'First name is required' }]}
                            >
                                <TextInput
                                    autoComplete="off"
                                    value={data.first_name || ''} // Ensure a fallback if the value is empty or undefined
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                            </Form.Item>

                            {/* Last Name */}
                            <Form.Item
                                label="Last Name"
                                name="last_name"
                                validateStatus={errors.last_name ? 'error' : ''}
                                help={errors.last_name}
                                rules={[{ required: true, message: 'Last name is required' }]}
                            >
                                <TextInput
                                    autoComplete="off"
                                    value={data.last_name || ''} // Ensure a fallback if the value is empty or undefined
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                            </Form.Item>

                            {/* Middle Name */}
                            <Form.Item
                                label="Middle Name"
                                name="middle_name"
                                validateStatus={errors.middle_name ? 'error' : ''}
                                help={errors.middle_name}
                            >
                                <TextInput
                                    autoComplete="off"
                                    value={data.middle_name || ''} // Ensure a fallback if the value is empty or undefined
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                />
                            </Form.Item>
                        </div>

                        <div className="flex gap-5 p-2">
                            {/* Birthdate */}
                            <div className="flex flex-col">
                                <label>Birthdate</label>
                                <TextInput
                                    type="date"
                                    value={data.birthdate}
                                    onChange={(e) => setData('birthdate', e.target.value)}
                                />
                                {errors.birthdate && <div>{errors.birthdate}</div>}
                            </div>

                            {/* Birth Place */}
                            <Form.Item
                                label="Birth Place"
                                name="birthPlace"
                                validateStatus={errors.birthPlace ? 'error' : ''}
                                help={errors.birthPlace}
                                rules={[{ required: true, message: 'Birth Place is required' }]}
                            >
                                <TextInput
                                    autoComplete="off"
                                    value={data.birthPlace}
                                    onChange={(e) => setData('birthPlace', e.target.value)}
                                />
                            </Form.Item>
                        </div>

                        <div className="flex gap-5 p-2">
                            {/* Sex */}
                            <Form.Item
                                label="Sex"
                                name="sex"
                                validateStatus={errors.sex ? 'error' : ''}
                                help={errors.sex}
                                rules={[{ required: true, message: 'Sex is required' }]}
                            >
                                <Radio.Group
                                    onChange={(e) => setData('sex', e.target.value)}
                                    value={data.sex}
                                >
                                    <Radio value="male">Male</Radio>
                                    <Radio value="female">Female</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {/* Civil Status */}
                            <Form.Item
                                label="Civil Status"
                                name="civil_status"
                                validateStatus={errors.civil_status ? 'error' : ''}
                                help={errors.civil_status}
                                rules={[{ required: true, message: 'Civil Status is required' }]}
                            >
                                <Select
                                    value={data.civil_status}
                                    onChange={(value) => setData('civil_status', value)}
                                    placeholder="Select Civil Status"
                                >
                                    <Select.Option value="single">Single</Select.Option>
                                    <Select.Option value="married">Married</Select.Option>
                                </Select>
                            </Form.Item>

                            {/* Nationality */}
                            <Form.Item
                                label="Nationality"
                                name="nationality"
                                validateStatus={errors.nationality ? 'error' : ''}
                                help={errors.nationality}
                                rules={[{ required: true, message: 'Nationality is required' }]}
                            >
                                <TextInput
                                    autoComplete="off"
                                    value={data.nationality}
                                    onChange={(e) => setData('nationality', e.target.value)}
                                />
                            </Form.Item>
                        </div>

                        {/* Address */}
                        <div>
                            <Form.Item
                                label="Address"
                                name="address"
                                validateStatus={errors.address ? 'error' : ''}
                                help={errors.address}
                                rules={[{ required: true, message: 'Address is required' }]}
                            >
                                <TextInput
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full"
                                    autoComplete="off"
                                />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Phone */}
                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    validateStatus={errors.phone ? 'error' : ''}
                                    help={errors.phone}
                                    rules={[
                                        { required: true, message: 'Phone Number is required' },
                                    ]}
                                >
                                    <TextInput
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                                {/* Email */}
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    validateStatus={errors.email ? 'error' : ''}
                                    help={errors.email}
                                    rules={[{ required: true, message: 'Email is required' }]}
                                >
                                    <TextInput
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div>
                            {/* First Row: GSIS No and HDMF No */}
                            <div className="flex gap-5">
                                {/* GSIS No */}
                                <Form.Item
                                    label="GSIS No"
                                    name="gsis_no"
                                    validateStatus={errors.gsis_no ? 'error' : ''}
                                    help={errors.gsis_no}
                                >
                                    <TextInput
                                        type="number"
                                        value={data.gsis_no}
                                        onChange={(e) => setData('gsis_no', e.target.value)}
                                        className="w-full"
                                        autoComplete="off"
                                    />
                                </Form.Item>

                                {/* HDMF No */}
                                <Form.Item
                                    label="HDMF No"
                                    name="hdmf_no"
                                    validateStatus={errors.hdmf_no ? 'error' : ''}
                                    help={errors.hdmf_no}
                                >
                                    <TextInput
                                        type="number"
                                        value={data.hdmf_no}
                                        onChange={(e) => setData('hdmf_no', e.target.value)}
                                        className="w-full"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            </div>

                            {/* Second Row: PHIC No and BIR TIN No */}
                            <div className="flex gap-5">
                                {/* PHIC No */}
                                <Form.Item
                                    label="PHIC No"
                                    name="phic_no"
                                    validateStatus={errors.phic_no ? 'error' : ''}
                                    help={errors.phic_no}
                                >
                                    <TextInput
                                        type="number"
                                        value={data.phic_no}
                                        onChange={(e) => setData('phic_no', e.target.value)}
                                        className="w-full"
                                        autoComplete="off"
                                    />
                                </Form.Item>

                                {/* BIR TIN No */}
                                <Form.Item
                                    label="BIR TIN No"
                                    name="bir_tin_no"
                                    validateStatus={errors.bir_tin_no ? 'error' : ''}
                                    help={errors.bir_tin_no}
                                >
                                    <TextInput
                                        type="number"
                                        value={data.bir_tin_no}
                                        onChange={(e) => setData('bir_tin_no', e.target.value)}
                                        className="w-full"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="pb-2">
                            <label className="text-lg font-bold">Company Details</label>
                        </div>

                        <div className="flex gap-5 p-2">
                            {/* Employee ID */}
                            <Form.Item
                                label="Employee No."
                                name="employee_id"
                                validateStatus={errors.employee_id ? 'error' : ''}
                                help={errors.employee_id}
                                rules={[{ required: true, message: 'Employee No. is required' }]}
                            >
                                <TextInput
                                    autoComplete="off"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                />
                            </Form.Item>

                            {/* Start Date */}
                            <div className="flex flex-col">
                                <label>Start Date</label>
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                {errors.start_date && <div>{errors.start_date}</div>}
                            </div>
                        </div>

                        <div className="flex gap-5 p-2">
                            {/* Position */}
                            <Form.Item
                                label="Position"
                                name="position"
                                validateStatus={errors.position ? 'error' : ''}
                                help={errors.position}
                                rules={[{ required: true, message: 'Position is required' }]}
                                className="flex-1"
                            >
                                <Select
                                    value={data.position}
                                    onChange={(value) => setData('position', value)}
                                    placeholder="Select a position"
                                >
                                    {positions.map((position) => (
                                        <Select.Option key={position.id} value={position.id}>
                                            {position.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>{' '}
                            {/* Department */}
                            <Form.Item
                                label="Department"
                                name="department"
                                validateStatus={errors.department ? 'error' : ''}
                                help={errors.department}
                                rules={[{ required: true, message: 'Department is required' }]}
                                className="flex-1"
                            >
                                <Select
                                    value={data.department_id}
                                    onChange={(value) => setData('department', value)} // Set selected department
                                    placeholder="Select a Department"
                                >
                                    {departments.map((department) => (
                                        <Select.Option key={department.id} value={department.id}>
                                            {department.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="flex gap-5 p-2">
                            <Form.Item
                                label="Classification"
                                name="classification"
                                validateStatus={errors.classification ? 'error' : ''}
                                help={errors.classification}
                                rules={[{ required: true, message: 'Classification is required' }]}
                            >
                                <Select
                                    value={data.classification}
                                    onChange={(value) => setData('classification', value)}
                                    placeholder="Select Classification"
                                >
                                    <Option value="Regular">Regular</Option>
                                    <Option value="Casual">Casual</Option>
                                    <Option value="OJ/Job Order">OJ/Job Order</Option>
                                    <Option value="COS/Contract of Service">
                                        COS/Contract of Service
                                    </Option>
                                </Select>
                            </Form.Item>

                            {/* Employment Type */}
                            <Form.Item
                                label="Employment Type"
                                name="employment_type"
                                validateStatus={errors.employment_type ? 'error' : ''}
                                help={errors.employment_type}
                                rules={[{ required: true, message: 'Employee Type is required' }]}
                            >
                                <Select
                                    value={data.employment_type}
                                    onChange={(value) => setData('employment_type', value)}
                                    placeholder="Select Employment Type"
                                >
                                    <Option value="full-time">Full-time</Option>
                                    <Option value="part-time">Part-time</Option>
                                    <Option value="contract">Contract</Option>
                                </Select>
                            </Form.Item>

                            {/* Salary */}
                            <Form.Item
                                label="Salary Grade"
                                name="salary_grade_id"
                                validateStatus={errors.salary_grade_id ? 'error' : ''}
                                help={errors.salary_grade_id}
                                rules={[{ required: true, message: 'Salary Grade is required' }]}
                            >
                                <Select
                                    value={data.salary_grade_id}
                                    onChange={(value) =>
                                        setData({ ...data, salary_grade_id: value })
                                    }
                                    placeholder="Select Salary Grade"
                                >
                                    {salaryGrades?.map((grade) => (
                                        <Option key={grade.id} value={grade.id}>
                                            {grade.grade} - Step {grade.step} (₱
                                            {grade.monthly_salary})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Submit PrimaryButton */}
                        <div className="flex justify-end p-2">
                            <PrimaryButton
                                type="submit"
                                className="w-full rounded-md bg-high p-2 font-bold"
                            >
                                Save Changes
                            </PrimaryButton>
                        </div>
                    </div>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
}
