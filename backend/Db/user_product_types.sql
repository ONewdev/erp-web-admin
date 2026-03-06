-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Feb 26, 2026 at 04:20 AM
-- Server version: 10.4.34-MariaDB-1:10.4.34+maria~ubu2004
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qsoft-website`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_product_types`
--

CREATE TABLE `user_product_types` (
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_product_types`
--
ALTER TABLE `user_product_types`
  ADD PRIMARY KEY (`user_id`,`category_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_product_types`
--
ALTER TABLE `user_product_types`
  ADD CONSTRAINT `user_product_types_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_erp` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_product_types_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `product_categories` (`category_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
