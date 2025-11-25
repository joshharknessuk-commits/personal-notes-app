import { NextResponse } from 'next/server';
import { db } from '@/db';
import { day } from '@/db/schema';
import { lt, desc } from 'drizzle-orm';

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dayNum = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayNum}`;
}

export async function GET() {
  try {
    const todayDate = getTodayDate();

    const previousDays = await db
      .select()
      .from(day)
      .where(lt(day.date, todayDate))
      .orderBy(desc(day.date))
      .limit(5);

    return NextResponse.json(previousDays);
  } catch (error) {
    console.error('Error fetching previous days:', error);
    return NextResponse.json({ error: 'Failed to fetch previous days' }, { status: 500 });
  }
}
