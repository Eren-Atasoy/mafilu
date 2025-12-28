-- Create storage bucket for thumbnails
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- Set up security policies for the thumbnails bucket
create policy "Thumbnail Public Access"
  on storage.objects for select
  using ( bucket_id = 'thumbnails' );

create policy "Authenticated users can upload thumbnails"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'thumbnails' );

create policy "Users can update their own thumbnails"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'thumbnails' and owner = auth.uid() );

create policy "Users can delete their own thumbnails"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'thumbnails' and owner = auth.uid() );
