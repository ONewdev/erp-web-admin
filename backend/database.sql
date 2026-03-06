CREATE DATABASE IF NOT EXISTS bci_db CHARACTER SET utf8 COLLATE utf8_general_ci;

USE bci_db;

CREATE TABLE IF NOT EXISTS company_info (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    sales_phone VARCHAR(255),
    support_phone VARCHAR(255),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    google_maps TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial record
INSERT INTO company_info (id, company_name, address, sales_phone, support_phone, facebook, youtube, google_maps)
VALUES (1, 
        'บริษัท บิสซิเนส คอมเพ็ดทิทีฟ อินเทลลิเจนซ์ จำกัด', 
        '59/69 หมู่ 1 ซ.ติวานนท์ - ปากเกร็ด 56 ต.บ้านใหม่ อ.ปากเกร็ด จ.นนทบุรี 11120', 
        '02-582-2110, 091-762-3838, 086-395-0364', 
        '083-122-6349, 091-762-3838, 086-321-3874', 
        'https://www.facebook.com/q.soft/', 
        'https://www.youtube.com/user/qsoftthai/', 
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21904.272143554408!2d100.56008115037825!3d13.948788647682154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2836299299ac5%3A0xffd24ce376fe4efe!2z4Lia4LiI4LiBLiDguJrguLTguKrguIvguLTguYDguJnguKog4LiE4Lit4Lih4LmA4Lie4LmH4LiU4LiX4Li04LiX4Li14LifIOC4reC4tOC4meC5gOC4l-C4peC4peC4tOC5gOC4iOC4meC4i-C5jA!5e0!3m2!1sth!2sth!4v1768884936985!5m2!1sth!2sth'
) ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    service TEXT,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS powerbi_requests (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_code VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    plan VARCHAR(100) NOT NULL,
    note TEXT,
    status ENUM('รอดำเนินการ', 'อนุมัติแล้ว', 'กำลังติดต่อ') DEFAULT 'รอดำเนินการ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bi_registrations (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    status ENUM('รอดำเนินการ', 'อนุมัติแล้ว', 'กำลังติดต่อ') DEFAULT 'รอดำเนินการ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    positions INT DEFAULT 1,
    description TEXT,
    workType VARCHAR(255),
    tags TEXT,
    responsibilities TEXT,
    benefits TEXT,
    qualifications TEXT,
    contact TEXT,
    status VARCHAR(100),
    image LONGTEXT,
    is_visible TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial careers from careerData.tsx
INSERT INTO jobs (title, positions, description, workType, tags, responsibilities, benefits, qualifications, contact, status, image)
VALUES 
('Secretary', 1, 'ลูกจ้างประจำ - ทำงานจันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'Support, Microsoft office', ' จัดตารางนัดหมายให้กับกรรมการผู้จัดการทั้งภายในและภายนอก รวมถึงจัดการการเดินทางและที่พัก การจองตั๋วต่างๆ\n เตรียมการประชุม/กิจกรรมภายในและภายนอก\n เข้าร่วมการประชุมเพื่อจดบันทึก และเขียนรายงานการประชุม\n ตรวจสอบให้แน่ใจว่าตารางเวลาของกรรมการผู้จัดการดำเนินไปอย่างราบรื่น เข้าใจและจัดลำดับความสำคัญของงานได้อย่างมีประสิทธิภาพ\n ผลัดเปลี่ยนการทำงานกับเลขาท่านอื่นเพื่อสนับสนุนการทำงานของกรรมการผู้จัดการ\n รับโทรศัพท์และตอบอีเมล์ ทั้งจากชาวไทยและต่างชาติ\n เป็นผู้ช่วยบริหารจัดการธุระส่วนตัวของ CEO และรักษาความลับในระดับสูง\n ดูแลประสานงานระหว่างกรรมการผู้จัดการกับแผนกต่างๆภายใน และบุคคลหรือองค์กรภายนอก\n ติดตามงานที่กรรมการผู้จัดการมอบหมายพนักงานแต่ละแผนกตามกำหนดเวลาที่ให้ไว้ และรายงานความคืบหน้า\n ปฏิบัติหน้าที่เลขานุการและงานธุรการต่างๆ การจัดเก็บเอกสาร การจัดระเบียบ และการรักษาความลับ', 'ประกับสังคม\nเบี้ยขยัน เดือนละ 500 บาท\nเงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\nท่องเที่ยวประจำปี', 'เพศ ชาย หรือ หญิง\nอายุ 25-35, ประสบการณ์ทำงาน 2 ปี\nสามารถใช้ Microsoft office ได้คล่อง\nมีพื้นฐานภาษาอังกฤษ', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/รับสมัครเลขานุการ.png'),
('SCM & MRP Implementors', 1, 'พัฒนา POS, MRP และระบบสนับสนุน', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'POS, MRP, Support, stored procedure', 'เรียนรู้เและทำความเข้าใจการทำงานของระบบ Q.Soft\n เก็บข้อมูลการทำงานของลูกค้า\n วิเคราะห์เและออกเแบบการใช้งาน Q.Soft ให้เข้ากับงานลูกค้า\n ทำรายงานสรุปผลการวิเคราะห์เและออกเเบการใช้งาน\n ประสานงานกับ Technical Support เและ Programmer ตามกรณีที่เหมาะสม\n เตรียม Q.Soft ให้พร้อมทำ User Acceptance Test\n ทำคู่มือการใช้งานสำหรับผู้ใช้งาน เและฝึกอบรมผู้ใช้งาน', 'ประกับสังคม\nเบี้ยขยัน เดือนละ 500 บาท\nเงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\nท่องเที่ยวประจำปี', 'ระดับการศึกษาปริญญาตรี วิศวกรรมคอมพิวเตอร์ / วิทยาศาตร์คอมพิวเตอร์ / บริหารธุรกิจคอมพิวเตอร์ / จบด้านเทคโนโลยีสารสนเทศ / วิศวกรรมอุตสาหการ หรือสาขาที่เกี่ยวข้อง\nเดินทางต่างจังหวัดได้ และขับรถเป็น\nเพศ ชาย หรือ หญิง\nอายุ 22 ปีขึ้นไป\nหากมีประสบการณ์ด้านการวางระบบซอฟต์เเวร์ (Implement software) จะได้รับการพิจารณาเป็นพิเศษ\nยินดีรับนักศึกษาจบใหม่', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/Supply Chain Management.png'),
('BackEnd Developer', 1, 'พัฒนา API และระบบหลังบ้าน', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'C#, Back End Developers, Have knowledge in REST API, Dev Express Reporting, IIS, MSSQL Server', 'C# Back End Developers Have knowledge in REST API Dev Express Reporting IIS MSSQL Server', 'ประกับสังคม\nเบี้ยขยัน เดือนละ 500 บาท\nเงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\nท่องเที่ยวประจำปี', 'ระดับการศึกษาปริญญาตรี วิศวกรรมคอมพิวเตอร์ / วิทยาศาตร์คอมพิวเตอร์ / บริหารธุรกิจคอมพิวเตอร์\nเพศ ชาย หรือ หญิง, อายุ 22 ปีขึ้นไป\nประสบการณ์ทำงาน 0~2 ปีขึ้นไป\nยินดีรับนักศึกษาจบใหม่', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/BackEnd.png'),
('Application support', 1, 'สนับสนุน POS, Accounting และระบบ ERP', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'POS, MRP, Accounting, Support, stored procedure', 'ผ่านการใช้ POS เและ Accounting (หากมีความรู้ความสามารถด้าน ERP จะพิจารณาเป็นพิเศษ)', 'ประกับสังคม, เบี้ยขยัน เดือนละ 500 บาท\nเงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\nท่องเที่ยวประจำปี', 'ระดับการศึกษาปริญญาตรี วิศวกรรมคอมพิวเตอร์ / วิทยาศาตร์คอมพิวเตอร์ / บริหารธุรกิจคอมพิวเตอร์\nเพศ ชาย หรือ หญิง\nอายุ 22 ปีขึ้นไป\nประสบการณ์ทำงาน 0~2 ปีขึ้นไป\nยินดีรับนักศึกษาจบใหม่', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/Application support.png'),
('Programmer .NET', 3, 'พัฒนาโปรแกรม VB.NET, C# และ SQL Server', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'vb.net, c#, sql language, mssql server, stored procedure, mvc, mvp', 'ทำการวิเคราะห์ออกแบบฐานข้อมูล\nวางโครงสร้างของการเขียนโปรแกรมด้วยภาษา visual .net\nT-SQL (หากมีความรู้ความสามารถด้าน ERP จะพิจารณาเป็นพิเศษ)', 'ประกับสังคม\nเบี้ยขยัน เดือนละ 500 บาท\nเงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\nท่องเที่ยวประจำปี', 'ระดับการศึกษาปริญญาตรี วิศวกรรมคอมพิวเตอร์ / วิทยาศาตร์คอมพิวเตอร์ / บริหารธุรกิจคอมพิวเตอร์\nเพศ ชาย หรือ หญิง\nอายุ 22 ปีขึ้นไป\nประสบการณ์ทำงาน 0~2 ปีขึ้นไป\nยินดีรับนักศึกษาจบใหม่', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/vs-icon.png'),
('Sale Admin', 1, 'บริหารงานขาย ERP และประสานงานขาย', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'Sale, Sale Admin, ERP', 'ติดต่อกับลูกค้าเกี่ยวกับงานขาย\nประสานงานขายระหว่างเซลล์กับลูกค้า ฯลฯ (หากมีความรู้ความสามารถด้าน ERP จะพิจารณาเป็นพิเศษ)', 'ประกับสังคม\nเบี้ยขยัน เดือนละ 500 บาท\nเงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\nท่องเที่ยวประจำปี', 'ระดับการศึกษาปริญญาตรี\nเพศ ชาย หรือ หญิง\nอายุ 22 ปีขึ้นไป\nประสบการณ์ทำงาน 0~2 ปีขึ้นไป\nยินดีรับนักศึกษาจบใหม่', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/SaleAd.jpg'),
('Technical Sale', 1, 'ขายเทคนิค ERP และให้คำปรึกษา', 'งานประจำ / ทำงาน จันทร์-เสาร์ (เสาร์เว้นเสาร์)', 'Sale, Technical Sale, ERP', 'ติดต่อลูกค้าเกี่ยวกับงานขาย (หากมีความรู้ความสามารถด้าน ERP จะพิจารณาเป็นพิเศษ)', 'ประกับสังคม\n เบี้ยขยัน เดือนละ 500 บาท\n เงินพิเศษ อายุงานครบ 5 ปี 10 ปี 15 ปี\n ท่องเที่ยวประจำปี', 'ระดับการศึกษาปริญญาตรี วิศวกรรมอุตสาหการ หรือสาขาที่เกี่ยวข้อง\n เพศ ชาย หรือ หญิง มีทักษะการใช้งานคอมพิวเตอร์\n อายุ 22 ปีขึ้นไป\n เคยใช้โปรแกรม ERP หรือ SAP - B1\n สามารถวางแผนการทำงานด้านงานโรงงานได้\n ประสบการณ์ทำงาน 0~2 ปีขึ้นไป\n ยินดีรับนักศึกษาจบใหม่\n จะพิจารณาเป็นพิเศษ', '0-2582-2110, 09-1762-3838, nurng.t072@gmail.com, chopaka1817@gmail.com', 'รับสมัครด่วน', '/img/TSale.jpg');

-- Authentication table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user (username: admin, password: admin1234)
-- Hash generated with password_hash('admin1234', PASSWORD_BCRYPT)
INSERT INTO admin_users (username, password, full_name) 
VALUES ('admin', '$2y$10$xkflvC/MC5fuX0TI1pQqzO/DduPZlEe0i5OGpKaF9nsgj5yBjdvyy','BCI Admin')
ON DUPLICATE KEY UPDATE password = VALUES(password), full_name = VALUES(full_name);

CREATE TABLE IF NOT EXISTS `page_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` varchar(255) NOT NULL,
  `stat_date` date NOT NULL,
  `device_type` varchar(20) DEFAULT 'unknown',
  `view_count` int DEFAULT 0,
  `unique_user_count` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_metrics` (`page`, `stat_date`, `device_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `page_daily_visitors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `page` varchar(255) NOT NULL,
  `visitor_id` varchar(255) NOT NULL,
  `visit_date` date NOT NULL,
  `device_type` varchar(20) DEFAULT 'unknown',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_visit` (`page`, `visitor_id`, `visit_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

