// app/page.tsx
'use client';
import React, { useState } from 'react';
import TradeModal from '../components/TradeModal';
import PerformanceChart from '../components/charts/PerformanceChart';

export default function HomePage() {
  const [open, setOpen] = useState(false);
  // placeholder sample data; real app should query Supabase
  const labels = ['2025-10-14','2025-10-15','2025-10-16','2025-10-17','2025-10-18'];
  const data = [100, 300, 200, 450, 390];

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-8 bg-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Overview</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 rounded" onClick={() => setOpen(true)}>New trade</button>
              <a href="/trade/new" className="px-4 py-2 bg-gray-800 rounded">Upload screenshot</a>
            </div>
          </div>

          <div className="h-64 bg-gradient-to-r from-neutral-800 to-neutral850 rounded-xl mb-6">
            <PerformanceChart labels={labels} data={data}/>
          </div>

        </section>

        <aside className="col-span-4 bg-panel rounded-2xl p-6">
          <div className="text-sm text-muted">Today</div>
          <div className="text-2xl font-bold text-lime-400">+$210</div>
        </aside>
      </div>

      <TradeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
