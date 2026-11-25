-- Esquema inicial para la futura conexión de la demo con Supabase.
create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stage text,
  price_clp integer not null check (price_clp >= 0),
  sizes text[] not null default '{}',
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  address text,
  dog_name text,
  dog_breed text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'dispatched', 'delivered', 'cancelled')),
  total_clp integer not null check (total_clp >= 0),
  delivered_at timestamptz,
  estimated_duration_days integer not null default 28 check (estimated_duration_days > 0),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price_clp integer not null check (unit_price_clp >= 0)
);

create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'dismissed')),
  contacted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Al confirmar una entrega, la aplicación debe crear el seguimiento al 75%
-- de la duración estimada. Ejemplo: 28 días => aviso al día 21.
create index if not exists follow_ups_due_status_idx on follow_ups (status, due_at);
