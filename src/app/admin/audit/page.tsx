'use client';

import { useState } from 'react';

// Mock audit log data
const mockAuditLogs = [
    { id: 1, timestamp: '2026-01-20 14:32:15', action: 'CITIZEN_REGISTER', actor: 'System', target: 'USC-001892', details: 'New citizen registered via Discord OAuth', level: 'info' },
    { id: 2, timestamp: '2026-01-20 14:31:42', action: 'TRANSACTION_FLAGGED', actor: 'AutoMod', target: 'TXN-2026-00338', details: 'Large transaction $50,000 flagged for review', level: 'warning' },
    { id: 3, timestamp: '2026-01-20 14:30:08', action: 'LOAN_APPROVED', actor: 'Admin', target: 'LOAN-007', details: 'Housing loan $45,000 approved for USC-003456', level: 'success' },
    { id: 4, timestamp: '2026-01-20 14:28:55', action: 'CRIME_DETECTED', actor: 'CrimeBot', target: 'USC-004521', details: 'Attempted robbery at convenience store - FAILED', level: 'danger' },
    { id: 5, timestamp: '2026-01-20 14:27:30', action: 'PAYROLL_PROCESSED', actor: 'PayrollBot', target: 'FBI', details: 'Weekly payroll for 45 employees - $382,500', level: 'success' },
    { id: 6, timestamp: '2026-01-20 14:25:00', action: 'CITIZEN_SUSPENDED', actor: 'Admin', target: 'USC-009012', details: 'Account suspended for suspicious activity', level: 'warning' },
    { id: 7, timestamp: '2026-01-20 14:20:00', action: 'SYSTEM_BACKUP', actor: 'System', target: 'Database', details: 'Automatic backup completed successfully', level: 'info' },
    { id: 8, timestamp: '2026-01-20 14:15:00', action: 'LOAN_DEFAULT', actor: 'System', target: 'LOAN-006', details: 'Payday loan marked as default - USC-004521', level: 'danger' },
    { id: 9, timestamp: '2026-01-20 14:10:00', action: 'TAX_COLLECTED', actor: 'TreasuryBot', target: 'Treasury', details: 'Daily tax collection: $45,230', level: 'success' },
    { id: 10, timestamp: '2026-01-20 14:05:00', action: 'CITIZEN_PROMOTED', actor: 'Admin', target: 'USC-000089', details: 'Promoted to Mayor position', level: 'info' },
];

const levelColors: Record<string, string> = {
    info: '#64748b',
    success: '#22c55e',
    warning: '#fdb81e',
    danger: '#ef4444',
};

export default function AdminAuditPage() {
    const [levelFilter, setLevelFilter] = useState('all');
    const [actionFilter, setActionFilter] = useState('all');

    const filtered = mockAuditLogs.filter(log => {
        if (levelFilter !== 'all' && log.level !== levelFilter) return false;
        if (actionFilter !== 'all' && !log.action.includes(actionFilter)) return false;
        return true;
    });

    const actions = [...new Set(mockAuditLogs.map(l => l.action.split('_')[0]))];

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Audit Logs</h1>
                <p className="admin-page-subtitle">Complete system activity and change history</p>
            </div>

            {/* Stats */}
            <div className="admin-grid admin-grid-4" style={{ marginBottom: '24px' }}>
                <div className="admin-card">
                    <div className="admin-card-title">Total Events (24h)</div>
                    <div className="admin-stat-value">{mockAuditLogs.length}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Warnings</div>
                    <div className="admin-stat-value" style={{ color: '#fdb81e' }}>
                        {mockAuditLogs.filter(l => l.level === 'warning').length}
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Critical Events</div>
                    <div className="admin-stat-value" style={{ color: '#ef4444' }}>
                        {mockAuditLogs.filter(l => l.level === 'danger').length}
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Success Rate</div>
                    <div className="admin-stat-value" style={{ color: '#22c55e' }}>
                        {Math.round((mockAuditLogs.filter(l => l.level === 'success').length / mockAuditLogs.length) * 100)}%
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                        }}
                    >
                        <option value="all">All Levels</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="danger">Critical</option>
                    </select>
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                        }}
                    >
                        <option value="all">All Actions</option>
                        {actions.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="admin-search-input"
                        style={{ width: '250px' }}
                    />
                    <button style={{
                        marginLeft: 'auto',
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}>
                        📥 Export Logs
                    </button>
                </div>
            </div>

            {/* Log List */}
            <div className="admin-card">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filtered.map((log) => (
                        <div
                            key={log.id}
                            style={{
                                display: 'flex',
                                gap: '20px',
                                padding: '16px 20px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                borderLeft: `3px solid ${levelColors[log.level]}`,
                            }}
                        >
                            <div style={{ width: '160px', flexShrink: 0 }}>
                                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#64748b' }}>
                                    {log.timestamp}
                                </div>
                            </div>
                            <div style={{ width: '180px', flexShrink: 0 }}>
                                <span style={{
                                    padding: '4px 8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    fontFamily: 'monospace',
                                    color: levelColors[log.level],
                                }}>
                                    {log.action}
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{log.details}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    Actor: <span style={{ color: '#94a3b8' }}>{log.actor}</span>
                                    {' • '}
                                    Target: <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{log.target}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`admin-badge ${log.level === 'success' ? 'success' :
                                        log.level === 'warning' ? 'warning' :
                                            log.level === 'danger' ? 'danger' : 'success'
                                    }`} style={{ background: log.level === 'info' ? 'rgba(100,116,139,0.1)' : undefined }}>
                                    {log.level}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
