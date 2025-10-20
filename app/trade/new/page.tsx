// app/trade/new/page.tsx
'use client';
import React, { useRef, useState } from 'react';
import TradeModal from '../../../components/TradeModal';

export default function NewTradePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [parsed, setParsed] = useState<any>(null);
  const [open, setOpen] = useState(false);

  async function uploadAndParse(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('image', f);
    const res = await fetch('/trade/api/parse-screenshot', { method: 'POST', body: fd });
    const json = await res.json();
    if (json.parsed) {
      setParsed(json.parsed);
      setOpen(true);
    } else {
      alert('Failed to parse screenshot');
    }
  }

  return (
    <div className="p-6">
      <div className="bg-panel p-6 rounded-2xl">
        <h2 className="font-bold mb-3">Upload TradingView screenshot</h2>
        <input ref={fileRef} type="file" accept="image/*" onChange={uploadAndParse} />
      </div>

      <TradeModal open={open} onClose={() => setOpen(false)} initial={parsed} />
    </div>
  );
}
