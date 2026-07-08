-- Tabela única de leads dos 5 eventos presenciais (ciclo Apogeu · agosto/2026).
-- Projeto Supabase: ajokzpjguhfxxudteetr
-- Rodar no SQL Editor ANTES do deploy. Sem isso, o POST do modal retorna 401/404.
-- Padrão RLS insert-only para o papel anon (mesmo de dominando-o-mercado-de-palestras/leads.sql).

create table if not exists public.eventos_agosto_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  evento text not null,          -- propulsao-em-vendas | lideranca | oratoria | inteligencia-emocional | empreenday
  nome text not null,
  whatsapp text not null,
  origem text,                   -- 'lp-evento-<slug>'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_url text
);

alter table public.eventos_agosto_leads enable row level security;

-- Idempotente: recria a policy sem erro se já existir.
drop policy if exists "insert_anon_eventos_agosto" on public.eventos_agosto_leads;
create policy "insert_anon_eventos_agosto"
  on public.eventos_agosto_leads
  for insert
  to anon
  with check (true);

-- Índice para consultar a agenda por evento.
create index if not exists eventos_agosto_leads_evento_idx
  on public.eventos_agosto_leads (evento, created_at desc);
