'use client';

import { useState, useEffect } from 'react';

interface Payslip {
    payslip_id: string;
    period?: string;
    issue_date?: string;
    gross_pay: number;
    tax_withheld: number;
    net_pay: number;
}

interface Job {
    position?: string;
    department?: string;
    gov_id?: string;
    start_date?: string;
    status?: string;
    pay_grade?: string;
    salary?: number;
}

export default function PayrollPage() {
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/payroll');
                if (res.ok) {
                    const data = await res.json();
                    setPayslips(data.payslips || []);
                    setJob(data.job || null);
                }
            } catch (error) {
                console.error('Failed to fetch payroll:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const openPayslip = (payslip: Payslip) => {
        setSelectedPayslip(payslip);
        setShowPayslipModal(true);
    };

    const ytdGross = payslips.reduce((s, p) => s + (p.gross_pay || 0), 0);
    const ytdTax = payslips.reduce((s, p) => s + (p.tax_withheld || 0), 0);
    const ytdNet = payslips.reduce((s, p) => s + (p.net_pay || 0), 0);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: '#64748b' }}>Loading payroll data...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                    Payroll & Employment
                </h1>
                <p style={{ color: '#64748b' }}>View your employment details and pay history</p>
            </div>

            {/* Employment Details Card */}
            <div className="panel" style={{ marginBottom: '24px' }}>
                <div className="panel-header">
                    <h2>Employment Details</h2>
                    {job && <span className="status-badge active">{job.status || 'Active'}</span>}
                </div>
                <div style={{ padding: '24px' }}>
                    {!job ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
                            <div style={{ fontWeight: 600 }}>No employment record found</div>
                            <div style={{ fontSize: '14px' }}>Apply for government positions in Discord</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Position</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{job.position || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Department</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{job.department || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Government ID</div>
                                <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{job.gov_id || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Start Date</div>
                                <div style={{ fontSize: '16px' }}>{job.start_date || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pay Grade</div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary)' }}>{job.pay_grade || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Weekly Salary</div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e' }}>${(job.salary || 0).toLocaleString()}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* YTD Summary */}
            <div className="accounts-grid" style={{ marginBottom: '24px' }}>
                <div className="account-card">
                    <div className="account-icon">💵</div>
                    <div className="account-info">
                        <div className="account-type">YTD Gross Pay</div>
                        <div className="account-number">{payslips.length} paychecks</div>
                    </div>
                    <div className="account-balance">${ytdGross.toLocaleString()}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#fef2f2' }}>🏛️</div>
                    <div className="account-info">
                        <div className="account-type">YTD Tax Withheld</div>
                        <div className="account-number">{ytdGross > 0 ? Math.round((ytdTax / ytdGross) * 100) : 0}% effective rate</div>
                    </div>
                    <div className="account-balance" style={{ color: '#dc2626' }}>-${ytdTax.toLocaleString()}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#f0fdf4' }}>✅</div>
                    <div className="account-info">
                        <div className="account-type">YTD Net Pay</div>
                        <div className="account-number">Deposited to checking</div>
                    </div>
                    <div className="account-balance" style={{ color: '#22c55e' }}>${ytdNet.toLocaleString()}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Payslips */}
                <div className="main-content">
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Recent Payslips</h2>
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
                                {payslips.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                            No payslips found
                                        </td>
                                    </tr>
                                ) : (
                                    payslips.map((payslip) => (
                                        <tr key={payslip.payslip_id}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{payslip.period || 'Pay Period'}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{payslip.payslip_id}</div>
                                            </td>
                                            <td>{payslip.issue_date || 'N/A'}</td>
                                            <td style={{ fontWeight: 600 }}>${(payslip.gross_pay || 0).toLocaleString()}</td>
                                            <td style={{ color: '#dc2626' }}>-${(payslip.tax_withheld || 0).toLocaleString()}</td>
                                            <td style={{ fontWeight: 600, color: '#22c55e' }}>${(payslip.net_pay || 0).toLocaleString()}</td>
                                            <td>
                                                <button onClick={() => openPayslip(payslip)} className="btn-link">
                                                    View →
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="sidebar-widgets">
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
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '560px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '24px', background: 'linear-gradient(135deg, #112e51 0%, #205493 100%)', borderRadius: '16px 16px 0 0', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>PAYSLIP</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{selectedPayslip.period || 'Pay Period'}</div>
                                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>{selectedPayslip.payslip_id}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Issued</div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedPayslip.issue_date || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            {job && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Employee</div>
                                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{job.position}</div>
                                    <div style={{ fontSize: '14px', color: '#64748b' }}>{job.department}</div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '12px', marginBottom: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Gross Pay</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700 }}>${(selectedPayslip.gross_pay || 0).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Tax Withheld</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>-${(selectedPayslip.tax_withheld || 0).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Net Pay</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${(selectedPayslip.net_pay || 0).toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                                Deposited to Checking Account
                            </div>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowPayslipModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>
                                Close
                            </button>
                            <button style={{ padding: '10px 20px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                📥 Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
