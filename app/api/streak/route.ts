import { NextResponse } from 'next/server';
import { db } from '@/db';
import { day } from '@/db/schema';
import { desc, isNotNull } from 'drizzle-orm';

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dayNum = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayNum}`;
}

function getPreviousDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayNum = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayNum}`;
}

export async function GET() {
  try {
    const todayDate = getTodayDate();

    // Get all completed days ordered by date descending
    const completedDays = await db
      .select()
      .from(day)
      .where(isNotNull(day.completedAt))
      .orderBy(desc(day.date));

    let streak = 0;
    let currentDate = todayDate;

    // Count consecutive days backwards from today
    for (const completedDay of completedDays) {
      if (completedDay.date === currentDate) {
        streak++;
        currentDate = getPreviousDate(currentDate);
      } else {
        break;
      }
    }

    return NextResponse.json({ streak });
  } catch (error) {
    console.error('Error calculating streak:', error);
    return NextResponse.json({ error: 'Failed to calculate streak' }, { status: 500 });
  }
}
