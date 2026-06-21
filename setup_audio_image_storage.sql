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

-- ============================================
-- 8. Đảm bảo bảng comments có đủ cột cần dùng (ảnh, reply, paragraph_id)
--    Bổ sung an toàn — không ảnh hưởng dữ liệu cũ nếu cột đã tồn tại.
-- ============================================
alter table comments add column if not exists image_url text;
alter table comments add column if not exists parent_id bigint;
alter table comments add column if not exists reply_to_user_id uuid;
alter table comments add column if not exists paragraph_id text;
alter table comments add column if not exists sticker_url text;
-- Lưu ý: nếu cột paragraph_id đã tồn tại từ trước với kiểu KHÁC text (vd integer),
-- lệnh "add column if not exists" ở trên sẽ không đổi kiểu cột (vì cột đã có).
-- Nếu vẫn còn lỗi "Lỗi tải bình luận" sau khi chạy file này, chạy thêm dòng dưới
-- để ép kiểu cột paragraph_id về text (an toàn, không mất dữ liệu cũ):
-- alter table comments alter column paragraph_id type text using paragraph_id::text;

-- ============================================
-- 9. Sticker động — bucket lưu file GIF/ảnh động do admin tự upload qua
--    Supabase Dashboard > Storage > bucket "stickers". Mọi người chỉ cần
--    kéo-thả file GIF vào bucket này, không cần sửa code, sticker picker
--    trong chapter.html sẽ tự động liệt kê file mới.
-- ============================================
insert into storage.buckets (id, name, public)
values ('stickers', 'stickers', true)
on conflict (id) do nothing;

create policy if not exists "public read stickers"
on storage.objects for select
using (bucket_id = 'stickers');

-- Chỉ chủ web (qua Dashboard, dùng service role) mới cần upload, nên không
-- cần policy insert cho "authenticated" ở đây — tránh người đọc tự ý thêm sticker lạ.
