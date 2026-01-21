import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getLoans, getCredit } from '@/lib/api';

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const [loansRes, creditRes] = await Promise.all([
            getLoans(userId),
            getCredit(userId)
        ]);

        return NextResponse.json({
            loans: loansRes?.loans || [],
            credit: creditRes?.credit || { score: 650, band: 'Fair' }
        });
    } catch (error) {
        console.error('[API/Loans] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
