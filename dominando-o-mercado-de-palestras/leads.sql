-- Tabela de leads da LP "Dominando o Mercado de Palestras"
-- Rodar no SQL Editor do Supabase (projeto ajokzpjguhfxxudteetr).
-- A página insere via anon key (REST); por isso o RLS libera APENAS INSERT
-- para anon, sem leitura (mesma correção que faltou no quiz do diagnóstico).

create table if not exists public."dominando-o-mercado-de-palestras" (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  telefone text not null,
  destino text,       -- 'calendly' ou 'whatsapp' (qual botão o lead clicou)
  origem text,        -- 'dominando-o-mercado-de-palestras'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_url text
);

alter table public."dominando-o-mercado-de-palestras" enable row level security;

create policy "insert_anon_dominando"
  on public."dominando-o-mercado-de-palestras"
  for insert
  to anon
  with check (true);
