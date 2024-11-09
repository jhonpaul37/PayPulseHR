import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Create = ({ auth }) => {
    const { data, setData, post } = useForm({
        grade: '',
        step: '',
        monthly_salary: '',
    });

    const handleSubmit = () => {
        post('/salary_grades', {
            data: {
                grade: data.grade,
                step: data.step,
                monthly_salary: data.monthly_salary,
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <h2 className="mb-4 text-xl">Create New Salary Grade</h2>
                <Form onFinish={handleSubmit}>
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
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
