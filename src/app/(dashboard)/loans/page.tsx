'use client';

import { useState } from 'react';

// Mock loans
const mockLoans = [
    { id: 'LOAN-001', type: 'Housing', principal: 50000, remaining: 42500, apr: 5.5, status: 'current', nextPayment: 'Feb 1, 2026', monthlyPayment: 950, dueIn: 11, term: 60, payments: 18 },
    { id: 'LOAN-002', type: 'Vehicle', principal: 25000, remaining: 18750, apr: 7.5, status: 'current', nextPayment: 'Jan 28, 2026', monthlyPayment: 485, dueIn: 7, term: 36, payments: 12 },
];

// Mock credit score
const mockCreditScore = {
    score: 720,
    rating: 'Good',
    change: 15,
    factors: [
        { name: 'Payment History', impact: 'positive', detail: 'All payments on time' },
        { name: 'Credit Utilization', impact: 'positive', detail: '25% of limit used' },
        { name: 'Account Age', impact: 'neutral', detail: '1 year average' },
        { name: 'Recent Inquiries', impact: 'negative', detail: '2 in last 6 months' },
    ],
};

// Mock loan history
const mockLoanHistory = [
    { id: 'LOAN-000', type: 'Personal', principal: 5000, paidOff: 'Nov 2025', totalPaid: 5450, interest: 450 },
];

export default function LoansPage() {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showCalculatorModal, setShowCalculatorModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<typeof mockLoans[0] | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Apply form
    const [loanType, setLoanType] = useState('Personal');
    const [loanAmount, setLoanAmount] = useState('');
    const [loanTerm, setLoanTerm] = useState('12');

    // Calculator
    const [calcAmount, setCalcAmount] = useState('10000');
    const [calcRate, setCalcRate] = useState('12');
    const [calcTerm, setCalcTerm] = useState('12');

    const totalDebt = mockLoans.reduce((s, l) => s + l.remaining, 0);
    const monthlyPayments = mockLoans.reduce((s, l) => s + l.monthlyPayment, 0);

    const openPayment = (loan: typeof mockLoans[0]) => {
        setSelectedLoan(loan);
        setPaymentAmount(loan.monthlyPayment.toString());
        setShowPaymentModal(true);
    };

    const handlePayment = () => {
        setPaymentSuccess(true);
        setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentSuccess(false);
            setPaymentAmount('');
        }, 2000);
    };

    const calculateMonthly = (p: number, r: number, n: number) => {
        const monthlyRate = r / 100 / 12;
        if (monthlyRate === 0) return Math.round(p / n);
        return Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    };

    return (
        <div>
            {/* Page Header with Banner */}
            <div className="welcome-banner">
                <div>
                    <h1>Loans & Credit</h1>
                    <p>Manage your loans and monitor your credit score</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Total Debt</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#fca5a5' }}>${totalDebt.toLocaleString()}</div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="accounts-grid">
                <div className="account-card">
                    <div className="account-icon">📊</div>
                    <div className="account-info">
                        <div className="account-type">Credit Score</div>
                        <div className="account-number">{mockCreditScore.rating}</div>
                    </div>
                    <div className="account-balance" style={{ color: mockCreditScore.score >= 700 ? '#22c55e' : '#fdb81e' }}>
                        {mockCreditScore.score}
                    </div>
                </div>
                <div className="account-card">
                    <div className="account-icon">💳</div>
                    <div className="account-info">
                        <div className="account-type">Active Loans</div>
                        <div className="account-number">{mockLoans.length} loans</div>
                    </div>
                    <div className="account-balance">{mockLoans.length}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#fef2f2' }}>📅</div>
                    <div className="account-info">
                        <div className="account-type">Monthly Payments</div>
                        <div className="account-number">Due each month</div>
                    </div>
                    <div className="account-balance" style={{ color: '#ef4444' }}>${monthlyPayments.toLocaleString()}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', marginTop: '24px' }}>
                <button onClick={() => setShowApplyModal(true)} style={{ padding: '12px 24px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ➕ Apply for Loan
                </button>
                <button onClick={() => setShowCalculatorModal(true)} style={{ padding: '12px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🧮 Loan Calculator
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Left Column - Loans */}
                <div className="main-content">
                    {/* Active Loans */}
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Active Loans</h2>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {mockLoans.map((loan) => (
                                <div
                                    key={loan.id}
                                    style={{
                                        padding: '24px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        border: loan.dueIn <= 7 ? '2px solid #fdb81e' : '1px solid #e2e8f0',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 700, fontSize: '20px' }}>{loan.type} Loan</span>
                                                {loan.dueIn <= 7 && (
                                                    <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                                                        Due in {loan.dueIn} days
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{loan.id}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: '28px', color: '#ef4444' }}>${loan.remaining.toLocaleString()}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>of ${loan.principal.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '13px', color: '#64748b' }}>Progress</span>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{Math.round(((loan.principal - loan.remaining) / loan.principal) * 100)}%</span>
                                        </div>
                                        <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${((loan.principal - loan.remaining) / loan.principal) * 100}%`,
                                                background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                                                borderRadius: '5px',
                                            }} />
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                                            {loan.payments} of {loan.term} payments made
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px', padding: '16px', background: 'white', borderRadius: '8px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>APR</div>
                                            <div style={{ fontWeight: 600, fontSize: '16px' }}>{loan.apr}%</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Monthly</div>
                                            <div style={{ fontWeight: 600, fontSize: '16px' }}>${loan.monthlyPayment}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Next Due</div>
                                            <div style={{ fontWeight: 600, fontSize: '16px', color: loan.dueIn <= 7 ? '#fdb81e' : undefined }}>{loan.nextPayment}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Term</div>
                                            <div style={{ fontWeight: 600, fontSize: '16px' }}>{loan.term} mo</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => openPayment(loan)} style={{ flex: 1, padding: '12px 24px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                            Make Payment
                                        </button>
                                        <button style={{ padding: '12px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer' }}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loan History */}
                    <div className="panel" style={{ marginTop: '24px' }}>
                        <div className="panel-header">
                            <h2>Paid Off Loans</h2>
                        </div>
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th>Loan</th>
                                    <th>Principal</th>
                                    <th>Interest Paid</th>
                                    <th>Total Paid</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockLoanHistory.map((loan) => (
                                    <tr key={loan.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{loan.type} Loan</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{loan.id}</div>
                                        </td>
                                        <td>${loan.principal.toLocaleString()}</td>
                                        <td style={{ color: '#64748b' }}>${loan.interest.toLocaleString()}</td>
                                        <td style={{ fontWeight: 600 }}>${loan.totalPaid.toLocaleString()}</td>
                                        <td>
                                            <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                                                ✓ Paid Off ({loan.paidOff})
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column - Credit & Stats */}
                <div className="sidebar-widgets">
                    {/* Credit Score */}
                    <div className="sidebar-widget">
                        <h3>Credit Score</h3>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div className="credit-gauge">
                                <svg viewBox="0 0 120 80" style={{ width: '100%', maxWidth: '160px' }}>
                                    <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="12" strokeLinecap="round" />
                                    <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="url(#scoreGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(mockCreditScore.score / 850) * 157} 157`} />
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="50%" stopColor="#fdb81e" />
                                            <stop offset="100%" stopColor="#22c55e" />
                                        </linearGradient>
                                    </defs>
                                    <text x="60" y="52" textAnchor="middle" fontSize="28" fontWeight="700" fill="#112e51">{mockCreditScore.score}</text>
                                    <text x="60" y="70" textAnchor="middle" fontSize="11" fill="#64748b">{mockCreditScore.rating}</text>
                                </svg>
                            </div>
                            <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 500 }}>↑ +{mockCreditScore.change} this month</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {mockCreditScore.factors.map((factor, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{factor.name}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{factor.detail}</div>
                                    </div>
                                    <span style={{ fontSize: '18px', color: factor.impact === 'positive' ? '#22c55e' : factor.impact === 'negative' ? '#ef4444' : '#64748b' }}>
                                        {factor.impact === 'positive' ? '↑' : factor.impact === 'negative' ? '↓' : '–'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-widget">
                        <h3>Quick Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn" onClick={() => setShowApplyModal(true)}>
                                <span>➕</span> Apply for Loan
                            </button>
                            <button className="quick-link-btn">
                                <span>📄</span> View Statements
                            </button>
                            <button className="quick-link-btn">
                                <span>📊</span> Credit Report
                            </button>
                            <button className="quick-link-btn" onClick={() => setShowCalculatorModal(true)}>
                                <span>🧮</span> Loan Calculator
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedLoan && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '460px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Make Loan Payment</h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>{selectedLoan.id} - {selectedLoan.type} Loan</p>
                        </div>
                        {!paymentSuccess ? (
                            <>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <div><div style={{ fontSize: '12px', color: '#64748b' }}>Balance</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>${selectedLoan.remaining.toLocaleString()}</div></div>
                                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#64748b' }}>Monthly Due</div><div style={{ fontSize: '24px', fontWeight: 700 }}>${selectedLoan.monthlyPayment}</div></div>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Payment Amount</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '18px' }}>$</span>
                                            <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '18px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                        <button onClick={() => setPaymentAmount(selectedLoan.monthlyPayment.toString())} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Monthly (${selectedLoan.monthlyPayment})</button>
                                        <button onClick={() => setPaymentAmount(selectedLoan.remaining.toString())} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Pay Off (${selectedLoan.remaining.toLocaleString()})</button>
                                    </div>
                                    {paymentAmount && (
                                        <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '12px', color: '#166534' }}>New Balance</div>
                                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${Math.max(0, selectedLoan.remaining - Number(paymentAmount)).toLocaleString()}</div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowPaymentModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handlePayment} style={{ padding: '10px 24px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Submit Payment</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <div style={{ fontSize: '20px', fontWeight: 600, color: '#112e51', marginBottom: '8px' }}>Payment Successful!</div>
                                <div style={{ color: '#64748b' }}>${Number(paymentAmount).toLocaleString()} applied to your loan</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Apply Modal */}
            {showApplyModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '480px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Apply for a Loan</h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Get pre-approved in minutes</p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Loan Type</label>
                                <select value={loanType} onChange={(e) => setLoanType(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                    <option value="Personal">Personal Loan</option>
                                    <option value="Housing">Housing Loan</option>
                                    <option value="Vehicle">Vehicle Loan</option>
                                    <option value="Payday">Payday Loan (High APR)</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Amount</label>
                                    <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="$0" style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Term</label>
                                    <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                        <option value="6">6 months</option>
                                        <option value="12">12 months</option>
                                        <option value="24">24 months</option>
                                        <option value="36">36 months</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Based on your credit score of {mockCreditScore.score}:</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Estimated APR</span>
                                    <span style={{ fontWeight: 600, color: '#22c55e' }}>{loanType === 'Payday' ? '2000%' : loanType === 'Housing' ? '5.5%' : loanType === 'Vehicle' ? '7.5%' : '12%'}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowApplyModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => { alert('Application submitted! Check Discord for approval status.'); setShowApplyModal(false); }} style={{ padding: '10px 24px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Submit Application</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculator Modal */}
            {showCalculatorModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '480px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>🧮 Loan Calculator</h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Estimate your monthly payments</p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Amount ($)</label>
                                    <input type="number" value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>APR (%)</label>
                                    <input type="number" value={calcRate} onChange={(e) => setCalcRate(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Term (mo)</label>
                                    <input type="number" value={calcTerm} onChange={(e) => setCalcTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #112e51 0%, #205493 100%)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Estimated Monthly Payment</div>
                                <div style={{ fontSize: '40px', fontWeight: 700 }}>${calculateMonthly(Number(calcAmount), Number(calcRate), Number(calcTerm)).toLocaleString()}</div>
                                <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '12px' }}>
                                    Total: ${(calculateMonthly(Number(calcAmount), Number(calcRate), Number(calcTerm)) * Number(calcTerm)).toLocaleString()} | Interest: ${((calculateMonthly(Number(calcAmount), Number(calcRate), Number(calcTerm)) * Number(calcTerm)) - Number(calcAmount)).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                            <button onClick={() => setShowCalculatorModal(false)} style={{ width: '100%', padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
