-- Supabase SQL Editorで実行するスキーマ
create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'github_pages', -- google_forms_import / github_pages
  source_timestamp text,
  answers jsonb not null default '{}'::jsonb,
  raw_row jsonb not null default '{}'::jsonb,
  layer text check (layer is null or layer in ('A','B','C','D','E','F')),
  layer_name text,
  pc1 double precision,
  pc2 double precision,
  classification_status text,
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_created_at_idx on public.survey_responses(created_at);
create index if not exists survey_responses_layer_idx on public.survey_responses(layer);

create table if not exists public.survey_feedback (
  id uuid primary key default gen_random_uuid(),
  response_id uuid references public.survey_responses(id) on delete set null,
  diagnosed_layer text check (diagnosed_layer is null or diagnosed_layer in ('A','B','C','D','E','F')),
  feedback text not null check (feedback in ('合っている','一部違う','当てはまらない')),
  selected_layer text check (selected_layer is null or selected_layer in ('A','B','C','D','E','F')),
  comment text not null default '',
  created_at timestamptz not null default now()
);

alter table public.survey_responses enable row level security;
alter table public.survey_feedback enable row level security;
-- 初期状態では公開ポリシーを作成しない。公開フォーム用のINSERT権限は
-- Edge Function + CAPTCHA/レート制限等を設計してから追加すること。
