CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert posts
CREATE POLICY "Users can add posts" ON blog_posts
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to delete posts
CREATE POLICY "Users can delete posts" ON blog_posts
FOR DELETE
TO authenticated
USING (true);

-- Create policy to allow anyone to read posts
CREATE POLICY "Anyone can read posts" ON blog_posts
FOR SELECT
TO public
USING (true);