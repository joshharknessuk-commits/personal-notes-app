import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { day } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    let record = await db.select().from(day).where(eq(day.date, todayDate)).get();

    if (!record) {
      const newRecord = {
        id: crypto.randomUUID(),
        date: todayDate,
        build: '',
        train: '',
        study: '',
        reflection: '',
        updatedAt: new Date(),
      };

      await db.insert(day).values(newRecord);
      record = newRecord;
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error fetching day:', error);
    return NextResponse.json({ error: 'Failed to fetch day' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { field, value, lock } = body;

    const todayDate = getTodayDate();

    let record = await db.select().from(day).where(eq(day.date, todayDate)).get();

    if (!record) {
      const newRecord = {
        id: crypto.randomUUID(),
        date: todayDate,
        build: '',
        train: '',
        study: '',
        reflection: '',
        [field]: value,
        updatedAt: new Date(),
      };

      await db.insert(day).values(newRecord);
      return NextResponse.json(newRecord);
    }

    // Don't allow updates if locked
    if (record.isLocked && !lock) {
      return NextResponse.json(record);
    }

    const updateData: any = { updatedAt: new Date() };

    if (lock) {
      updateData.isLocked = true;
      updateData.completedAt = new Date();
    } else if (field) {
      updateData[field] = value;
    }

    await db.update(day)
      .set(updateData)
      .where(eq(day.date, todayDate));

    const updated = await db.select().from(day).where(eq(day.date, todayDate)).get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating day:', error);
    return NextResponse.json({ error: 'Failed to update day' }, { status: 500 });
  }
}
