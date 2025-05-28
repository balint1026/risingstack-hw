'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      router.push(`/game/${username}`);
    } else {
      alert('Something went wrong');
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
  <div className="bg-[var(--surface)] p-6 rounded shadow-md">
    <h1 className="text-2xl mb-4">Pick a Username</h1>
    <p className="mb-4 text-[var(--muted)]">Enter a username to start or continue your game.</p>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-[var(--muted)] bg-transparent text-[var(--foreground)] p-2 w-full mb-4 placeholder-[var(--muted)]"
        placeholder="Your username"
      />
      <button
        type="submit"
        className="bg-[var(--accent)] text-white p-2 rounded w-full hover:bg-blue-600"
        disabled={!username}
      >
        Start Game
      </button>
    </form>
  </div>
</div>

  );
}