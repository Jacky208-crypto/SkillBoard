-- ============================================================
-- SkillBoard — Phase 1 MVP database schema
-- Run this in your Supabase project: SQL Editor > New Query > paste > Run
-- ============================================================

-- 1. PROFILES TABLE
-- Supabase already creates an "auth.users" table when people sign up.
-- This "profiles" table holds the extra public info for each user.
create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  location    text,
  bio         text,
  photo_url   text,
  created_at  timestamptz default now()
);

-- 2. SKILLS TABLE
-- One user can have MANY skills (one row per skill).
create table if not exists skills (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references profiles (id) on delete cascade,
  skill_name  text not null,
  experience  text,              -- e.g. "5 years", "beginner", "expert"
  description text,              -- their standing / explanation in this profession
  created_at  timestamptz default now()
);

-- Helpful index so searching by skill name is fast.
create index if not exists skills_skill_name_idx on skills (lower(skill_name));

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- This controls who is allowed to read/write each row.
-- ============================================================

alter table profiles enable row level security;
alter table skills   enable row level security;

-- Anyone (even logged out) can VIEW all profiles and skills — it's a public directory.
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Skills are viewable by everyone"
  on skills for select using (true);

-- A logged-in user can create / edit / delete only THEIR OWN profile.
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- A logged-in user can add / edit / delete only THEIR OWN skills.
create policy "Users can insert their own skills"
  on skills for insert with check (auth.uid() = user_id);

create policy "Users can update their own skills"
  on skills for update using (auth.uid() = user_id);

create policy "Users can delete their own skills"
  on skills for delete using (auth.uid() = user_id);

-- ============================================================
-- PHASE 2 — messaging + ratings
-- (Safe to run this block on top of an existing Phase 1 database.)
-- ============================================================

-- 3. MESSAGES TABLE
create table if not exists messages (
  id          bigint generated always as identity primary key,
  sender_id   uuid not null references profiles (id) on delete cascade,
  receiver_id uuid not null references profiles (id) on delete cascade,
  content     text not null,
  is_read     boolean default false,
  sent_at     timestamptz default now()
);

-- Indexes so loading a conversation / inbox is fast.
create index if not exists messages_sender_idx   on messages (sender_id);
create index if not exists messages_receiver_idx on messages (receiver_id);

-- 4. RATINGS TABLE
create table if not exists ratings (
  id          bigint generated always as identity primary key,
  reviewer_id uuid not null references profiles (id) on delete cascade,
  reviewee_id uuid not null references profiles (id) on delete cascade,
  score       int  not null check (score between 1 and 5),
  comment     text,
  created_at  timestamptz default now(),
  -- One rating per reviewer -> reviewee pair.
  unique (reviewer_id, reviewee_id)
);

create index if not exists ratings_reviewee_idx on ratings (reviewee_id);

-- ---------- Row Level Security ----------
alter table messages enable row level security;
alter table ratings  enable row level security;

-- MESSAGES: you can only see messages you sent or received.
create policy "Users can read their own messages"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- You can only send messages as yourself.
create policy "Users can send messages"
  on messages for insert
  with check (auth.uid() = sender_id);

-- You can mark messages addressed to you as read.
create policy "Receiver can update message"
  on messages for update
  using (auth.uid() = receiver_id);

-- RATINGS: everyone can read (so averages show on public profiles).
create policy "Ratings are viewable by everyone"
  on ratings for select using (true);

-- You can only leave a rating as yourself, and not rate yourself.
create policy "Users can insert their own rating"
  on ratings for insert
  with check (auth.uid() = reviewer_id and reviewer_id <> reviewee_id);

create policy "Users can update their own rating"
  on ratings for update using (auth.uid() = reviewer_id);

create policy "Users can delete their own rating"
  on ratings for delete using (auth.uid() = reviewer_id);

-- ---------- Realtime ----------
-- Lets the app receive new messages live, without refreshing.
alter publication supabase_realtime add table messages;

-- ============================================================
-- Done! Phase 3 (photos, location filtering) would go here.
-- ============================================================
