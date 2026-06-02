# CopyPasteGuru

CopyPasteGuru is a lightweight real-time text sharing platform. It lets users create or join a room, paste text into that room, and instantly sync the content across browsers or devices using Supabase Realtime.

The app is designed for quick sharing of notes, snippets, links, and temporary text between devices. It is an educational/demo project and should not be used for confidential or production-sensitive data.

## What It Does

- Creates short room IDs for shared paste rooms.
- Lets users join an existing room by entering its room ID.
- Syncs room text in real time across connected users.
- Stores one paste document per room in Supabase.
- Shows connection status, text stats, copy, and clear controls.
- Tracks a simple public visit count in the footer.
- Supports hosting behind the FreeSeva subpath:
  `https://www.freeseva.org/copypasteguru`

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Supabase Database
- Supabase Realtime
- Vercel

## Project Structure

```text
frontend/
  src/
    components/        React UI components
    lib/supabase.ts    Supabase client and database types
  supabase/
    migrations/        Supabase migration files
    new_account_full_setup.sql
  vite.config.ts       Vite config with /copypasteguru base path
  vercel.json          Vercel rewrites for subpath hosting
```

## Local Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=<your Supabase project URL>
VITE_SUPABASE_ANON_KEY=<your Supabase anon key>
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Supabase Setup

For a fresh Supabase project, run this script in the Supabase SQL Editor:

```text
frontend/supabase/new_account_full_setup.sql
```

It creates:

- `pastes`
- `visit_counts`
- `increment_count()`
- timestamp trigger for `pastes.updated_at`
- RLS policies for anonymous read/insert/update room access
- Realtime publication support for `pastes`

The app is unauthenticated by design. Public users can read, create, and update rooms, but cannot delete room rows.

## Deployment Notes

The app is configured to work under:

```text
/copypasteguru
```

Vite emits built assets under:

```text
/copypasteguru/assets/...
```

React Router detects the `/copypasteguru` prefix at runtime, so the app can still work on the direct Vercel root deployment where practical.

After changing Supabase accounts, update the Vercel environment variables:

```env
VITE_SUPABASE_URL=<new Supabase project URL>
VITE_SUPABASE_ANON_KEY=<new Supabase anon key>
```

Then redeploy the frontend.

## Important Limitations

- Room IDs are public access keys. Anyone with a room ID can view and edit that room.
- Room content is not encrypted end-to-end.
- The app is intended for learning, demos, and temporary sharing.
- Do not paste passwords, private documents, secrets, or sensitive production data.
