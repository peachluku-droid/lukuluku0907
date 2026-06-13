-- ============================================
-- 1. Tạo bucket lưu ảnh trong chương (write.html)
-- ============================================
insert into storage.buckets (id, name, public)
values ('chapter-images', 'chapter-images', true)
on conflict (id) do nothing;

-- ============================================
-- 2. Tạo bucket lưu audio chương (write.html)
-- ============================================
insert into storage.buckets (id, name, public)
values ('chapter-audio', 'chapter-audio', true)
on conflict (id) do nothing;

-- ============================================
-- 3. Đảm bảo bucket comment-images tồn tại (nếu chưa có)
-- ============================================
insert into storage.buckets (id, name, public)
values ('comment-images', 'comment-images', true)
on conflict (id) do nothing;

-- ============================================
-- 4. Policy: cho phép đọc public tất cả 3 bucket
-- ============================================
create policy "public read chapter-images"
on storage.objects for select
using (bucket_id = 'chapter-images');

create policy "public read chapter-audio"
on storage.objects for select
using (bucket_id = 'chapter-audio');

create policy "public read comment-images"
on storage.objects for select
using (bucket_id = 'comment-images');

-- ============================================
-- 5. Policy: cho phép user đã đăng nhập upload
-- ============================================
create policy "authenticated upload chapter-images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'chapter-images');

create policy "authenticated upload chapter-audio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'chapter-audio');

create policy "authenticated upload comment-images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'comment-images');

-- ============================================
-- 6. Đảm bảo chapters có cột audio_url (nếu chưa có)
-- ============================================
alter table chapters add column if not exists audio_url text;

-- ============================================
-- 7. Đảm bảo bảng comments cho phép user đăng nhập insert/select
--    (sửa nếu policy hiện tại quá chặt khiến không gửi được bình luận)
-- ============================================
create policy if not exists "authenticated insert comments"
on comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy if not exists "public read comments"
on comments for select
using (true);

create policy if not exists "owner delete comments"
on comments for delete
to authenticated
using (auth.uid() = user_id);
