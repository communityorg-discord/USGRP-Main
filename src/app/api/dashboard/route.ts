import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCitizen, getAccounts, getTransactions, getCredit, getLoans, getFines, getHousing, checkApiHealth } from '@/lib/api';

export async function GET() {
    // Get the authenticated user
    const session = await auth();
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({
            citizen: null,
            accounts: [],
            transactions: [],
            credit: { score: 650, band: 'Fair' },
            loans: [],
            fines: [],
            warrants: [],
            housing: null,
            apiConnected: false,
            error: 'Not authenticated'
        }, { status: 401 });
    }

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
            getCitizen(userId).catch(() => null),
            getAccounts(userId).catch(() => null),
            getTransactions(userId, 10).catch(() => null),
            getCredit(userId).catch(() => null),
            getLoans(userId).catch(() => null),
            getFines(userId).catch(() => null),
            getHousing(userId).catch(() => null),
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
