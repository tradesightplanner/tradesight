// components/TradeModal.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = { open: boolean; onClose: () => void; initial?: any };

export default function TradeModal({ open, onClose, initial = null }: Props) {
  const [form, setForm] = useState({
    trade_date: new Date().toISOString().slice(0, 10),
    ticker: '',
    side: 'long',
    timeframe: '',
    entry: '',
    exit: '',
    stop_loss: '',
    size: '',
    notes: ''
  });

  useEffect(() => {
    if (initial) {
      setForm(prev => ({ ...prev, ...initial, trade_date: prev.trade_date }));
    }
  }, [initial]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Please sign in');

    const payload = {
      user_id: user.id,
      trade_date: form.trade_date,
      ticker: form.ticker,
      side: form.side,
      timeframe: form.timeframe,
      entry: form.entry || null,
      exit: form.exit || null,
      stop_loss: form.stop_loss || null,
      size: form.size || null,
      notes: form.notes || null
    };

    const { error } = await supabase.from('trades').insert([payload]);
    if (error) return alert('Save failed: ' + error.message);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-11/12 max-w-2xl bg-neutral-900 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">New Trade</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <form onSubmit={save} className="mt-4 grid grid-cols-2 gap-4">
          <input value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} placeholder="Ticker" className="p-2 bg-neutral-800 rounded" />
          <select value={form.side} onChange={e => setForm({ ...form, side: e.target.value })} className="p-2 bg-neutral-800 rounded">
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
          <input type="date" value={form.trade_date} onChange={e => setForm({ ...form, trade_date: e.target.value })} className="p-2 bg-neutral-800 rounded" />
          <input value={form.timeframe} onChange={e => setForm({ ...form, timeframe: e.target.value })} placeholder="Timeframe (e.g. 1H)" className="p-2 bg-neutral-800 rounded" />
          <input value={form.entry} onChange={e => setForm({ ...form, entry: e.target.value })} placeholder="Entry" className="p-2 bg-neutral-800 rounded" />
          <input value={form.exit} onChange={e => setForm({ ...form, exit: e.target.value })} placeholder="Exit" className="p-2 bg-neutral-800 rounded" />
          <input value={form.stop_loss} onChange={e => setForm({ ...form, stop_loss: e.target.value })} placeholder="Stop Loss" className="p-2 bg-neutral-800 rounded" />
          <input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="Size" className="p-2 bg-neutral-800 rounded" />
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="col-span-2 p-2 bg-neutral-800 rounded"></textarea>
        </form>
        <div className="mt-4 text-right">
          <button onClick={save} className="px-4 py-2 bg-indigo-600 rounded">Save trade</button>
        </div>
      </div>
    </div>
  );
}
