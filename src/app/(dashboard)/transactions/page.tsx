'use client';

import { useState, useMemo } from 'react';

// More mock transactions for fuller display
const mockTransactions = [
    { id: 1, description: 'Weekly Salary - FBI', amount: 4290, date: '2026-01-19', type: 'credit', category: 'Payroll', account: 'Checking' },
    { id: 2, description: 'Transfer to Jane Smith', amount: -500, date: '2026-01-18', type: 'debit', category: 'Transfer', account: 'Checking' },
    { id: 3, description: 'Convenience Store', amount: -45, date: '2026-01-17', type: 'debit', category: 'Shopping', account: 'Checking' },
    { id: 4, description: 'Casino Winnings', amount: 250, date: '2026-01-16', type: 'credit', category: 'Gambling', account: 'Checking' },
    { id: 5, description: 'Housing Rent', amount: -1500, date: '2026-01-15', type: 'debit', category: 'Housing', account: 'Checking' },
    { id: 6, description: 'Interest Payment', amount: 12, date: '2026-01-14', type: 'credit', category: 'Interest', account: 'Savings' },
    { id: 7, description: 'Weekly Salary - FBI', amount: 4290, date: '2026-01-12', type: 'credit', category: 'Payroll', account: 'Checking' },
    { id: 8, description: 'ATM Withdrawal', amount: -200, date: '2026-01-11', type: 'debit', category: 'Cash', account: 'Checking' },
    { id: 9, description: 'Gas Station', amount: -55, date: '2026-01-10', type: 'debit', category: 'Transportation', account: 'Checking' },
    { id: 10, description: 'Restaurant', amount: -85, date: '2026-01-09', type: 'debit', category: 'Food', account: 'Credit Card' },
    { id: 11, description: 'Grocery Store', amount: -125, date: '2026-01-08', type: 'debit', category: 'Food', account: 'Checking' },
    { id: 12, description: 'Electric Bill', amount: -95, date: '2026-01-07', type: 'debit', category: 'Utilities', account: 'Checking' },
];

const categories = ['All', 'Payroll', 'Transfer', 'Shopping', 'Gambling', 'Housing', 'Interest', 'Cash', 'Transportation', 'Food', 'Utilities'];
const accounts = ['All', 'Checking', 'Savings', 'Credit Card'];
const types = ['All', 'Income', 'Expenses'];

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [accountFilter, setAccountFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [dateRange, setDateRange] = useState('30');
    const [showExportModal, setShowExportModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTx, setSelectedTx] = useState<typeof mockTransactions[0] | null>(null);

    const filteredTransactions = useMemo(() => {
        return mockTransactions.filter(tx => {
            if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
            if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
            if (accountFilter !== 'All' && tx.account !== accountFilter) return false;
            if (typeFilter === 'Income' && tx.amount < 0) return false;
            if (typeFilter === 'Expenses' && tx.amount > 0) return false;
            return true;
        });
    }, [search, categoryFilter, accountFilter, typeFilter]);

    const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalExpenses = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
    const netFlow = totalIncome - totalExpenses;

    const handleExport = () => {
        const csv = [
            ['Date', 'Description', 'Category', 'Account', 'Amount'],
            ...filteredTransactions.map(t => [t.date, t.description, t.category, t.account, t.amount.toString()])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        setShowExportModal(false);
    };

    // Calculate category breakdown
    const categoryBreakdown = useMemo(() => {
        const breakdown: { [key: string]: number } = {};
        filteredTransactions.filter(t => t.amount < 0).forEach(t => {
            breakdown[t.category] = (breakdown[t.category] || 0) + Math.abs(t.amount);
        });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [filteredTransactions]);

    return (
        <div>
            {/* Page Header with Banner */}
            <div className="welcome-banner">
                <div>
                    <h1>Transaction History</h1>
                    <p>View and export your transaction history</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Net Flow (This Period)</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: netFlow >= 0 ? '#86efac' : '#fca5a5' }}>
                        {netFlow >= 0 ? '+' : '-'}${Math.abs(netFlow).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="accounts-grid">
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#f0fdf4' }}>📈</div>
                    <div className="account-info">
                        <div className="account-type">Total Income</div>
                        <div className="account-number">{filteredTransactions.filter(t => t.amount > 0).length} transactions</div>
                    </div>
                    <div className="account-balance" style={{ color: '#22c55e' }}>+${totalIncome.toLocaleString()}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#fef2f2' }}>📉</div>
                    <div className="account-info">
                        <div className="account-type">Total Expenses</div>
                        <div className="account-number">{filteredTransactions.filter(t => t.amount < 0).length} transactions</div>
                    </div>
                    <div className="account-balance" style={{ color: '#ef4444' }}>-${totalExpenses.toLocaleString()}</div>
                </div>
                <div className="account-card" style={{ cursor: 'pointer' }} onClick={() => setShowExportModal(true)}>
                    <div className="account-icon" style={{ background: '#eff6ff' }}>📥</div>
                    <div className="account-info">
                        <div className="account-type">Export Data</div>
                        <div className="account-number">Download as CSV</div>
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Export →</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Left Column - Transactions */}
                <div className="main-content">
                    {/* Filters */}
                    <div className="panel" style={{ marginBottom: '24px' }}>
                        <div style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    padding: '10px 16px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    width: '200px',
                                }}
                            />
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                            </select>
                            <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {accounts.map(a => <option key={a} value={a}>{a === 'All' ? 'All Accounts' : a}</option>)}
                            </select>
                            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="365">Last year</option>
                            </select>
                            {(categoryFilter !== 'All' || accountFilter !== 'All' || typeFilter !== 'All' || search) && (
                                <button onClick={() => { setCategoryFilter('All'); setAccountFilter('All'); setTypeFilter('All'); setSearch(''); }} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#64748b', fontSize: '14px', cursor: 'pointer' }}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Transactions ({filteredTransactions.length})</h2>
                        </div>
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Account</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                            No transactions found matching your filters
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedTx(tx); setShowDetailModal(true); }}>
                                            <td>
                                                <div className={`tx-icon ${tx.type}`}>{tx.type === 'credit' ? '↓' : '↑'}</div>
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{tx.description}</td>
                                            <td>
                                                <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '4px', fontSize: '12px' }}>{tx.category}</span>
                                            </td>
                                            <td style={{ color: '#64748b' }}>{tx.account}</td>
                                            <td style={{ color: '#64748b' }}>{tx.date}</td>
                                            <td className={`tx-amount ${tx.type}`} style={{ fontWeight: 600 }}>
                                                {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column - Insights */}
                <div className="sidebar-widgets">
                    {/* Spending Breakdown */}
                    <div className="sidebar-widget">
                        <h3>Spending by Category</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {categoryBreakdown.map(([cat, amount]) => (
                                <div key={cat}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '14px' }}>{cat}</span>
                                        <span style={{ fontWeight: 600 }}>${amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(amount / totalExpenses) * 100}%`, background: 'var(--primary)', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="sidebar-widget">
                        <h3>Quick Stats</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Avg Transaction</span>
                                <span style={{ fontWeight: 600 }}>${Math.round(totalExpenses / filteredTransactions.filter(t => t.amount < 0).length).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Largest Expense</span>
                                <span style={{ fontWeight: 600, color: '#ef4444' }}>-${Math.max(...filteredTransactions.filter(t => t.amount < 0).map(t => Math.abs(t.amount)))}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Largest Income</span>
                                <span style={{ fontWeight: 600, color: '#22c55e' }}>+${Math.max(...filteredTransactions.filter(t => t.amount > 0).map(t => t.amount))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="sidebar-widget">
                        <h3>Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn" onClick={() => setShowExportModal(true)}>
                                <span>📥</span> Export to CSV
                            </button>
                            <button className="quick-link-btn">
                                <span>📊</span> Spending Report
                            </button>
                            <button className="quick-link-btn">
                                <span>🔔</span> Set Budget Alerts
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '400px', padding: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51', marginBottom: '8px' }}>Export Transactions</h2>
                        <p style={{ color: '#64748b', marginBottom: '20px' }}>Download {filteredTransactions.length} transactions as CSV</p>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Export includes:</div>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px' }}>
                                <li>Date, Description, Category</li>
                                <li>Account, Amount</li>
                            </ul>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowExportModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleExport} style={{ padding: '10px 20px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>📥 Download CSV</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Detail Modal */}
            {showDetailModal && selectedTx && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '420px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Transaction Details</h2>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ fontSize: '40px', fontWeight: 700, color: selectedTx.amount >= 0 ? '#22c55e' : '#ef4444' }}>
                                    {selectedTx.amount >= 0 ? '+' : ''}${selectedTx.amount.toLocaleString()}
                                </div>
                                <div style={{ color: '#64748b', marginTop: '4px' }}>{selectedTx.description}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Date</div><div style={{ fontWeight: 500 }}>{selectedTx.date}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Category</div><div style={{ fontWeight: 500 }}>{selectedTx.category}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Account</div><div style={{ fontWeight: 500 }}>{selectedTx.account}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Type</div><div style={{ fontWeight: 500, color: selectedTx.amount >= 0 ? '#22c55e' : '#ef4444' }}>{selectedTx.amount >= 0 ? 'Income' : 'Expense'}</div></div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                            <button onClick={() => setShowDetailModal(false)} style={{ width: '100%', padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
