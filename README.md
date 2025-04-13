# fileThings

Online App to manage files.

Youtube - https://www.youtube.com/watch?v=LzwzgVQajVg

Link - https://file-things.vercel.app/
(Link maynot work since Supabase acc is inactive. Contact me to enable Supabase and you can test it out)


---

### How to run locally

Download the repo

```
git clone https://github.com/Madraceee/fileThings.git
cd fileThings
npm i
```

### To run

Make a .env.local file
Store
```
VITE_SUPERBASE_URL=
VITE_SUPERBASE_KEY=
```

Then run the cmds
```
npm run dev
```

Ensure to make 2 tables in Supabase before starting the app
Change required RLS policies in supabase to allow users to access table
```
create table
  public.folder_file (
    "ID" uuid not null default gen_random_uuid (),
    "Name" text not null,
    "Parent" uuid not null,
    "Type" character varying not null,
    "Owner" text not null,
    constraint folder_file_pkey primary key ("ID"),
    constraint folder_file_Owner_fkey foreign key ("Owner") references users (email) on update cascade on delete cascade
  ) tablespace pg_default;


create table
  public.users (
    email text not null,
    parent_folder_id uuid not null default gen_random_uuid (),
    constraint users_pkey primary key (email),
    constraint users_parent_folder_id_key unique (parent_folder_id)
  ) tablespace pg_default;

```
