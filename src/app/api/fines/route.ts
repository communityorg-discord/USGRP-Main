import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getFines } from '@/lib/api';

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const finesRes = await getFines(userId);
        return NextResponse.json({
            fines: finesRes?.fines || [],
            debts: finesRes?.debts || [],
            warrants: finesRes?.warrants || []
        });
    } catch (error) {
        console.error('[API/Fines] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
