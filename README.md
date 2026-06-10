# SkillBoard — Phase 1 MVP (Next.js)

A community skill directory. People sign up, list the things they're good at, and
others can browse and search to find them.

Phase 1 covers: **sign up / log in, add multiple skills, browse everyone, search by
skill, and view individual profiles.** (Messaging and ratings come in Phase 2.)

## Actualización a Fase 2 (mensajería + calificaciones)

Si ya tenías la Fase 1 funcionando, solo necesitas correr las tablas nuevas:

- En Supabase: **SQL Editor** > **New query**.
- Abre `schema.sql` y copia **solo el bloque que empieza en `-- PHASE 2`** (hasta el final).
- Pégalo y haz clic en **Run**.

Esto crea las tablas `messages` y `ratings`, sus reglas de seguridad, y activa
el modo en tiempo real para los mensajes. (Si corres el archivo completo otra vez,
la línea `alter publication ... add table messages` puede dar error porque ya existe;
es inofensivo — solo corre el bloque de Fase 2.)

## Qué hay en Fase 2
- Botón "Enviar mensaje" en cada perfil
- Mensajería en tiempo real entre usuarios (bandeja + conversación)
- Contador de mensajes no leídos en el header
- Calificaciones de 1 a 5 estrellas + comentario, con promedio en cada perfil

## Project structure

```
skillboard/
├── app/
│   ├── layout.js          Root layout (fonts, metadata)
│   ├── page.js            Main page — holds state, switches between screens
│   └── globals.css        All styling
├── components/
│   ├── Header.js          Top bar (login state aware)
│   ├── AuthForm.js        Sign up / log in
│   ├── Browse.js          The directory + live search
│   ├── MyProfile.js       Edit your profile + add/remove skills
│   └── ViewProfile.js     Someone else's full profile
├── lib/
│   ├── supabaseClient.js  Connects to Supabase using your keys
│   └── helpers.js         Small shared utilities
├── schema.sql             Database setup (run once in Supabase)
├── .env.local.example     Template for your keys
└── package.json
```

## Setup

### 1. Open in VS Code & install dependencies
Open this folder in VS Code, then in the terminal (Terminal > New Terminal):

```bash
npm install
```

### 2. Create a free Supabase project
- Go to https://supabase.com, sign up, click **New project**, wait ~2 min.

### 3. Set up the database
- In Supabase: **SQL Editor** > **New query**.
- Copy everything in `schema.sql`, paste, click **Run**.

### 4. Add your keys
- In Supabase: **Settings (gear) > API**.
- In VS Code, copy `.env.local.example` and rename the copy to `.env.local`.
- Paste your **Project URL** and **anon / public** key into it.

### 5. (For easy testing) Turn off email confirmation
- Supabase: **Authentication > Providers > Email** > turn **OFF** "Confirm email".
- (Turn it back on before a real launch.)

### 6. Run it

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## How to test
1. Click **Sign up**, create an account with your name.
2. You'll land on **My profile** — add a couple of skills.
3. Click **SkillBoard** (top-left) to see the board with your card.
4. Type in the search box to filter by skill.
5. Click any card to see that person's full profile.

## Notes
- This uses the basic `@supabase/supabase-js` client with client-side auth, which keeps
  things simple. Auth state is restored on refresh via `supabase.auth.getUser()`.
- When you're ready for Phase 2 (messaging, ratings), those tables have a reserved spot
  at the bottom of `schema.sql`, and you can add new components alongside the existing ones.

## What's next (Phase 2)
- In-app messaging between users
- Ratings & reviews
- Location-based filtering ("near me")
- Profile photo uploads (Supabase Storage)
