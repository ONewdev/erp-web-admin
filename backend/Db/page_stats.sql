CREATE TABLE `page_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` varchar(255) NOT NULL,
  `stat_date` date NOT NULL,
  `device_type` varchar(20) DEFAULT 'unknown',
  `view_count` int DEFAULT 0,
  `unique_user_count` int DEFAULT 0, -- เพิ่มเพื่อเก็บจำนวนคนไม่ซ้ำหน้า
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  -- ปรับ Unique Key ให้รวม device_type เข้าไปด้วย
  UNIQUE KEY `unique_metrics` (`page`, `stat_date`, `device_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;