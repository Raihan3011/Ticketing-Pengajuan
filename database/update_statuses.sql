-- Script untuk update status yang sudah ada ke sistem baru
-- Jalankan setelah migrasi

-- Update status Open menjadi Pending
UPDATE statuses SET name = 'Pending', color = '#6c757d', `order` = 1 WHERE name = 'Open';

-- Update status Resolved menjadi Completed
UPDATE statuses SET name = 'Completed', is_closed = 1, `order` = 4 WHERE name = 'Resolved';

-- Tambah status baru jika belum ada
INSERT INTO statuses (name, color, is_closed, `order`, created_at, updated_at)
SELECT 'Approved by Pimpinan', '#17a2b8', 0, 3, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM statuses WHERE name = 'Approved by Pimpinan');

-- Update order untuk Closed
UPDATE statuses SET `order` = 5 WHERE name = 'Closed';
