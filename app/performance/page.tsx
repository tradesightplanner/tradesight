// app/performance/page.tsx
'use client';
import React from 'react';
import PerformanceChart from '../components/charts/PerformanceChart';

export default function PerformancePage() {
  const labels = ['2025-10-14','2025-10-15','2025-10-16','2025-10-17','2025-10-18'];
  const data = [100, 300, 200, 450, 390];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Performance</h2>
      <div className="bg-panel p-6 rounded-2xl">
        <PerformanceChart labels={labels} data={data} />
      </div>
    </div>
  );
}
