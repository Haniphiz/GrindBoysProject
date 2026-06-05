-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2026 at 09:25 AM
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
-- Database: `booking_hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `room_id`, `check_in`, `check_out`, `total_price`, `status`, `created_at`) VALUES
(17, 7, 11, '2026-06-08', '2026-06-09', 2000000.00, 'confirmed', '2026-05-16 02:01:23'),
(18, 9, 11, NULL, NULL, 2000000.00, 'pending', '2026-06-04 14:10:39'),
(19, 7, 11, NULL, NULL, 2000000.00, 'completed', '2026-06-04 14:57:39');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `address`, `city`, `description`, `image_url`, `created_at`) VALUES
(1, 'Hotel Santai', 'Jl. Merdeka No.1', 'Jakarta', 'Hotel nyaman', 'hotel.jpg', '2026-04-27 15:48:37'),
(2, 'Villa Dilan', 'Mekar sari', 'Bandung', 'Hotel kelas dunia', '1777560360610.jpeg', '2026-04-29 06:51:34'),
(3, 'Hotel Bali', 'Kuta ', 'Bali timur', 'Bintang 5', '1777563022403.jpeg', '2026-04-30 15:30:22'),
(4, 'Hotel Bali', 'Kuta ', 'Bali timur', 'Bintang 5', NULL, '2026-04-30 15:33:17'),
(5, 'Hotel Jogja', 'Prambanan', 'Jawa Timur', 'Natural', '1777568045627.jpeg', '2026-04-30 16:54:05'),
(6, 'Hotel Bandung', 'Braga', 'Kota Bandung', 'Bintang 5', '1777569322622.png', '2026-04-30 17:15:22'),
(7, 'Hotel Sunda', 'Tasik', 'Tasik Malaya', 'Bintang 5', '1777742667520.jpeg', '2026-05-02 17:24:27');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_reference` varchar(100) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_method`, `amount`, `status`, `payment_date`, `payment_reference`, `verified_at`) VALUES
(2, 17, 'qris', 2000000.00, '', '2026-05-16 02:04:31', 'PAY-1778897071950', '2026-05-16 02:30:21'),
(3, 19, 'transfer_bank', 2000000.00, '', '2026-06-04 14:58:23', 'PAY-1780585103476', '2026-06-04 15:00:25');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `hotel_id`, `booking_id`, `rating`, `comment`, `created_at`) VALUES
(1, 7, 7, 19, 5, 'Hotel sangat nyaman dan bersih', '2026-06-04 15:02:52');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `room_type` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `hotel_id`, `room_type`, `price`, `capacity`) VALUES
(2, 1, 'Deluxe', 500000.00, 2),
(3, 1, 'Deluxe', 500000.00, 2),
(4, 1, 'Deluxe', 500000.00, 2),
(5, 1, 'VVIP', 500000.00, 2),
(6, 4, 'VVIP', 500000.00, 2),
(7, 4, 'VVVIP', 500000.00, 2),
(8, 5, 'High Class', 2000000.00, 5),
(9, 5, 'High Class', 2000000.00, 5),
(10, 6, 'High Class', 24000000.00, 5),
(11, 7, 'Big room', 2000000.00, 4);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(3, 'han', 'han@mail.com', '$2b$10$jXIKagAW3SSM0c.mLUHbQunUSAyF/Bk.0OZ32x60HX447OwE1w1gq', 'admin', '2026-04-27 13:07:04'),
(4, 'hanip', 'hanip@mail.com', '$2b$10$Sv.RNJ./4HUrwYMFfTTnCe53ShlIVv9qEI2PRpREuHOBjeo4XHLWu', 'user', '2026-04-27 16:00:45'),
(6, 'dika', 'dika@gmail.com', '$2b$10$mWNVF3AdED0K8Utl2pUoluU40l/ZqCOXODF4Ee60ii/evJIfPkxEq', 'user', '2026-04-30 15:12:01'),
(7, 'yoga', 'yoga@mail.com', '$2b$10$dVnc03ekzLErV5l5qbRXAeC9Kx2GSYUtiV6JsL.ONYliM2aytJoBq', 'user', '2026-04-30 16:42:09'),
(8, 'agoy', 'agoy@mail.com', '$2b$10$lbYYQJc/R2cYWLQTz4YMPO7wfqe1gWQOd1hDdIAwGR6yEwxCCHQJi', 'user', '2026-04-30 17:11:36'),
(9, 'nanas', 'nanas@mail.com', '$2b$10$kwfGtZILlLCGdkkLdp5TQeBzrcFkwcvE80wqPKkwGIYw1hQj6evsu', 'user', '2026-05-02 17:12:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_booking_review` (`booking_id`),
  ADD KEY `hotel_id` (`hotel_id`),
  ADD KEY `idx_reviews_user_id` (`user_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
