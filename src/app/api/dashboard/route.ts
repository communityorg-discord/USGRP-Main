import { NextResponse } from 'next/server';
import { getCitizen, getAccounts, getTransactions, getCredit, getLoans, getFines, getHousing, checkApiHealth } from '@/lib/api';

// Dev user ID - replace with session user once auth is added
const DEV_USER_ID = process.env.DEV_USER_ID || '723199054514749450';

export async function GET() {
    // Check if API is available
    const apiHealthy = await checkApiHealth();

    if (!apiHealthy) {
        return NextResponse.json({
            citizen: null,
            accounts: [],
            transactions: [],
            credit: { score: 650, band: 'Fair' },
            loans: [],
            fines: [],
            warrants: [],
            housing: null,
            apiConnected: false
        });
    }

    try {
        const [citizenRes, accountsRes, txRes, creditRes, loansRes, finesRes, housingRes] = await Promise.all([
            getCitizen(DEV_USER_ID).catch(() => null),
            getAccounts(DEV_USER_ID).catch(() => null),
            getTransactions(DEV_USER_ID, 10).catch(() => null),
            getCredit(DEV_USER_ID).catch(() => null),
            getLoans(DEV_USER_ID).catch(() => null),
            getFines(DEV_USER_ID).catch(() => null),
            getHousing(DEV_USER_ID).catch(() => null),
        ]);

        return NextResponse.json({
            citizen: citizenRes?.citizen || null,
            accounts: accountsRes?.accounts || [],
            transactions: txRes?.transactions || [],
            credit: creditRes?.credit || { score: 650, band: 'Fair' },
            loans: loansRes?.loans || [],
            fines: finesRes?.fines || [],
            debts: finesRes?.debts || [],
            warrants: finesRes?.warrants || [],
            housing: housingRes?.housing || null,
            apiConnected: !!citizenRes?.citizen
        });
    } catch (error) {
        console.error('[API/Dashboard] Error:', error);
        return NextResponse.json({
            citizen: null,
            accounts: [],
            transactions: [],
            credit: { score: 650, band: 'Fair' },
            loans: [],
            fines: [],
            debts: [],
            warrants: [],
            housing: null,
            apiConnected: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}
