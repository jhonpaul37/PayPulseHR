import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Form, Input, Button, message } from 'antd';

export default function ContributionCreate() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        Inertia.post('/contributions', values, {
            onSuccess: () => message.success('Contribution created successfully'),
        });
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input the name' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="amount" label="Amount">
                <Input type="number" step="0.01" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
}
