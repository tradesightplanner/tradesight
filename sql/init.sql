create extension if not exists pgcrypto;

create table trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  trade_date date not null,
  ticker text not null,
  side text check (side in ('long','short')),
  timeframe text,
  entry numeric,
  exit numeric,
  stop_loss numeric,
  size numeric,
  pnl numeric,
  r_multiple numeric,
  notes text,
  tags text[],
  image_url text
);

create table user_settings (
  user_id uuid primary key references auth.users(id),
  default_currency text default 'USD',
  default_timeframes text[] default array['1m','5m','15m','1H','4H','1D'],
  custom_fields jsonb default '{}'::jsonb,
  is_paid boolean default false,
  created_at timestamptz default now()
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  stripe_payment_id text,
  product text,
  amount integer,
  currency text,
  created_at timestamptz default now()
);

alter table trades enable row level security;
create policy "select own trades" on trades for select using (auth.uid() = user_id);
create policy "insert own trades" on trades for insert with check (auth.uid() = user_id);
create policy "update own trades" on trades for update using (auth.uid() = user_id);
create policy "delete own trades" on trades for delete using (auth.uid() = user_id);

alter table user_settings enable row level security;
create policy "users manage settings" on user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
