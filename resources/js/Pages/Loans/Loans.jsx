import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Divider } from 'antd';
import LoanPrograms from './LoanPrograms';
import LoanTypes from './LoanTypes';
import LoanPlans from './LoanPlans'; // Import the LoanPlans component

const Loans = ({ auth, loanPrograms, loanTypes, loanPlans }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Divider
                style={{
                    borderColor: '#F0C519',
                }}
            >
                <span className="text-xl font-bold">Loan Programs</span>
            </Divider>
            <LoanPrograms programs={loanPrograms} />

            <Divider
                style={{
                    borderColor: '#F0C519',
                }}
            >
                <span className="text-xl font-bold">Loan Types</span>
            </Divider>
            <LoanTypes loanPrograms={loanPrograms} loanTypes={loanTypes} />

            <Divider
                style={{
                    borderColor: '#F0C519',
                }}
            >
                <span className="text-xl font-bold">Loan Plans</span>
            </Divider>

            {/* Render the LoanPlans component */}
            <LoanPlans auth={auth} loanPlans={loanPlans} loanTypes={loanTypes} />
        </AuthenticatedLayout>
    );
};

export default Loans;
