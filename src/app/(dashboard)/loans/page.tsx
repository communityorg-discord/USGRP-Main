'use client';

import { useState, useEffect } from 'react';

interface Loan {
    loan_id: string;
    loan_type: string;
    principal: number;
    remaining_balance: number;
    interest_rate?: number;
    weekly_payment: number;
    status: string;
    payments_made?: number;
    term_weeks?: number;
    next_payment_date?: string;
}

interface CreditScore {
    score: number;
    band: string;
    factors?: { name: string; impact: string; detail: string }[];
}

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [credit, setCredit] = useState<CreditScore>({ score: 0, band: 'Unknown' });
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showCalculatorModal, setShowCalculatorModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
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

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/loans');
                if (res.ok) {
                    const data = await res.json();
                    setLoans(data.loans || []);
                    setCredit(data.credit || { score: 0, band: 'Unknown' });
                }
            } catch (error) {
                console.error('Failed to fetch loans:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const totalDebt = loans.reduce((s, l) => s + (l.remaining_balance || 0), 0);
    const weeklyPayments = loans.reduce((s, l) => s + (l.weekly_payment || 0), 0);

    const openPayment = (loan: Loan) => {
        setSelectedLoan(loan);
        setPaymentAmount(loan.weekly_payment.toString());
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

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: '#64748b' }}>Loading loans data...</div>
                </div>
            </div>
        );
    }

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
                        <div className="account-number">{credit.band}</div>
                    </div>
                    <div className="account-balance" style={{ color: credit.score >= 700 ? '#22c55e' : credit.score >= 500 ? '#fdb81e' : '#ef4444' }}>
                        {credit.score}
                    </div>
                </div>
                <div className="account-card">
                    <div className="account-icon">💳</div>
                    <div className="account-info">
                        <div className="account-type">Active Loans</div>
                        <div className="account-number">{loans.length} loans</div>
                    </div>
                    <div className="account-balance">{loans.length}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#fef2f2' }}>📅</div>
                    <div className="account-info">
                        <div className="account-type">Weekly Payments</div>
                        <div className="account-number">Due each week</div>
                    </div>
                    <div className="account-balance" style={{ color: '#ef4444' }}>${weeklyPayments.toLocaleString()}</div>
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
                            {loans.length === 0 ? (
                                <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                    <div style={{ fontWeight: 600 }}>No active loans</div>
                                    <div style={{ fontSize: '14px' }}>You're debt free!</div>
                                </div>
                            ) : (
                                loans.map((loan) => (
                                    <div
                                        key={loan.loan_id}
                                        style={{
                                            padding: '24px',
                                            background: '#f8fafc',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '20px' }}>{loan.loan_type} Loan</span>
                                                    <span style={{ padding: '4px 8px', background: loan.status === 'ACTIVE' ? '#dbeafe' : '#fef3c7', color: loan.status === 'ACTIVE' ? '#1d4ed8' : '#92400e', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                                                        {loan.status}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{loan.loan_id}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 700, fontSize: '28px', color: '#ef4444' }}>${(loan.remaining_balance || 0).toLocaleString()}</div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>of ${(loan.principal || 0).toLocaleString()}</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '13px', color: '#64748b' }}>Progress</span>
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{Math.round(((loan.principal - loan.remaining_balance) / loan.principal) * 100)}%</span>
                                            </div>
                                            <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${Math.max(0, ((loan.principal - loan.remaining_balance) / loan.principal) * 100)}%`,
                                                    background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                                                    borderRadius: '5px',
                                                }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px', padding: '16px', background: 'white', borderRadius: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>APR</div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>{loan.interest_rate || 0}%</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Weekly</div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>${loan.weekly_payment}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Payments</div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>{loan.payments_made || 0} / {loan.term_weeks || '?'}</div>
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
                                ))
                            )}
                        </div>
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
                                    <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="url(#scoreGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(credit.score / 850) * 157} 157`} />
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="50%" stopColor="#fdb81e" />
                                            <stop offset="100%" stopColor="#22c55e" />
                                        </linearGradient>
                                    </defs>
                                    <text x="60" y="52" textAnchor="middle" fontSize="28" fontWeight="700" fill="#112e51">{credit.score}</text>
                                    <text x="60" y="70" textAnchor="middle" fontSize="11" fill="#64748b">{credit.band}</text>
                                </svg>
                            </div>
                        </div>
                        {credit.factors && credit.factors.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {credit.factors.map((factor, idx) => (
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
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-widget">
                        <h3>Quick Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn" onClick={() => setShowApplyModal(true)}>
                                <span>➕</span> Apply for Loan
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
                            <p style={{ fontSize: '14px', color: '#64748b' }}>{selectedLoan.loan_id} - {selectedLoan.loan_type} Loan</p>
                        </div>
                        {!paymentSuccess ? (
                            <>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <div><div style={{ fontSize: '12px', color: '#64748b' }}>Balance</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>${selectedLoan.remaining_balance.toLocaleString()}</div></div>
                                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#64748b' }}>Weekly Due</div><div style={{ fontSize: '24px', fontWeight: 700 }}>${selectedLoan.weekly_payment}</div></div>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Payment Amount</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '18px' }}>$</span>
                                            <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '18px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                        <button onClick={() => setPaymentAmount(selectedLoan.weekly_payment.toString())} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Weekly (${selectedLoan.weekly_payment})</button>
                                        <button onClick={() => setPaymentAmount(selectedLoan.remaining_balance.toString())} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Pay Off (${selectedLoan.remaining_balance.toLocaleString()})</button>
                                    </div>
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
                                        <option value="4">4 weeks</option>
                                        <option value="8">8 weeks</option>
                                        <option value="12">12 weeks</option>
                                        <option value="24">24 weeks</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Based on your credit score of {credit.score}:</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Estimated APR</span>
                                    <span style={{ fontWeight: 600, color: '#22c55e' }}>{loanType === 'Payday' ? '2000%' : loanType === 'Housing' ? '5.5%' : loanType === 'Vehicle' ? '7.5%' : '12%'}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowApplyModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => { alert('Application submitted! Use /bank loan in Discord to apply.'); setShowApplyModal(false); }} style={{ padding: '10px 24px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Submit Application</button>
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
