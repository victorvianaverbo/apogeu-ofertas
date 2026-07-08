-- ============================================================
-- Anamnese da Imersão — tabela de respostas (Supabase)
-- Projeto: ajokzpjguhfxxudteetr
-- Rode este script UMA VEZ no SQL Editor do Supabase.
-- ============================================================

create table if not exists public.anamnese_imersao (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  status      text        not null default 'iniciado',  -- 'iniciado' | 'completo'
  nome        text,
  telefone    text,
  email       text,
  contratacao text,
  respostas   jsonb       not null default '{}'::jsonb   -- todo o resto (respostas + utms)
);

-- Mantém updated_at atualizado a cada PATCH de conclusão
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_anamnese_updated_at on public.anamnese_imersao;
create trigger trg_anamnese_updated_at
  before update on public.anamnese_imersao
  for each row execute function public.set_updated_at();

-- Row Level Security: o formulário público grava com a anon key.
alter table public.anamnese_imersao enable row level security;

-- INSERT anônimo (registro parcial no início do formulário).
drop policy if exists "anon insert anamnese" on public.anamnese_imersao;
create policy "anon insert anamnese"
  on public.anamnese_imersao
  for insert to anon
  with check (true);

-- UPDATE anônimo (conclusão: completa o mesmo registro pelo id).
-- Nota: como a anon key é pública, qualquer um com o id poderia atualizar a
-- linha. O risco é baixo para onboarding; se quiser blindar, troque este fluxo
-- por um RPC/Edge Function com service_role.
drop policy if exists "anon update anamnese" on public.anamnese_imersao;
create policy "anon update anamnese"
  on public.anamnese_imersao
  for update to anon
  using (true)
  with check (true);

-- Índices úteis para consulta na equipe
create index if not exists idx_anamnese_created on public.anamnese_imersao (created_at desc);
create index if not exists idx_anamnese_status  on public.anamnese_imersao (status);
