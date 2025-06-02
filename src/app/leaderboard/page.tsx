'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<{ username: string; money: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
        <div className="text-center">
          <div className="text-lg font-semibold animate-pulse">Loading Leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-white">Leaderboard</h1>
        <ul className="mb-4">
          {leaderboard.map((user, index) => (
            <li key={user.username} className="mb-2 text-gray-300">
              <span className="font-medium text-white">
                {index + 1}. {user.username}
              </span>: ${user.money}
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="block text-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
