CREATE TABLE `page_daily_visitors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `page` varchar(255) NOT NULL,
  `visitor_id` varchar(255) NOT NULL,
  `visit_date` date NOT NULL,
  `device_type` varchar(20) DEFAULT 'unknown',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_visit` (`page`, `visitor_id`, `visit_date`)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_general_ci;