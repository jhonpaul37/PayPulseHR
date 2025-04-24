import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { message, Card, Empty, Modal } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';

export default function LoanPrograms({ programs }) {
    const [name, setName] = useState('');
    const [editingProgram, setEditingProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProgram) {
                await Inertia.put(`/loanPrograms/${editingProgram.id}`, { name });
                message.success('Loan Program updated successfully');
            } else {
                await Inertia.post('/loanPrograms', { name });
                message.success('Loan Program added successfully');
            }
        } catch (error) {
            message.error('Failed to add or update Loan Program');
        }

        setName('');
        setEditingProgram(null);
        setIsModalOpen(false);
    };

    const handleEdit = (program) => {
        setName(program.name);
        setEditingProgram(program);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setName('');
        setEditingProgram(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setName('');
        setEditingProgram(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold"></h2>
                <PrimaryButton size="small" onClick={handleAddNew}>
                    Add Program
                </PrimaryButton>
            </div>

            {programs && programs.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {programs.map((program) => (
                        <Card
                            key={program.id}
                            bodyStyle={{ padding: '10px' }}
                            className="cursor-pointer !p-2 transition hover:shadow-sm"
                            onClick={() => handleEdit(program)}
                        >
                            <div className="truncate text-center text-sm font-medium">
                                {program.name}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Empty description="No loan programs available" />
            )}

            <Modal
                title={editingProgram ? 'Edit Loan Program' : 'Add Loan Program'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                centered
            >
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="mb-1 block text-sm">Program Name</label>
                        <TextInput
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <DangerButton size="small" onClick={handleCancel}>
                            Cancel
                        </DangerButton>
                        <PrimaryButton size="small" type="submit">
                            {editingProgram ? 'Update' : 'Add'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
