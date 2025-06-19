-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2025 at 12:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `practicaltest`
--

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `name`, `createdAt`) VALUES
(1, 'add', '2025-06-18 10:16:59.000'),
(2, 'edit', '2025-06-18 10:16:59.000'),
(3, 'delete', '2025-06-18 10:16:59.000'),
(4, 'view', '2025-06-19 11:29:13.000');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `createdAt`) VALUES
(1, 'admin', '2025-06-17 18:12:25.758'),
(2, 'user', '2025-06-17 18:12:33.672'),
(3, 'test', '2025-06-19 06:13:02.835');

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `id` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rolepermission`
--

INSERT INTO `rolepermission` (`id`, `roleId`, `permissionId`, `createdAt`) VALUES
(1, 1, 1, '2025-06-19 10:19:02.000'),
(2, 1, 3, '2025-06-19 10:19:05.000'),
(3, 1, 2, '2025-06-19 10:19:08.000'),
(4, 2, 4, '2025-06-19 11:29:27.000'),
(5, 3, 4, '2025-06-19 06:13:02.835'),
(6, 3, 3, '2025-06-19 06:13:02.835');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `roleId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `roleId`, `createdAt`) VALUES
(7, 'John Doe222', 'john@example.com', 'securepassword', 1, '2025-05-08 18:13:48.490'),
(9, 'Jame Doe', 'jame@example.com', '$2b$10$p9ZqEFJRkWp0iqfNRdwXHOZxHxDHLzEmU81JkIZmF1Mb1SsqHm56i', 1, '2025-06-17 18:24:30.013'),
(10, 'Jame Meeyu', 'jame555@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-06-17 18:42:30.138'),
(12, 'Sarah Lee', 'sarah@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 18:50:48.490'),
(13, 'Michael Brown', 'michael@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-04-08 19:00:09.554'),
(14, 'Emily White', 'emily@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 19:10:30.013'),
(15, 'William Harris', 'william@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-05-08 18:13:48.490'),
(16, 'Olivia Clark', 'olivia@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-05-08 18:13:48.490'),
(17, 'James King', 'james@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-06-17 19:40:09.554'),
(18, 'Sophia Lewis', 'sophia@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-05-08 18:13:48.490'),
(19, 'Benjamin Walker', 'benjamin@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-05-08 18:13:48.490'),
(20, 'Charlotte Young', 'charlotte@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 20:10:48.490'),
(21, 'Alexander Scott', 'alexander@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-05-08 18:13:48.490'),
(22, 'Amelia Martinez', 'amelia@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 20:30:30.013'),
(23, 'Mason Thomas', 'mason@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-06-12 20:40:30.138'),
(24, 'Isabella Garcia', 'isabella@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 20:50:48.490'),
(25, 'Ethan Rodriguez', 'ethan@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-06-17 21:00:09.554'),
(26, 'Harper Lee', 'harper@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 21:10:30.013'),
(27, 'Jack Wilson', 'jack@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 1, '2025-06-17 21:20:30.138'),
(28, 'Zoe Evans', 'zoe@example.com', '$2b$10$Xvw7Ls5/Xns6j0e1R4XEfejWFNP8YbqqGudZ/CZWbP8VC9Iv4ZHl2', 2, '2025-06-17 21:30:48.490'),
(30, 'Jame Meeyu', 'jame55523@example.com', '$2b$10$d58uNEjQaJdp9JDOkArpEe6vfdW.Ggli.zz4fCMabyAywLhf6JXv2', 1, '2025-06-16 20:51:15.484'),
(31, 'ๆไำไๆำ', 'sad@s.com', '$2b$10$u3O.SEZ67YQfegtTPunt2erAbuYiK/5cZQilyg6kJKjqs8gtsRHzq', 2, '2025-06-18 20:55:23.614'),
(32, 'asd', 'qwe@s.com', '$2b$10$dDVi3nutrPGF0gBi8W0/.elpfrrBaYNAjA94DuIanusR1JCvTi3pu', 1, '2025-06-18 20:55:43.546'),
(34, 'qweqwe', 'qwsse@s.com', '$2b$10$VZnojuZPdX4yEHSTZIR5uOoMwt45uLi8cc/6t55CR1dqI8k93..RC', 1, '2025-06-19 04:12:08.240'),
(35, 'asd', 'sarahs@example.com', '$2b$10$CvMBteP7Cpgt2cLUKvnM0OCvYr.TfR4jPw6ZNjnMQvcD0x8niBc/m', 1, '2025-06-19 04:13:40.784');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2a5e601d-1cd5-40fb-994e-a6be9d8aac87', 'cee79c3d072c3dbcb53b9fa5b1a81d55642f998e0e5ec2e2060f0ac648d4c714', '2025-06-17 17:47:51.642', '20250617174751_add_permission_relation', NULL, NULL, '2025-06-17 17:47:51.509', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Permission_name_key` (`name`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Role_name_key` (`name`);

--
-- Indexes for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `RolePermission_roleId_fkey` (`roleId`),
  ADD KEY `RolePermission_permissionId_fkey` (`permissionId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_roleId_fkey` (`roleId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rolepermission`
--
ALTER TABLE `rolepermission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
