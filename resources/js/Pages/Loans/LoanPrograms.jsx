import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import CancelButton from '@/Components/CancelButton'; // Import the CancelButton
import TextInput from '@/Components/TextInput';
import { Card, Empty, Modal } from 'antd';

export default function LoanPrograms({ programs }) {
    const [name, setName] = useState('');
    const [editingProgram, setEditingProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingProgram) {
            Inertia.put(`/loanPrograms/${editingProgram.id}`, { name });
        } else {
            Inertia.post('/loanPrograms', { name });
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
            {/* Loan Programs List */}
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
            <div className="pt-5">
                <PrimaryButton type="primary" onClick={handleAddNew}>
                    Add Program
                </PrimaryButton>
            </div>

            {/* Modal for Adding/Editing Programs */}
            <Modal
                title={editingProgram ? 'Edit Loan Program' : 'Add Loan Program'}
                open={isModalOpen} // Change from 'visible' to 'open'
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
                        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                        <PrimaryButton type="submit">
                            {editingProgram ? 'Update' : 'Add'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
