{
    /* Section for Paid Loans */
}
<div>
    <Divider style={{ borderColor: '#F0C519', marginTop: '20px' }}>
        <span className="text-lg font-bold">Paid Loans</span>
    </Divider>
    {employeeLoan
        .filter((loan) => {
            const totalPaid = loan.payments.reduce(
                (acc, payment) => acc + parseFloat(payment.amount),
                0
            );
            return totalPaid >= loan.amount; // Show only fully paid loans
        })
        .map((loan) => {
            const totalPaid = loan.payments.reduce(
                (acc, payment) => acc + parseFloat(payment.amount),
                0
            );

            return (
                <div
                    key={loan.id}
                    className="rounded-lg border border-gray-300 p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg"
                >
                    {/* Basic Info */}
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {loan.employee?.first_name || 'N/A'} {loan.employee?.last_name || ''}
                        </h3>
                        <span className="text-sm text-gray-500">
                            <strong>Loan Date: </strong> {formatDate(loan.loan_date)}
                        </span>
                    </div>

                    {/* Loan Details */}
                    <div className="grid grid-cols-3 text-sm text-gray-600">
                        <p>
                            <strong>Loan Type:</strong> {loan.loan_type?.type || 'N/A'}
                        </p>
                        <p>
                            <strong>Amount:</strong> ₱{loan.amount.toLocaleString()}
                        </p>
                        <p>
                            <strong>Status:</strong>
                            <span className="ml-2 inline-flex items-center justify-center rounded bg-green-500 px-2 py-1 text-xs font-bold text-white">
                                Fully Paid
                            </span>
                        </p>
                    </div>

                    {/* Payment History Button */}
                    <div className="mt-4 flex justify-end">
                        <PrimaryButton
                            onClick={() =>
                                (window.location.href = route('loan.details', {
                                    employeeLoan: loan.id,
                                }))
                            }
                            className="px-4 py-2 text-center"
                        >
                            Payment History
                        </PrimaryButton>
                    </div>
                </div>
            );
        })}
</div>;
