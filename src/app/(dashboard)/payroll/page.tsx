'use client';

import { useState } from 'react';

// Mock employment data - from government_members.json
const mockEmployment = {
    position: 'FBI Special Agent',
    department: 'Federal Bureau of Investigation',
    govId: 'USGRP-FED-15-2601-1045',
    startDate: 'Jan 15, 2025',
    status: 'Active',
    supervisor: 'FBI Director',
    payGrade: 'GS-13',
    salary: 5500,
};

// Mock YTD summary - calculated from payslips table
const mockYTD = {
    grossPay: 11000,
    taxDeducted: 2420,
    netPay: 8580,
    paychecksReceived: 2,
};

// Mock payslips - from payslips table in SQLite
const mockPayslips = [
    { id: 'PAY-MK7W7HYJ', period: 'January 2026 (Week 3)', issueDate: 'Jan 19, 2026', gross: 5500, tax: 1210, net: 4290 },
    { id: 'PAY-MK7W7JTD', period: 'January 2026 (Week 2)', issueDate: 'Jan 12, 2026', gross: 5500, tax: 1210, net: 4290 },
];

// Mock pending payment - from payroll_schedule.json
const mockPendingPayment = {
    position: 'FBI Special Agent',
    payGrade: 'GS-13',
    grossPay: 5500,
    estimatedTax: 1210,
    netPay: 4290,
    payDate: 'Feb 1, 2026',
    daysUntil: 11,
    isPayday: false,
};

// Tax breakdown
const mockTaxBreakdown = {
    federal: 15.0,
    state: 5.0,
    fica: 2.0,
    total: 22.0,
};

export default function PayrollPage() {
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState<typeof mockPayslips[0] | null>(null);

    const openPayslip = (payslip: typeof mockPayslips[0]) => {
        setSelectedPayslip(payslip);
        setShowPayslipModal(true);
    };

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                    Payroll & Employment
                </h1>
                <p style={{ color: '#64748b' }}>View your employment details and pay history</p>
            </div>

            {/* Pending Payment Alert */}
            {mockPendingPayment.daysUntil <= 14 && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
                    border: '1px solid rgba(34,197,94,0.4)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '24px',
                    alignItems: 'center',
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '28px' }}>💵</span>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '18px', color: '#166534' }}>Upcoming Payday</div>
                                <div style={{ fontSize: '14px', color: '#15803d' }}>
                                    {mockPendingPayment.payDate} • {mockPendingPayment.daysUntil} days away
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Position</div>
                                <div style={{ fontWeight: 600 }}>{mockPendingPayment.position}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Gross Pay</div>
                                <div style={{ fontWeight: 600 }}>${mockPendingPayment.grossPay.toLocaleString()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Est. Tax</div>
                                <div style={{ fontWeight: 600, color: '#dc2626' }}>-${mockPendingPayment.estimatedTax.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px 32px', background: 'rgba(34,197,94,0.2)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#166534', marginBottom: '4px' }}>Expected Net Pay</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, color: '#166534' }}>
                            ${mockPendingPayment.netPay.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {/* Employment Details Card */}
            <div className="panel" style={{ marginBottom: '24px' }}>
                <div className="panel-header">
                    <h2>Employment Details</h2>
                    <span className="status-badge active">Active</span>
                </div>
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Position</div>
                            <div style={{ fontSize: '16px', fontWeight: 600 }}>{mockEmployment.position}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Department</div>
                            <div style={{ fontSize: '16px', fontWeight: 600 }}>{mockEmployment.department}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Government ID</div>
                            <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{mockEmployment.govId}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Start Date</div>
                            <div style={{ fontSize: '16px' }}>{mockEmployment.startDate}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pay Grade</div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary)' }}>{mockEmployment.payGrade}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Weekly Salary</div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e' }}>${mockEmployment.salary.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Supervisor</div>
                            <div style={{ fontSize: '16px' }}>{mockEmployment.supervisor}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* YTD Summary */}
            <div className="accounts-grid" style={{ marginBottom: '24px' }}>
                <div className="account-card">
                    <div className="account-icon">💵</div>
                    <div className="account-info">
                        <div className="account-type">YTD Gross Pay</div>
                        <div className="account-number">{mockYTD.paychecksReceived} paychecks</div>
                    </div>
                    <div className="account-balance">${mockYTD.grossPay.toLocaleString()}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#fef2f2' }}>🏛️</div>
                    <div className="account-info">
                        <div className="account-type">YTD Tax Withheld</div>
                        <div className="account-number">{mockTaxBreakdown.total}% effective rate</div>
                    </div>
                    <div className="account-balance" style={{ color: '#dc2626' }}>-${mockYTD.taxDeducted.toLocaleString()}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#f0fdf4' }}>✅</div>
                    <div className="account-info">
                        <div className="account-type">YTD Net Pay</div>
                        <div className="account-number">Deposited to checking</div>
                    </div>
                    <div className="account-balance" style={{ color: '#22c55e' }}>${mockYTD.netPay.toLocaleString()}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Payslips */}
                <div className="main-content">
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Recent Payslips</h2>
                            <button style={{
                                padding: '8px 16px',
                                background: 'var(--primary)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                📥 Download All
                            </button>
                        </div>
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th>Pay Period</th>
                                    <th>Issue Date</th>
                                    <th>Gross</th>
                                    <th>Tax</th>
                                    <th>Net</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockPayslips.map((payslip) => (
                                    <tr key={payslip.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{payslip.period}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{payslip.id}</div>
                                        </td>
                                        <td>{payslip.issueDate}</td>
                                        <td style={{ fontWeight: 600 }}>${payslip.gross.toLocaleString()}</td>
                                        <td style={{ color: '#dc2626' }}>-${payslip.tax.toLocaleString()}</td>
                                        <td style={{ fontWeight: 600, color: '#22c55e' }}>${payslip.net.toLocaleString()}</td>
                                        <td>
                                            <button
                                                onClick={() => openPayslip(payslip)}
                                                className="btn-link"
                                            >
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="sidebar-widgets">
                    {/* Tax Breakdown */}
                    <div className="sidebar-widget">
                        <h3>Tax Breakdown</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Federal Income Tax</span>
                                <span style={{ fontWeight: 600 }}>{mockTaxBreakdown.federal}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>State Tax</span>
                                <span style={{ fontWeight: 600 }}>{mockTaxBreakdown.state}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>FICA (Social Security)</span>
                                <span style={{ fontWeight: 600 }}>{mockTaxBreakdown.fica}%</span>
                            </div>
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600 }}>Total Effective Rate</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{mockTaxBreakdown.total}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-widget">
                        <h3>Quick Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn">📄 Download W-2</button>
                            <button className="quick-link-btn">💳 Update Direct Deposit</button>
                            <button className="quick-link-btn">📋 View Tax History</button>
                            <button className="quick-link-btn">❓ Payroll Support</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payslip Modal */}
            {showPayslipModal && selectedPayslip && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '560px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    }}>
                        <div style={{
                            padding: '24px',
                            background: 'linear-gradient(135deg, #112e51 0%, #205493 100%)',
                            borderRadius: '16px 16px 0 0',
                            color: 'white',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>PAYSLIP</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{selectedPayslip.period}</div>
                                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>{selectedPayslip.id}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Issued</div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedPayslip.issueDate}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Employee</div>
                                <div style={{ fontWeight: 600, fontSize: '16px' }}>{mockEmployment.position}</div>
                                <div style={{ fontSize: '14px', color: '#64748b' }}>{mockEmployment.department}</div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '16px',
                                padding: '20px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Gross Pay</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700 }}>${selectedPayslip.gross.toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Tax Withheld</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>-${selectedPayslip.tax.toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Net Pay</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${selectedPayslip.net.toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                                Deposited to Checking Account ****4523
                            </div>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowPayslipModal(false)} style={{
                                padding: '10px 20px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#475569',
                                cursor: 'pointer',
                            }}>
                                Close
                            </button>
                            <button style={{
                                padding: '10px 20px',
                                background: '#112e51',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}>
                                📥 Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
