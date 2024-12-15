import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { message } from 'antd'; // Import message
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import { Card, Empty, Modal } from 'antd';

export default function LoanPrograms({ programs }) {
    const [name, setName] = useState('');
    const [editingProgram, setEditingProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProgram) {
                await Inertia.put(`/loanPrograms/${editingProgram.id}`, { name });
                message.success('Loan Program updated successfully'); // Use message for success
            } else {
                await Inertia.post('/loanPrograms', { name });
                message.success('Loan Program added successfully'); // Use message for success
            }
        } catch (error) {
            message.error('Failed to add or update Loan Program'); // Use message for error
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

    // Dynamically set the grid width
    const getGridStyle = (totalPrograms) => {
        if (totalPrograms >= 4) {
            return { width: '25%', textAlign: 'center', cursor: 'pointer' };
        } else if (totalPrograms === 3) {
            return { width: '33.33%', textAlign: 'center', cursor: 'pointer' };
        } else if (totalPrograms === 2) {
            return { width: '50%', textAlign: 'center', cursor: 'pointer' };
        } else {
            return { width: '100%', textAlign: 'center', cursor: 'pointer' };
        }
    };

    return (
        <div>
            <div className="flex justify-end pb-5">
                <PrimaryButton type="primary" onClick={handleAddNew}>
                    Add Program
                </PrimaryButton>
            </div>
            {programs && programs.length > 0 ? (
                <Card title="Loan Programs">
                    {programs.map((program) => (
                        <Card.Grid
                            key={program.id}
                            style={getGridStyle(programs.length)}
                            onClick={() => handleEdit(program)}
                        >
                            <div className="text-lg font-bold">{program.name}</div>
                        </Card.Grid>
                    ))}
                </Card>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No loan programs available"
                />
            )}

            {/* Modal for Adding/Editing Programs */}
            <Modal
                title={editingProgram ? 'Edit Loan Program' : 'Add Loan Program'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="pr-5">Program Name</label>
                        <TextInput
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <DangerButton onClick={handleCancel}>Cancel</DangerButton>
                        <PrimaryButton type="submit">
                            {editingProgram ? 'Update' : 'Add'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
