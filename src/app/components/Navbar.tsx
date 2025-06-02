import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">Wheel of Fortune</div>
      <div className="space-x-6">
        <Link href="/" className="hover:text-gray-300 transition">Home</Link>
        <Link href="/leaderboard" className="hover:text-gray-300 transition">Leaderboard</Link>
      </div>
    </nav>
  );
}