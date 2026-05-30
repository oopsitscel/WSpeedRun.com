-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2026 at 08:54 PM
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
-- Database: `wspeedrun_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` varchar(36) NOT NULL,
  `run_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `run_id`, `user_id`, `comment`, `created_at`) VALUES
('578b2962-00e5-4d68-8205-c26c605849b3', '328d0eef-363e-4908-a387-6c85da945d55', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'Amazing run! The glitch skip at the third minute was flawless.', '2026-05-23 10:24:37'),
('a3149e2c-2c98-48a7-96ac-2fa423214760', 'b489b1da-a273-4d65-acd7-fa2a07817863', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'It\'s perfect!.', '2026-05-23 10:25:26'),
('f5909109-2a00-48de-b358-e20fd98e138b', '328d0eef-363e-4908-a387-6c85da945d55', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'Amazing run!.', '2026-05-23 10:24:51');

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `game_id` varchar(36) NOT NULL,
  `game_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`game_id`, `game_name`, `description`) VALUES
('11adb4a1-3449-4520-9302-c3b1bbde7610', 'Color Sort', 'Kids-friendly mobile game'),
('1ce0f2ed-5770-426f-a3e4-c2ce142b3914', 'Growtopia 2.0', 'A sandbox game focused on building, exploration, and survival.'),
('84f88318-91f5-42ff-b262-4268cca33cfc', 'Minecraft', 'A sandbox game focused on building, exploration, and survival.'),
('c1e32c11-2a9b-4251-924d-183b28db17c7', 'Candy Crush', 'Your favorite mobile game');

-- --------------------------------------------------------

--
-- Table structure for table `runs`
--

CREATE TABLE `runs` (
  `run_id` varchar(36) NOT NULL,
  `run_category_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `vod_url` varchar(255) NOT NULL,
  `run_duration` bigint(20) NOT NULL,
  `submitted_at` datetime NOT NULL,
  `verified_at` datetime DEFAULT NULL,
  `status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `runs`
--

INSERT INTO `runs` (`run_id`, `run_category_id`, `user_id`, `vod_url`, `run_duration`, `submitted_at`, `verified_at`, `status`) VALUES
('328d0eef-363e-4908-a387-6c85da945d55', '84160e3d-2cbc-4556-babf-7a01124b8c94', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3600, '2026-05-23 10:16:31', '2026-05-23 16:16:53', 'ACCEPTED'),
('37d49f96-c053-4f02-81a2-81cfc1ebd9a1', '48e171df-04e0-46fd-9520-b1f2af7a0297', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'https://www.youtube.com/watch', 1200, '2026-05-23 10:25:39', '2026-05-23 16:17:12', 'ACCEPTED'),
('b489b1da-a273-4d65-acd7-fa2a07817863', '48e171df-04e0-46fd-9520-b1f2af7a0297', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1400, '2026-05-23 10:17:18', '2026-05-23 16:17:33', 'REJECTED'),
('ccbb510e-3931-4ccc-965f-e8f109a5dfde', '48e171df-04e0-46fd-9520-b1f2af7a0297', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'https://www.youtube.com/watch', 1200, '2026-05-23 10:19:21', '2026-05-24 18:37:55', 'ACCEPTED'),
('e2509f6b-e8ff-4c70-a930-940c0e29ee7e', '81d2f21b-63dd-427a-b4a5-e12734bda98f', '8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'https://www.youtube.com/watchlater', 1264, '2026-05-24 18:03:36', '2026-05-24 18:40:15', 'REJECTED');

-- --------------------------------------------------------

--
-- Table structure for table `run_categories`
--

CREATE TABLE `run_categories` (
  `run_category_id` varchar(36) NOT NULL,
  `game_id` varchar(36) NOT NULL,
  `run_category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `run_categories`
--

INSERT INTO `run_categories` (`run_category_id`, `game_id`, `run_category_name`) VALUES
('48e171df-04e0-46fd-9520-b1f2af7a0297', '11adb4a1-3449-4520-9302-c3b1bbde7610', '75%'),
('81d2f21b-63dd-427a-b4a5-e12734bda98f', '1ce0f2ed-5770-426f-a3e4-c2ce142b3914', 'Any%'),
('84160e3d-2cbc-4556-babf-7a01124b8c94', '84f88318-91f5-42ff-b262-4268cca33cfc', '100% Glitchless');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(36) NOT NULL,
  `username` varchar(55) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `country` varchar(55) NOT NULL,
  `role` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `country`, `role`) VALUES
('5e67036a-b101-42f8-addb-c96693fdcacf', 'johndoe', 'john@mail.com', '$2b$10$mHqA0ysi6S2WyRPoE91KRuPkU73kmyt9MAJXnLCYjt4S1hhsMOOHW', 'Indonesia', 'USER'),
('8d88cf6b-958c-497e-8bd7-0f1a3674007a', 'michelle', 'michelle@mail.com', '$2b$10$ogSNzIqQk8WdMuBCnAW.I.Wx2qcK7u9aBBIWuY4jHpS2gXpPng4hm', 'Indonesia', 'USER'),
('b1612cc1-94e1-4784-b592-ffbbdeeaed05', 'Admin', 'Admin@mail.com', '$2b$10$iyDcUV2daQuiKQPrjMp9J.lG0WbyhUTloDGa89QGla.NkYWLiZegK', 'Indonesia', 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_comments_run` (`run_id`),
  ADD KEY `fk_comments_user` (`user_id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`game_id`);

--
-- Indexes for table `runs`
--
ALTER TABLE `runs`
  ADD PRIMARY KEY (`run_id`),
  ADD KEY `fk_runs_category` (`run_category_id`),
  ADD KEY `fk_runs_user` (`user_id`);

--
-- Indexes for table `run_categories`
--
ALTER TABLE `run_categories`
  ADD PRIMARY KEY (`run_category_id`),
  ADD KEY `fk_run_categories_game` (`game_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_run` FOREIGN KEY (`run_id`) REFERENCES `runs` (`run_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `runs`
--
ALTER TABLE `runs`
  ADD CONSTRAINT `fk_runs_category` FOREIGN KEY (`run_category_id`) REFERENCES `run_categories` (`run_category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_runs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `run_categories`
--
ALTER TABLE `run_categories`
  ADD CONSTRAINT `fk_run_categories_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
