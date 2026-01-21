// Mock economy data
const mockEconomyData = {
    overview: {
        totalMoney: 15847250,
        treasuryBalance: 52340000,
        circulatingMoney: 15847250,
        inflationRate: 2.4,
    },
    distribution: [
        { bracket: '$0 - $1,000', citizens: 156, percentage: 12.5 },
        { bracket: '$1,001 - $10,000', citizens: 423, percentage: 33.9 },
        { bracket: '$10,001 - $50,000', citizens: 398, percentage: 31.9 },
        { bracket: '$50,001 - $100,000', citizens: 178, percentage: 14.3 },
        { bracket: '$100,001 - $500,000', citizens: 67, percentage: 5.4 },
        { bracket: '$500,001+', citizens: 25, percentage: 2.0 },
    ],
    dailyFlow: [
        { day: 'Mon', inflow: 245000, outflow: 198000 },
        { day: 'Tue', inflow: 312000, outflow: 287000 },
        { day: 'Wed', inflow: 289000, outflow: 245000 },
        { day: 'Thu', inflow: 334000, outflow: 312000 },
        { day: 'Fri', inflow: 456000, outflow: 389000 },
        { day: 'Sat', inflow: 178000, outflow: 234000 },
        { day: 'Sun', inflow: 145000, outflow: 167000 },
    ],
    topSectors: [
        { name: 'Government Payroll', volume: 4520000, percentage: 28.5 },
        { name: 'Business Sales', volume: 3890000, percentage: 24.5 },
        { name: 'Citizen Transfers', volume: 2450000, percentage: 15.5 },
        { name: 'Gambling', volume: 1890000, percentage: 11.9 },
        { name: 'Loans & Interest', volume: 1560000, percentage: 9.8 },
        { name: 'Other', volume: 1537250, percentage: 9.7 },
    ],
};

export default function AdminEconomyPage() {
    const { overview, distribution, dailyFlow, topSectors } = mockEconomyData;

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Economy Dashboard</h1>
                <p className="admin-page-subtitle">Macro-economic indicators and money flow analysis</p>
            </div>

            {/* Overview Stats */}
            <div className="admin-grid admin-grid-4" style={{ marginBottom: '24px' }}>
                <div className="admin-card">
                    <div className="admin-card-title">Total Money Supply</div>
                    <div className="admin-stat-value">${(overview.totalMoney / 1000000).toFixed(1)}M</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Treasury Balance</div>
                    <div className="admin-stat-value" style={{ color: '#fdb81e' }}>
                        ${(overview.treasuryBalance / 1000000).toFixed(1)}M
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Circulating Money</div>
                    <div className="admin-stat-value">${(overview.circulatingMoney / 1000000).toFixed(1)}M</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Inflation Rate</div>
                    <div className="admin-stat-value" style={{ color: overview.inflationRate > 3 ? '#ef4444' : '#22c55e' }}>
                        {overview.inflationRate}%
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="admin-grid admin-grid-2" style={{ marginBottom: '24px' }}>
                {/* Wealth Distribution */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Wealth Distribution</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {distribution.map((bracket) => (
                            <div key={bracket.bracket}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px' }}>{bracket.bracket}</span>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                                        {bracket.citizens} citizens ({bracket.percentage}%)
                                    </span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${bracket.percentage}%`,
                                        background: 'linear-gradient(90deg, #205493 0%, #22c55e 100%)',
                                        borderRadius: '4px',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Economic Sectors */}
                <div className="admin-card">
                    <h2 className="admin-section-title">Economic Sectors</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Sector</th>
                                <th>Volume</th>
                                <th>Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSectors.map((sector) => (
                                <tr key={sector.name}>
                                    <td style={{ fontWeight: 500 }}>{sector.name}</td>
                                    <td style={{ fontWeight: 600 }}>${(sector.volume / 1000000).toFixed(2)}M</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '60px',
                                                height: '6px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '3px',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${sector.percentage * 3}%`,
                                                    background: '#fdb81e',
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{sector.percentage}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Daily Money Flow */}
            <div className="admin-card">
                <h2 className="admin-section-title">Weekly Money Flow</h2>
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                    {dailyFlow.map((day) => (
                        <div key={day.day} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <div style={{
                                    width: '30px',
                                    height: `${(day.inflow / 5000)}px`,
                                    background: '#22c55e',
                                    borderRadius: '4px 4px 0 0',
                                }} />
                                <div style={{
                                    width: '30px',
                                    height: `${(day.outflow / 5000)}px`,
                                    background: '#ef4444',
                                    borderRadius: '0 0 4px 4px',
                                }} />
                            </div>
                            <div style={{ marginTop: '8px', fontWeight: 600 }}>{day.day}</div>
                            <div style={{ fontSize: '11px', color: '#22c55e' }}>+${(day.inflow / 1000).toFixed(0)}K</div>
                            <div style={{ fontSize: '11px', color: '#ef4444' }}>-${(day.outflow / 1000).toFixed(0)}K</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '2px' }} />
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Inflow</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }} />
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Outflow</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
