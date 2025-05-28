'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<{ username: string; money: number }[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <div className="bg-[var(--surface)] p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
        <ul className="mb-4">
          {leaderboard.map((user, index) => (
            <li key={user.username} className="mb-2 text-[var(--muted)]">
              <span className="font-medium text-[var(--foreground)]">{index + 1}. {user.username}</span>: ${user.money}
            </li>
          ))}
        </ul>
        <Link href="/" className="block text-center text-[var(--accent)] hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
