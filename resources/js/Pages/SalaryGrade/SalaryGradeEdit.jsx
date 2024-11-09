import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Edit = ({ salaryGrade, auth }) => {
    const { data, setData, put } = useForm({
        grade: salaryGrade.grade,
        step: salaryGrade.step,
        monthly_salary: salaryGrade.monthly_salary,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/salary_grades/${salaryGrade.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <h2 className="mb-4 text-xl">Edit Salary Grade</h2>
                <Form onSubmitCapture={handleSubmit}>
                    <Form.Item label="Grade">
                        <Input
                            value={data.grade}
                            onChange={(e) => setData('grade', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Step">
                        <Input
                            value={data.step}
                            onChange={(e) => setData('step', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Monthly Salary">
                        <InputNumber
                            value={data.monthly_salary}
                            onChange={(value) => setData('monthly_salary', value)}
                            formatter={(value) => `$ ${value}`}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
