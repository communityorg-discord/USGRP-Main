// Mock data for admin dashboard
const mockAdminData = {
    stats: {
        totalCitizens: 1247,
        citizensChange: 12,
        totalBalance: 15847250,
        balanceChange: 524000,
        activeLoans: 89,
        loansChange: -3,
        dailyTransactions: 342,
        txChange: 28,
    },
    recentTransactions: [
        { id: 'TXN-001', citizen: 'John Doe', citizenId: 'USC-001234', type: 'Salary', amount: 8500, time: '2 min ago', status: 'completed' },
        { id: 'TXN-002', citizen: 'Jane Smith', citizenId: 'USC-005678', type: 'Purchase', amount: -1250, time: '5 min ago', status: 'completed' },
        { id: 'TXN-003', citizen: 'Bob Wilson', citizenId: 'USC-009012', type: 'Transfer', amount: 5000, time: '8 min ago', status: 'pending' },
        { id: 'TXN-004', citizen: 'Alice Brown', citizenId: 'USC-003456', type: 'Loan Payment', amount: -950, time: '12 min ago', status: 'completed' },
        { id: 'TXN-005', citizen: 'Charlie Davis', citizenId: 'USC-007890', type: 'Tax Refund', amount: 2340, time: '15 min ago', status: 'completed' },
    ],
    topCitizens: [
        { rank: 1, name: 'Treasury Secretary', citizenId: 'USC-000001', balance: 2450000, change: 12.5 },
        { rank: 2, name: 'Attorney General', citizenId: 'USC-000002', balance: 1890000, change: -2.3 },
        { rank: 3, name: 'Senator Williams', citizenId: 'USC-000015', balance: 1245000, change: 8.7 },
        { rank: 4, name: 'FBI Director', citizenId: 'USC-000003', balance: 985000, change: 4.2 },
        { rank: 5, name: 'Mayor Johnson', citizenId: 'USC-000089', balance: 756000, change: -1.1 },
    ],
    systemStatus: [
        { name: 'Database', status: 'operational', latency: '12ms' },
        { name: 'Discord Bot', status: 'operational', latency: '45ms' },
        { name: 'Auth Service', status: 'operational', latency: '23ms' },
        { name: 'Backup System', status: 'maintenance', latency: '--' },
    ],
    recentActivity: [
        { time: '14:32:15', action: 'Citizen registered', details: 'New citizen USC-001892', level: 'info' },
        { time: '14:31:42', action: 'Large transaction', details: '$50,000 transfer flagged', level: 'warning' },
        { time: '14:30:08', action: 'Loan approved', details: 'Housing loan $45,000', level: 'success' },
        { time: '14:28:55', action: 'Crime detected', details: 'Attempted robbery - USC-004521', level: 'danger' },
        { time: '14:27:30', action: 'Payroll processed', details: 'FBI weekly payroll complete', level: 'success' },
    ],
};

export default function AdminDashboard() {
    const { stats, recentTransactions, topCitizens, systemStatus, recentActivity } = mockAdminData;

    return (
        <div>
            {/* Page Header */}
            <div className="admin-page-header">
                <h1 className="admin-page-title">System Overview</h1>
                <p className="admin-page-subtitle">Real-time monitoring of USGRP economy and citizen activity</p>
            </div>

            {/* Stats Grid */}
            <div className="admin-grid admin-grid-4" style={{ marginBottom: '32px' }}>
                <div className="admin-card">
                    <div className="admin-card-title">Total Citizens</div>
                    <div className="admin-stat-value">{stats.totalCitizens.toLocaleString()}</div>
                    <div className="admin-stat-change up">↑ +{stats.citizensChange} this week</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Total Economy Balance</div>
                    <div className="admin-stat-value">${(stats.totalBalance / 1000000).toFixed(1)}M</div>
                    <div className="admin-stat-change up">↑ +${(stats.balanceChange / 1000).toFixed(0)}K this week</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Active Loans</div>
                    <div className="admin-stat-value">{stats.activeLoans}</div>
                    <div className="admin-stat-change down">↓ {stats.loansChange} this week</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Daily Transactions</div>
                    <div className="admin-stat-value">{stats.dailyTransactions}</div>
                    <div className="admin-stat-change up">↑ +{stats.txChange} vs yesterday</div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="admin-grid admin-grid-2" style={{ marginBottom: '32px' }}>
                {/* Recent Transactions */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-section-title">Live Transactions</h2>
                        <span style={{ fontSize: '12px', color: '#22c55e' }}>● Live</span>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Citizen</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{tx.citizen}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{tx.citizenId}</div>
                                    </td>
                                    <td>{tx.type}</td>
                                    <td style={{
                                        fontWeight: 600,
                                        color: tx.amount >= 0 ? '#22c55e' : '#ef4444'
                                    }}>
                                        {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${tx.status === 'completed' ? 'success' : 'warning'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Citizens */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-section-title">Wealthiest Citizens</h2>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Citizen</th>
                                <th>Balance</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCitizens.map((citizen) => (
                                <tr key={citizen.rank}>
                                    <td style={{ fontWeight: 700, color: '#fdb81e' }}>{citizen.rank}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{citizen.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{citizen.citizenId}</div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>${citizen.balance.toLocaleString()}</td>
                                    <td>
                                        <span className={`admin-stat-change ${citizen.change >= 0 ? 'up' : 'down'}`}>
                                            {citizen.change >= 0 ? '↑' : '↓'} {Math.abs(citizen.change)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="admin-grid admin-grid-2">
                {/* System Status */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-section-title">System Status</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {systemStatus.map((sys) => (
                            <div
                                key={sys.name}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: sys.status === 'operational' ? '#22c55e' : '#fdb81e',
                                    }}></span>
                                    <span style={{ fontWeight: 500 }}>{sys.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{sys.latency}</span>
                                    <span className={`admin-badge ${sys.status === 'operational' ? 'success' : 'warning'}`}>
                                        {sys.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-section-title">Activity Feed</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {recentActivity.map((activity, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '12px 16px',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    borderLeft: `3px solid ${activity.level === 'success' ? '#22c55e' :
                                            activity.level === 'warning' ? '#fdb81e' :
                                                activity.level === 'danger' ? '#ef4444' : '#64748b'
                                        }`,
                                }}
                            >
                                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                                    {activity.time}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{activity.action}</div>
                                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{activity.details}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
