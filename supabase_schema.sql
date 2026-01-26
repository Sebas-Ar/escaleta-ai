-- Enable the UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create the 'news' table
create table public.news (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  priority int default 9999, -- Default to high number so it goes to bottom if not set
  journalist_phone text,
  estimated_duration text
);

-- Enable Row Level Security (RLS)
alter table public.news enable row level security;

-- Policy to allow all operations (SELECT, INSERT, UPDATE, DELETE) for now
-- In production, you would restrict this to authenticated users
create policy "Enable all access for all users"
on public.news
for all
using (true)
with check (true);

-- Enable Realtime for the 'news' table
alter publication supabase_realtime add table public.news;

-- Insert some dummy data for testing
insert into public.news (title, content, status, journalist_phone, estimated_duration, priority, created_at)
values
  ('Incendio en el Centro', 'Se reporta un incendio structural en la calle 45 con carrera 12. Bomberos en camino.', 'pending', '+573001234567', '45s', 9999, now()),
  ('Tráfico pesado en la Norte', 'Gran congestión vehicular en la Autopista Norte sentido Sur-Norte debido a un accidente leve.', 'pending', '+573109876543', '30s', 9999, now() - interval '10 minutes'),
  ('Inauguración Biblioteca', 'El alcalde inauguró hoy la nueva biblioteca pública del barrio San Javier.', 'approved', '+573204567890', '1m 20s', 1, now() - interval '1 hour'),
  ('Entrevista Gobernador', 'Resumen de las declaraciones del gobernador sobre el nuevo plan de desarrollo.', 'approved', '+573001112233', '2m', 2, now() - interval '2 hours');
