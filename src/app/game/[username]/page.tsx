'use client';

import { useState, useEffect } from 'react';
import WheelComponent from '@/app/components/WheelComponent';
import React from 'react';

const outcomes = ['Double', 'Keep', 'Bankrupt!'];
const colors = ['#16a34a', '#2563eb', '#dc2626'];

const wheelData = Array(12)
  .fill(null)
  .map((_, i) => ({
    option: outcomes[i % outcomes.length],
    style: { backgroundColor: colors[i % colors.length], textColor: 'white' },
  }));

export default function Game({ params }: { params: Promise<{ username: string }> }) {
  const [username, setUsername] = useState<string | null>(null);
  const [money, setMoney] = useState(0);
  const [bet, setBet] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (username) {
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
        .then((res) => res.json())
        .then((data) => setMoney(data.money));
    }
  }, [username]);

  const handleRoll = async () => {
    if (!username) return;
    const betAmount = parseInt(bet);
    if (!betAmount || betAmount <= 0 || betAmount > money) return;

    const res = await fetch('/api/roll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, bet: betAmount }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    const matchingIndices = wheelData
      .map((d, i) => (d.option === data.result ? i : -1))
      .filter((i) => i !== -1);

    const randomIndex =
      matchingIndices[Math.floor(Math.random() * matchingIndices.length)];

    setPrizeIndex(randomIndex);
    setResult(null);
    setMustSpin(true);
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    setResult(wheelData[prizeIndex].option);

    if (username) {
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
        .then((res) => res.json())
        .then((data) => setMoney(data.money));
    }

    setBet('');
  };

  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl p-6 sm:p-8 flex flex-col gap-6 overflow-visible">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome, {username}!</h1>
          <p className="text-gray-300 text-lg">
            Balance: <span className="font-semibold text-green-400">${money}</span>
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center gap-6">
          <div
            className={`w-full max-w-xs transition-all duration-500 ease-in-out z-10 ${
              mustSpin ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            <input
              type="number"
              min="1"
              max={money}
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              placeholder="Enter bet amount"
              className="mb-4 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              disabled={mustSpin}
            />
            <button
              onClick={handleRoll}
              disabled={!bet || parseInt(bet) > money || mustSpin}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg px-4 py-3 w-full transition-colors duration-200"
            >
              Spin the Wheel
            </button>
          </div>

          {result && !mustSpin && (
            <p className="text-green-400 mt-2 font-bold text-xl animate-pulse">{`Result: ${result}`}</p>
          )}

          <div
            className={`w-full max-w-[500px] sm:max-w-[600px] aspect-square transition-all duration-500 ease-in-out ${
              mustSpin ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <WheelComponent
              mustSpin={mustSpin}
              prizeIndex={prizeIndex}
              onStopSpinning={onStopSpinning}
              data={wheelData}
            />
          </div>
        </div>

        <div className="text-center"></div>
      </div>
    </div>
  );
}