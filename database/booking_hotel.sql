-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Jun 2026 pada 09.11
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookinghotel`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','checked_in','completed','cancelled','expired') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sla_deadline` datetime DEFAULT NULL,
  `special_request` text DEFAULT NULL,
  `guests` int(11) DEFAULT 1,
  `approved_at` datetime DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `reject_reason` text DEFAULT NULL,
  `check_in_at` datetime DEFAULT NULL,
  `check_out_at` datetime DEFAULT NULL,
  `expired_at` datetime DEFAULT NULL
) ;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `room_id`, `check_in`, `check_out`, `total_price`, `status`, `created_at`, `sla_deadline`, `special_request`, `guests`, `approved_at`, `rejected_at`, `reject_reason`, `check_in_at`, `check_out_at`, `expired_at`) VALUES
(44, 13, 64, '2026-06-23', '2026-06-25', 1887000.00, 'cancelled', '2026-06-23 04:29:53', NULL, NULL, 1, NULL, '2026-06-23 11:33:33', 'Anda hanya pantas di room terbaik kami', NULL, NULL, NULL),
(46, 13, 99, '2026-07-03', '2026-07-07', 6660000.00, 'cancelled', '2026-06-23 04:32:03', NULL, NULL, 1, '2026-06-23 11:33:36', NULL, NULL, NULL, NULL, NULL),
(47, 13, 124, '2026-06-23', '2026-06-26', 9990000.00, 'cancelled', '2026-06-23 04:52:43', NULL, NULL, 1, '2026-06-23 11:53:47', NULL, NULL, NULL, NULL, NULL),
(48, 14, 116, '2026-06-23', '2026-06-25', 1998000.00, 'completed', '2026-06-23 06:47:57', NULL, NULL, 1, '2026-06-23 13:48:11', NULL, NULL, '2026-06-23 13:49:13', '2026-06-23 13:49:17', NULL),
(49, 18, 79, '2026-07-03', '2026-07-21', 89910000.00, 'confirmed', '2026-06-26 07:07:28', NULL, NULL, 1, '2026-06-26 14:07:57', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `hotels`
--

CREATE TABLE `hotels` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `floors` int(11) NOT NULL DEFAULT 3,
  `rating` decimal(2,1) DEFAULT 0.0,
  `reviews` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `address`, `city`, `description`, `image_url`, `created_at`, `floors`, `rating`, `reviews`) VALUES
(1, 'The Grand Majapahit', 'Jl. Trowulan No. 1, Trowulan', 'Mojokerto', 'Hotel bintang 5 dengan arsitektur Kerajaan Majapahit yang megah.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', '2026-06-23 03:16:28', 5, 4.8, 324),
(2, 'Ayana Resort Bali', 'Jl. Karang Mas Sejahtera, Jimbaran', 'Badung', 'Resort mewah di tepi tebing Jimbaran dengan pemandangan samudra Hindia.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', '2026-06-23 03:16:28', 4, 4.9, 512),
(3, 'Bromo Highland Hotel', 'Jl. Raya Bromo No. 88, Sukapura', 'Probolinggo', 'Hotel pegunungan dengan pemandangan langsung ke Gunung Bromo.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', '2026-06-23 03:16:28', 8, 4.6, 198),
(4, 'Labuan Bajo Dive Lodge', 'Jl. Pantai Pede, Labuan Bajo', 'Manggarai Barat', 'Lodge tepi pantai untuk penyelam dan penjelajah Komodo.', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', '2026-06-23 03:16:28', 1, 4.7, 267);

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_reference` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_method`, `amount`, `status`, `payment_date`, `payment_reference`) VALUES
(34, 44, 'qris', 1887000.00, '', '2026-06-23 04:29:53', 'PAY-1782188993857'),
(36, 46, 'credit_card', 6660000.00, '', '2026-06-23 04:32:03', 'PAY-1782189123824'),
(37, 47, 'credit_card', 9990000.00, '', '2026-06-23 04:52:43', 'PAY-1782190363893'),
(38, 48, 'ewallet', 1998000.00, '', '2026-06-23 06:47:57', 'PAY-1782197277472'),
(39, 49, 'ewallet', 89910000.00, '', '2026-06-26 07:07:28', 'PAY-1782457648902');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `room_type` varchar(50) DEFAULT NULL,
  `number` varchar(10) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rooms`
--

INSERT INTO `rooms` (`id`, `hotel_id`, `room_type`, `number`, `price`, `capacity`) VALUES
(64, 1, 'Standard', '01-01', 850000.00, 2),
(65, 1, 'Standard', '01-02', 850000.00, 2),
(66, 1, 'Deluxe', '02-01', 1200000.00, 2),
(67, 1, 'Deluxe', '02-02', 1200000.00, 2),
(68, 1, 'VIP', '03-01', 2400000.00, 3),
(69, 1, 'VIP', '03-02', 2400000.00, 3),
(70, 1, 'Suite', '04-01', 3500000.00, 4),
(71, 1, 'Suite', '04-02', 3500000.00, 4),
(72, 1, 'Royal Suite', '05-01', 5000000.00, 4),
(73, 1, 'Presidential', '05-02', 8000000.00, 6),
(74, 2, 'Standard', '01-01', 1500000.00, 2),
(75, 2, 'Standard', '01-02', 1500000.00, 2),
(76, 2, 'Deluxe Ocean View', '02-01', 2200000.00, 2),
(77, 2, 'Deluxe Ocean View', '02-02', 2200000.00, 2),
(78, 2, 'Villa', '03-01', 4500000.00, 4),
(79, 2, 'Villa', '03-02', 4500000.00, 4),
(80, 2, 'Private Pool Villa', '04-01', 7500000.00, 4),
(81, 2, 'Royal Villa', '04-02', 12000000.00, 6),
(94, 4, 'Standard', '001', 550000.00, 2),
(95, 4, 'Standard', '002', 550000.00, 2),
(96, 4, 'Deluxe', '003', 850000.00, 2),
(97, 4, 'Deluxe', '004', 850000.00, 2),
(98, 4, 'Diver Package', '005', 1200000.00, 2),
(99, 4, 'Family Room', '006', 1500000.00, 4),
(112, 3, 'Standard', '01-01', 650000.00, 2),
(113, 3, 'Standard', '01-02', 650000.00, 2),
(114, 3, 'Standard', '02-01', 650000.00, 2),
(115, 3, 'Standard', '02-02', 650000.00, 2),
(116, 3, 'Deluxe', '03-01', 900000.00, 2),
(117, 3, 'Deluxe', '04-01', 900000.00, 2),
(118, 3, 'Deluxe', '05-01', 900000.00, 2),
(119, 3, 'Adventure', '06-01', 1200000.00, 3),
(120, 3, 'Adventure', '07-01', 1200000.00, 3),
(121, 3, 'VIP', '08-01', 1800000.00, 3),
(122, 3, 'VIP', '08-02', 1800000.00, 3),
(123, 3, 'Suite', '08-03', 2500000.00, 4),
(124, 3, 'Honeymoon', '08-04', 3000000.00, 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','super_admin') NOT NULL DEFAULT 'user',
  `hotel_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `password`, `role`, `hotel_id`, `created_at`) VALUES
(1, 'admin', 'luna@email.com', NULL, '$2b$10$5Wk5XZQUTvlD4oNjXQUUDej0O73EkYuYckJkDl50LHdixYu3wcepi', 'user', NULL, '2026-06-04 13:34:41'),
(7, 'haha', 'haha@email.com', NULL, '$2b$10$Q/M9Vp4h96.H0DQFetsaq.1aVGxW0.AUN4rQYkHktfJtpsrJROC4e', 'user', NULL, '2026-06-05 06:57:25'),
(13, 'rian', 'rian@gmail.com', NULL, '$2b$10$it7mODH2CaPv8WNAzRbw2OM.yMzZvN6TH5fkZ1CEUJ1ElKwN1pXzy', 'user', 1, '2026-06-12 19:27:42'),
(14, 'Rian Gans', 'ian@gmail.com', NULL, '$2b$10$j6UmYZmm5SFYG/65kAKM2.MIoQogzvZJKAsUbNeDr/mVsBE5v91ii', 'super_admin', 1, '2026-06-13 04:48:03'),
(15, 'origianl', 'ori@gmail.com', NULL, '$2b$10$AIadMDbjxKresFk.oaUmSuwniDz9pioZsMBJil/fmc8EqjPWyhQ1W', 'user', NULL, '2026-06-14 15:24:52'),
(16, 'lunari', 'lunari@gmail.com', NULL, '$2b$10$bI6NhjXTCwkUaR73LrMB9udeOVaPw9CGj6E9NXHwTE7gMg4uOjGYC', 'super_admin', 1, '2026-06-16 11:19:25'),
(17, 'una', 'una@gmail.com', NULL, '$2b$10$R6KB1P1fyl3x/PMBOaBzQ.KUjh7fDolq1PORx7.V8epqv2RasnLYK', 'user', NULL, '2026-06-17 14:02:50'),
(18, 'King ', '0110224211@student.nurulfikri.ac.id', NULL, '$2b$10$SHVziPRNK1rjAeij28q7j.a9mbWoYBaWCBvZ8N7l3foqaUlduligi', 'user', NULL, '2026-06-20 12:11:56');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indeks untuk tabel `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indeks untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`hotel_id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Indeks untuk tabel `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT untuk tabel `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
