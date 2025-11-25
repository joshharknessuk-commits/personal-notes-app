'use client';

import { useEffect, useState, useRef } from 'react';

type DayData = {
  id: string;
  date: string;
  build: string;
  train: string;
  study: string;
  reflection: string;
  isLocked?: boolean;
  completedAt?: Date | null;
};

export default function Home() {
  const [data, setData] = useState<DayData>({
    id: '',
    date: '',
    build: '',
    train: '',
    study: '',
    reflection: '',
    isLocked: false,
  });

  const [previous, setPrevious] = useState<DayData[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  const buildRef = useRef<HTMLInputElement>(null);
  const trainRef = useRef<HTMLInputElement>(null);
  const studyRef = useRef<HTMLInputElement>(null);
  const reflectionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/day')
      .then((res) => res.json())
      .then((day) => {
        setData(day);
        if (day.completedAt) {
          const time = new Date(day.completedAt);
          const hours = time.getHours();
          const minutes = String(time.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'pm' : 'am';
          const displayHours = hours % 12 || 12;
          setCompletionTime(`${displayHours}:${minutes}${ampm}`);
        }
      });

    fetch('/api/previous')
      .then((res) => res.json())
      .then((days) => setPrevious(days));

    fetch('/api/streak')
      .then((res) => res.json())
      .then((data) => setStreak(data.streak));
  }, []);

  const handleChange = async (field: keyof DayData, value: string) => {
    if (data.isLocked) return;

    setData((prev) => ({ ...prev, [field]: value }));

    await fetch('/api/day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement> | null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      } else {
        handleDone();
      }
    }
  };

  const handleDone = async () => {
    if (data.isLocked) return;

    reflectionRef.current?.blur();

    const response = await fetch('/api/day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lock: true }),
    });

    const updated = await response.json();
    setData(updated);

    if (updated.completedAt) {
      const time = new Date(updated.completedAt);
      const hours = time.getHours();
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      setCompletionTime(`${displayHours}:${minutes}${ampm}`);
    }

    // Refresh streak
    fetch('/api/streak')
      .then((res) => res.json())
      .then((data) => setStreak(data.streak));

    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 2000);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white py-16 relative">
      {/* Breathing cue */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-300 animate-pulse"
           style={{ animationDuration: '4s' }} />

      {/* Streak counter */}
      {streak > 0 && (
        <div className="fixed top-8 right-8 text-sm text-gray-400">
          {streak}
        </div>
      )}

      <div className="w-full max-w-[480px] px-4">
        <div className="text-sm text-gray-400 mb-16 text-center">today</div>

        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${data.build ? 'bg-gray-300' : 'bg-gray-100'}`} />
            <input
              ref={buildRef}
              type="text"
              value={data.build}
              onChange={(e) => handleChange('build', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, trainRef)}
              placeholder="built…"
              disabled={data.isLocked}
              className="flex-1 border border-gray-200 rounded-md py-3 px-4 text-lg text-black/80 placeholder:text-gray-400/40 focus:outline-none focus:border-gray-300 bg-gray-50/30 disabled:opacity-100 disabled:cursor-default"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${data.train ? 'bg-gray-300' : 'bg-gray-100'}`} />
            <input
              ref={trainRef}
              type="text"
              value={data.train}
              onChange={(e) => handleChange('train', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, studyRef)}
              placeholder="trained…"
              disabled={data.isLocked}
              className="flex-1 border border-gray-200 rounded-md py-3 px-4 text-lg text-black/80 placeholder:text-gray-400/40 focus:outline-none focus:border-gray-300 bg-gray-50/30 disabled:opacity-100 disabled:cursor-default"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${data.study ? 'bg-gray-300' : 'bg-gray-100'}`} />
            <input
              ref={studyRef}
              type="text"
              value={data.study}
              onChange={(e) => handleChange('study', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, reflectionRef)}
              placeholder="learned…"
              disabled={data.isLocked}
              className="flex-1 border border-gray-200 rounded-md py-3 px-4 text-lg text-black/80 placeholder:text-gray-400/40 focus:outline-none focus:border-gray-300 bg-gray-50/30 disabled:opacity-100 disabled:cursor-default"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${data.reflection ? 'bg-gray-300' : 'bg-gray-100'}`} />
            <input
              ref={reflectionRef}
              type="text"
              value={data.reflection}
              onChange={(e) => handleChange('reflection', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, null)}
              placeholder="felt…"
              disabled={data.isLocked}
              className="flex-1 border border-gray-200 rounded-md py-3 px-4 text-lg text-black/80 placeholder:text-gray-400/40 focus:outline-none focus:border-gray-300 bg-gray-50/30 disabled:opacity-100 disabled:cursor-default"
            />
          </div>

          {!data.isLocked && (
            <button
              onClick={handleDone}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              done
            </button>
          )}

          {completionTime && (
            <div className="text-center text-xs text-gray-400/60 pt-4">
              {completionTime}
            </div>
          )}
        </div>

        {previous.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            {previous.map((day) => (
              <div key={day.id} className="mb-8 text-xs text-gray-400 space-y-2">
                {day.build && <div>built: {day.build}</div>}
                {day.train && <div>trained: {day.train}</div>}
                {day.study && <div>learned: {day.study}</div>}
                {day.reflection && <div>felt: {day.reflection}</div>}
              </div>
            ))}
          </div>
        )}

        {showConfirm && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 text-sm text-gray-400">
            saved
          </div>
        )}
      </div>
    </main>
  );
}
