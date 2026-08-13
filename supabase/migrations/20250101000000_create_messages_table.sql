-- Create the messages table used for chat history.
create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	content text not null,
	sender_id text not null,
	receiver_id text null, -- null for group chat messages
	conversation_id text not null,
	created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx
	on public.messages (conversation_id);

create index if not exists messages_created_at_idx
	on public.messages (created_at asc);

-- Enable realtime so chat pages pick up new inserts instantly.
alter publication supabase_realtime add table public.messages;

-- Row level security: any authenticated user may read and write messages.
alter table public.messages enable row level security;

create policy "messages_select_all" on public.messages
	for select using (true);

create policy "messages_insert_all" on public.messages
	for insert with check (true);