import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message, Form, Input, DatePicker, Select, Button, Radio } from 'antd';

//Components
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

const { Option } = Select;

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
export default function NewEmployee({ auth, salaryGrades, positions, department }) {
    const { data, setData, post, errors } = useForm({
        name: '',
        salary_grade_id: '',
        employee_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        birthdate: '',
        birthPlace: '',
        sex: '',
        civil_status: '',
        nationality: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
        position_id: '',
        department_id: '',
        start_date: '',
        employment_type: '',
        salary: '',
        vacation_days: 0,
        sick_days: 0,
        leave_balance: 0,
        photo: null,
    });
    const handleFormChange = (changedValues, allValues) => {
        setData(allValues);
    };

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

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

    const handleSubmit = (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });

        post(route('employees.store'), {
            data: formData,
            forceFormData: true,
            onError: (errors) => {
                console.log(errors);
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
            <div className="">
                <h1 className="pb-10 text-center text-xl font-bold">Add New Employee</h1>
                <Form
                    onFinish={handleSubmit}
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
                            beforeUpload={() => false}
                            onChange={({ file }) => {
                                if (file.status === 'done' || file.originFileObj) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setImageUrl(reader.result);
                                        setData('photo', file.originFileObj);
                                    };
                                    reader.readAsDataURL(file.originFileObj);
                                }
                            }}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>

                        {errors.photo && (
                            <div className="mt-2 text-sm text-red-500">{errors.photo}</div>
                        )}
                        <label className="mt-2 text-gray-600">Profile Picture</label>
                    </div>

                    <div>
                        <div>
                            <div className="pb-2">
                                <label className="text-lg font-bold">Personal Information</label>
                            </div>

                            <div className="flex gap-5">
                                {/* First Name */}
                                <Form.Item
                                    label="First Name"
                                    name="first_name"
                                    validateStatus={errors.first_name ? 'error' : ''}
                                    help={errors.first_name}
                                    rules={[{ required: true, message: 'First name is required' }]}
                                >
                                    <TextInput
                                        autoComplete="off"
                                        value={data.first_name}
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
                                        value={data.last_name}
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
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                    />
                                </Form.Item>
                            </div>

                            <div className="flex gap-5 p-2">
                                {/* Birthdate */}
                                <Form.Item
                                    label="Birthdate"
                                    name="birthdate"
                                    validateStatus={errors.birthdate ? 'error' : ''}
                                    help={errors.birthdate}
                                    rules={[{ required: true, message: 'Birthdate is required' }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        value={data.birthdate ? new Date(data.birthdate) : null}
                                        onChange={(date, dateString) =>
                                            setData('birthdate', dateString)
                                        }
                                    />
                                </Form.Item>

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
                                    rules={[
                                        { required: true, message: 'Civil Status is required' },
                                    ]}
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
                            <div className="">
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
                        </div>
                        <div>
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
                                    />
                                </Form.Item>
                            </div>

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
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    {/* Company Details */}
                    <div>
                        <div className="pb-2">
                            <label className="text-lg font-bold">Company Detials</label>
                        </div>
                        <div className="flex gap-5">
                            {/* Employee No. */}
                            {/* <Form.Item
                                label="Employee No."
                                name="employee_id"
                                validateStatus={errors.employee_id ? 'error' : ''}
                                help={errors.employee_id}
                            >
                                <TextInput autoComplete="off" value={data.employee_id} readOnly />
                            </Form.Item> */}

                            {/* Start Date */}
                            <Form.Item
                                label="Start Date"
                                name="start_date"
                                validateStatus={errors.start_date ? 'error' : ''}
                                help={errors.start_date}
                                rules={[{ required: true, message: 'Start Date is required' }]}
                            >
                                <DatePicker
                                    value={data.start_date ? new Date(data.start_date) : null} // Use native JavaScript Date
                                    onChange={(date, dateString) =>
                                        setData('start_date', dateString)
                                    } // Directly update with dateString
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <div className="flex gap-5 p-2">
                            {/* Classification */}
                            <div className="flex gap-5">
                                <Form.Item
                                    label="Classification"
                                    name="classification"
                                    validateStatus={errors.classification ? 'error' : ''}
                                    help={errors.classification}
                                    rules={[
                                        { required: true, message: 'Classification is required' },
                                    ]}
                                >
                                    <Select
                                        value={data.classification}
                                        onChange={(value) => setData('classification', value)}
                                        placeholder="Select Classification"
                                    >
                                        <Option value="Regular">Regular</Option>
                                        <Option value="Casual">Casual</Option>
                                        <Option value="JO/Job Order">JO/Job Order</Option>
                                        <Option value="COS/Contract of Service">
                                            COS/Contract of Service
                                        </Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Employment Type"
                                    name="employment_type"
                                    validateStatus={errors.employment_type ? 'error' : ''}
                                    help={errors.employment_type}
                                    rules={[
                                        { required: true, message: 'Employee Type is required' },
                                    ]}
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
                            </div>

                            {/* Salary Grade */}
                            <div className="flex gap-5">
                                <Form.Item
                                    label="Salary Grade"
                                    name="salary_grade_id"
                                    validateStatus={errors.salary_grade_id ? 'error' : ''}
                                    help={errors.salary_grade_id}
                                    rules={[
                                        { required: true, message: 'Salary Grade is required' },
                                    ]}
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
                        </div>
                        <div className="flex gap-5 p-2">
                            <Form.Item
                                label="Position"
                                name="position_id" // Match the backend field name
                                validateStatus={errors.position_id ? 'error' : ''}
                                help={errors.position_id}
                                rules={[{ required: true, message: 'Position is required' }]}
                            >
                                <Select
                                    value={data.position_id} // Ensure it matches the backend field
                                    onChange={(value) => setData('position_id', value)} // Update the correct field
                                    placeholder="Select a position"
                                >
                                    {positions.length > 0 ? (
                                        positions.map((position) => (
                                            <Select.Option key={position.id} value={position.id}>
                                                {position.name}
                                            </Select.Option>
                                        ))
                                    ) : (
                                        <Select.Option disabled>Loading positions...</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Department"
                                name="department_id"
                                validateStatus={errors.department_id ? 'error' : ''}
                                help={errors.department_id}
                                rules={[{ required: true, message: 'Department is required' }]}
                            >
                                <Select
                                    value={data.department_id}
                                    onChange={(value) => {
                                        setData('department_id', value);
                                        // Optionally, trigger a request to get the new employee_id based on department
                                    }}
                                    placeholder="Select a Department"
                                >
                                    {department.map((dept) => (
                                        <Select.Option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="flex gap-5 p-2">
                            The password will automatically be generated using your last name and
                            birth year. The first letter will be capitalized, and all other letters
                            will be in lowercase. The year from your birthdate. For example, last
                            name is dOe and your birthdate is March 15, 1995, your generated
                            password would be: Doe1995
                        </div>

                        <div className="flex justify-end p-2">
                            <PrimaryButton
                                type="submit"
                                className="w-full rounded-md bg-high p-2 font-bold"
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </PrimaryButton>
                        </div>
                    </div>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
}
