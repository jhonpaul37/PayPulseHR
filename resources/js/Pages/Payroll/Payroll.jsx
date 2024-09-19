import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Anchor } from 'antd';

const payroll = ({ auth }) => (
    <>
        <AuthenticatedLayout user={auth.user}>
            <div
                style={{
                    padding: '20px',
                }}
            >
                <Anchor
                    direction="horizontal"
                    affix={false} // To prevent the anchor from sticking while scrolling
                    items={[
                        {
                            key: 'part-1',
                            href: '#part-1',
                            title: 'Part 1',
                        },
                        {
                            key: 'part-2',
                            href: '#part-2',
                            title: 'Part 2',
                        },
                        {
                            key: 'part-3',
                            href: '#part-3',
                            title: 'Part 3',
                        },
                    ]}
                />
            </div>
            <div>
                <div
                    id="part-1"
                    style={{
                        width: '100vw',
                        height: '100vh',
                        textAlign: 'center',
                        background: 'rgba(0,255,0,0.02)',
                    }}
                >
                    Part 1 Content
                </div>
                <div
                    id="part-2"
                    style={{
                        width: '100vw',
                        height: '100vh',
                        textAlign: 'center',
                        background: 'rgba(0,0,255,0.02)',
                    }}
                >
                    Part 2 Content
                </div>
                <div
                    id="part-3"
                    style={{
                        width: '100vw',
                        height: '100vh',
                        textAlign: 'center',
                        background: '#FFFBE9',
                    }}
                >
                    Part 3 Content
                </div>
            </div>
        </AuthenticatedLayout>

        {/* Adding smooth scrolling to the entire page */}
        <style jsx>{`
            html {
                scroll-behavior: smooth;
            }
        `}</style>
    </>
);

export default payroll;
