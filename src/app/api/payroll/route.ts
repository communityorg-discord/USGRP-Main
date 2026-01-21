import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getPayslips } from '@/lib/api';

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const payrollRes = await getPayslips(userId);
        return NextResponse.json({
            payslips: payrollRes?.payslips || [],
            job: payrollRes?.job || null
        });
    } catch (error) {
        console.error('[API/Payroll] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
