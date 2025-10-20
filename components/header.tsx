// components/Header.tsx
import React from "react";

export default function Header() {
  return (
    <header className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-extrabold">TradeSight</h1>
        <span className="text-sm text-muted">Trading performance tracker</span>
      </div>
      <nav className="flex gap-3">
        <a href="/trade/new" className="px-3 py-2 bg-gray-800 rounded">New Trade</a>
        <a href="/performance" className="px-3 py-2 bg-indigo-600 rounded">Performance</a>
      </nav>
    </header>
  );
}
