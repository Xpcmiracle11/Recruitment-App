-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2025 at 01:09 PM
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
-- Database: `recruitment`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `department`, `created_at`, `updated_at`) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '$2y$12$kQXPsCcp9xkdUIsTQfZuHOjtNkJEJB3/ZIsTeNd1Sm8PFSLPC4KT.', 'Admin', 'IT', '2024-12-03 12:21:41', '2024-12-03 12:21:41'),
(10, 'Recruitment', 'Testing', 'recruitment@gmail.com', '$2y$12$H8JIwYOLDLc.y.JsvSvoZu6mZiVLvIoDe3FMJTrxa4TudzQ9y8YC.', 'Admin', 'RT', '2025-01-09 06:30:21', '2025-01-09 06:30:21');

-- --------------------------------------------------------

--
-- Table structure for table `application_status`
--

CREATE TABLE `application_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `first_call` varchar(255) DEFAULT NULL,
  `second_call` varchar(255) DEFAULT NULL,
  `third_call` varchar(255) DEFAULT NULL,
  `communication` varchar(255) DEFAULT NULL,
  `reading` varchar(255) DEFAULT NULL,
  `typing` varchar(255) DEFAULT NULL,
  `problem_solving` varchar(255) DEFAULT NULL,
  `work_ethics` varchar(255) DEFAULT NULL,
  `budget_issues` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application_status`
--

INSERT INTO `application_status` (`id`, `user_id`, `status`, `first_call`, `second_call`, `third_call`, `communication`, `reading`, `typing`, `problem_solving`, `work_ethics`, `budget_issues`, `remarks`, `created_at`, `updated_at`) VALUES
(13, 27, 'Pending', 'Answered', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-09 06:36:49', '2025-01-09 06:47:59'),
(14, 29, 'Pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-10 14:51:22', '2025-01-10 14:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_11_28_213605_users', 2),
(8, '2024_12_03_193735_admins', 3),
(11, '2024_12_06_192201_application_status', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `suffix` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `zip` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `age` varchar(255) DEFAULT NULL,
  `educational_attainment` varchar(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `start_date` varchar(255) NOT NULL,
  `end_date` varchar(255) NOT NULL,
  `gpa` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `other_source` varchar(255) DEFAULT NULL,
  `sourcer` varchar(255) NOT NULL,
  `other_sourcer` varchar(255) DEFAULT NULL,
  `previous_employee` varchar(255) NOT NULL,
  `recruiter` varchar(255) NOT NULL,
  `bpo_experience` varchar(255) NOT NULL,
  `application_method` varchar(255) NOT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `skillset` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `suffix`, `region`, `province`, `municipality`, `barangay`, `street`, `zip`, `phone_number`, `email`, `gender`, `dob`, `age`, `educational_attainment`, `institution_name`, `course`, `start_date`, `end_date`, `gpa`, `source`, `other_source`, `sourcer`, `other_sourcer`, `previous_employee`, `recruiter`, `bpo_experience`, `application_method`, `resume`, `skillset`, `created_at`, `updated_at`) VALUES
(27, 'Charles Agustin', 'Callado', 'Monreal', 'N/A', '06', 'ILOILO', 'MIAGAO', 'BAYBAY SUR (POB.)', 'Hinolan', '5023', '0985024406', 'charles@gmail.com', 'Male', '2001-09-11', '24', 'College', 'West Visayas State University', 'BSIS', '2020-08-01', '2024-06-06', '1.5', 'Facebook', NULL, 'Other', 'Angel', 'No', 'Bryan', 'No Experience', 'Walk-in', NULL, 'C++, Java', '2025-01-09 06:36:49', '2025-01-10 08:26:32'),
(29, 'Anastasia', NULL, 'Arciaga', 'N/A', '06', 'ILOILO', 'MIAGAO', 'BAYBAY SUR (POB.)', 'Hinolan', '5708', '09113321382', 'anastasia@gmail.com', 'Female', '2001-05-08', '24', 'College', 'West Visayas State University', 'BSIS', '2020-08-01', '2024-06-06', '1.5', 'Facebook', NULL, 'Cristiel', NULL, 'Yes', 'Charles', '1 year - 2 years', 'Walk-in', NULL, 'Video Editing', '2025-01-10 14:51:22', '2025-01-10 16:55:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `application_status`
--
ALTER TABLE `application_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_status_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `application_status`
--
ALTER TABLE `application_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_status`
--
ALTER TABLE `application_status`
  ADD CONSTRAINT `application_status_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
