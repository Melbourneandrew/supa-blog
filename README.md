## Simple Blog with Supabase as CMS
This is a simple blog starter kit built with Supabase and Next.js.

Posts, uploaded as markdown files, are stored in a blog_posts table in Supabase.

### Getting Started
This command will install the dependencies and start the development server.
```
npm i && npm run dev
```
Set up your environment variables
```
cp .env.example .env
```
This command will start the Supabase server.
```
npx supabase start
```
You should see a message containing the Supabase url and anon key. Paste these into the `.env` file in `NEXT_PUBLIC_SUPABASE_URL=` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=`.

This command will set up the blog_posts table in Supabase using the supabase/migrations/20241208014435_setup_blog_table.sql file.
```bash
npx supabase db reset
```

## Adding a new post
First, you must signup as an admin.

For saftey in production, signups are disabled by default. Enable signups by setting `NEXT_PUBLIC_ADMIN_SIGNUP_ENABLED` to `true` in the `.env` file.

Navigate to `/signup` and signup.

Navigate to `/admin` and click the `Add New Post` button.

Fill out the form and click `Create Post`.

Your new post will be created and viewable at the root of the site.

## Editing the blog title, description, and author
These are set in the `.env` file as 
* `NEXT_PUBLIC_BLOG_TITLE`
* `NEXT_PUBLIC_BLOG_DESCRIPTION`
* `NEXT_PUBLIC_BLOG_AUTHOR`