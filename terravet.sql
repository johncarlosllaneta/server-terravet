-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2021 at 05:03 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `terravet`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `appointment_id` int(11) NOT NULL,
  `vetid` varchar(100) NOT NULL,
  `pet_owner_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `time_scheduled` varchar(50) NOT NULL,
  `date_scheduled` varchar(20) NOT NULL,
  `service_id` int(11) NOT NULL,
  `appointment_status` varchar(20) NOT NULL,
  `logs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`appointment_id`, `vetid`, `pet_owner_id`, `pet_id`, `time_scheduled`, `date_scheduled`, `service_id`, `appointment_status`, `logs`) VALUES
(21, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 58, 18, '10:00 AM - 11:00 AM', '2021-08-16', 18, 'Decline', '2021-08-16 19:17:56'),
(22, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 58, 19, '10:00 AM - 11:00 AM', '2021-08-19', 18, 'Pending', '2021-08-16 20:24:11'),
(23, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 58, 19, '01:00 PM - 02:00 PM', '2021-08-21', 19, 'Approved', '2021-08-16 19:17:52');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `history_id` int(11) NOT NULL,
  `type_of_transaction` varchar(50) NOT NULL,
  `pet_owner_id` int(11) NOT NULL,
  `vet_admin_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `date_and_time` datetime NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`history_id`, `type_of_transaction`, `pet_owner_id`, `vet_admin_id`, `appointment_id`, `date_and_time`, `remarks`) VALUES
(1, 'Pet Grooming', 58, 19, 3, '2021-06-01 17:31:33', '');

-- --------------------------------------------------------

--
-- Table structure for table `immunization_history`
--

CREATE TABLE `immunization_history` (
  `immunization_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `vaccine_name` varchar(300) NOT NULL,
  `againts` varchar(50) NOT NULL,
  `vaccine_number` varchar(20) NOT NULL,
  `manufacturer` varchar(50) NOT NULL,
  `appointment_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `medical_history`
--

CREATE TABLE `medical_history` (
  `medical_history_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `pet_name` varchar(50) NOT NULL,
  `Date` date NOT NULL,
  `Service_Type` varchar(100) NOT NULL,
  `vet_admin_id` int(11) NOT NULL,
  `vet_name` varchar(100) NOT NULL,
  `tests_performed` varchar(150) NOT NULL,
  `test_result` varchar(100) NOT NULL,
  `recommendation` varchar(300) NOT NULL,
  `medication` varchar(300) NOT NULL,
  `remarks` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `pet_owner_id` int(11) NOT NULL,
  `vetid` varchar(70) NOT NULL,
  `user_message` int(11) NOT NULL,
  `created_time_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message_content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `thread_id`, `pet_owner_id`, `vetid`, `user_message`, `created_time_date`, `message_content`) VALUES
(1, 1, 58, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 1, '2021-08-30 19:00:00', 'asdasdasdasdsda'),
(2, 1, 58, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 2, '2021-08-31 16:00:00', 'asdasdasdasdasdasdasdasd');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `pet_id` int(11) NOT NULL,
  `pet_owner_id` int(11) NOT NULL,
  `pet_owner_name` varchar(60) NOT NULL,
  `pet_name` varchar(50) NOT NULL,
  `type_of_pet` varchar(50) NOT NULL,
  `breed_of_pet` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `birth_day` date NOT NULL,
  `pet_picture` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`pet_id`, `pet_owner_id`, `pet_owner_name`, `pet_name`, `type_of_pet`, `breed_of_pet`, `gender`, `birth_day`, `pet_picture`) VALUES
(18, 58, 'Jhaycee Llaneta', 'Jake', 'Dog', 'Aspin', 'Male', '2019-08-07', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/elisa-kennemer-0TdrHK0po7I-unsplash.jpg?alt=media&token=0a0d77b3-0d86-44a4-83ea-60168c25bde5'),
(19, 58, 'Jhaycee Llaneta', 'Johnson', 'Dog', 'Aspin', 'Male', '2019-09-05', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/photo-1522276498395-f4f68f7f8454.jpg?alt=media&token=cc600a1d-ada3-4227-bb4a-2e139f33aa8a'),
(20, 75, 'John Carlos Llaneta', 'Sam', 'Cat', 'Persian Cat', 'Female', '2019-06-07', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/res.jpg?alt=media&token=048b0b97-0eb5-458a-b761-3a319de2e638');

-- --------------------------------------------------------

--
-- Table structure for table `pet_owners`
--

CREATE TABLE `pet_owners` (
  `pet_owner_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(70) NOT NULL,
  `name` varchar(20) NOT NULL,
  `address` varchar(50) NOT NULL,
  `contact_number` varchar(11) NOT NULL,
  `profilePicture` text NOT NULL,
  `created_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pet_owners`
--

INSERT INTO `pet_owners` (`pet_owner_id`, `email`, `password`, `name`, `address`, `contact_number`, `profilePicture`, `created_date`) VALUES
(58, 'john040717@gmail.com', '$2b$10$RBTlhZMnuf4KHhyn.4jhe.bRgKrZvq.DnEmzm5XoqLySobiWtL21m', 'Jhaycee Llaneta', '1601 Int.19 Fvarona St. Tondo, Manila', '09558264288', 'http://localhost:3001/profile/petowner/profile_petowner_1621987617668.jpg', '2021-06-02 18:53:08'),
(75, 'johnllaneta05@gmail.com', '$2b$10$sHzWHZBm9Sfg4TcQqs4H/edHSMcgs77eBcvt/VgLLIc752M.oeuPW', 'John Carlos Llaneta', '', '09558264299', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/1IMG_20210709_083300.jpg?alt=media&token=34e0e607-e549-424e-90fc-c09b2fd800e2', '2021-08-07 03:36:53');

-- --------------------------------------------------------

--
-- Table structure for table `pet_registry_for_vet`
--

CREATE TABLE `pet_registry_for_vet` (
  `pet_registry_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `vet_admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy`
--

CREATE TABLE `pharmacy` (
  `medicine_id` int(11) NOT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `medicine_description` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `price` int(11) NOT NULL,
  `vetid` varchar(100) NOT NULL,
  `medicine_image` varchar(200) NOT NULL,
  `med_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pharmacy`
--

INSERT INTO `pharmacy` (`medicine_id`, `medicine_name`, `medicine_description`, `status`, `price`, `vetid`, `medicine_image`, `med_id`) VALUES
(14, 'Heartgard (ivermectin/pyrantel)', 'Heartgard (ivermectin/pyrantel)\nFor Dogs 51 - 100 lbs\n6 Chewables', 1, 200, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Web%20capture_15-6-2021_234216_www.1800petmeds.com.jpeg?alt=media&token=8a5ed239-5445-4f11-b22d-565e97f62890', '93697429');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` varchar(70) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `product_desc` varchar(500) NOT NULL,
  `vetid` varchar(70) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `product_image` varchar(200) NOT NULL,
  `category` varchar(50) NOT NULL,
  `pet_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_desc`, `vetid`, `quantity`, `price`, `product_image`, `category`, `pet_type`) VALUES
('28528578', 'ZEE.DOG BLACK POOP BAG DISPENSER', 'Comes with 1 poop bag roll\nEasy to attach to the leash, does not bounce and bother while walking\nReflective rope with custom design\nHolds Zee.Dog poop-bags rolls, bags never jam\nEasy screw system for bag replacement', '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 50, 350, 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Web%20capture_20-8-2021_32238_www.petwarehouse.ph.jpeg?alt=media&token=7c33dd90-5caa-443d-a0d2-e1553e116765', 'Accessories', 'Dogs'),
('3006381', 'Royal Canin', 'Cat food for cats', '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 100, 450, 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Web%20capture_15-6-2021_221343_www.petwarehouse.ph.jpeg?alt=media&token=9eed0363-96ad-4512-8453-d38e11614cc4', 'Food', 'Cat'),
('30375976', 'Fancy Feast (Classic Pate)', 'Cat food that taste good', '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 100, 350, 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Web%20capture_15-6-2021_225219_www.petwarehouse.ph.jpeg?alt=media&token=88d85381-c5f2-45a0-8a23-e8f8d469fc7b', 'Food', 'Cat'),
('97946383', 'Heartgard', 'chewables for dogs like them', '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 300, 450, 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Web%20capture_15-6-2021_234216_www.1800petmeds.com.jpeg?alt=media&token=a91b6292-b711-46d7-9460-36e4ce152613', 'Food', 'Dog');

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `reserve_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `pet_owner_id` int(11) NOT NULL,
  `vetid` varchar(80) NOT NULL,
  `reserve_quantity` int(11) NOT NULL,
  `reservation_status` varchar(50) NOT NULL,
  `date_reserve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`reserve_id`, `product_id`, `pet_owner_id`, `vetid`, `reserve_quantity`, `reservation_status`, `date_reserve`) VALUES
(8, 97946383, 58, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 3, 'Pending', '2021-08-19 14:24:48'),
(9, 30375976, 58, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 2, 'Pending', '2021-08-19 16:04:11'),
(10, 3006381, 58, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 1, 'Pending', '2021-08-19 16:04:52');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(50) NOT NULL,
  `service_description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `service_fee` int(11) NOT NULL,
  `vetid` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `service_description`, `category`, `service_fee`, `vetid`) VALUES
(2, 'Pet Grooming (Dogs & Cats)', 'A professional grooming session typically consists of the dog being brushed, bathed, and dried, as well as trimmed or clipped. The groomer brushes or combs out mats before the bath, making it easier to lather the dog with shampoo. They clean the dog\'s ears to remove buildup and to check for signs of infection.', 'Pet Grooming', 500, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(3, 'Flea & Tick Control', 'fleas and ticks is a living parasite that effects your pet’s health. using this flea and ticks’ control to prevent skin and transmitting infections. ', 'Preventive Controls', 500, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(4, 'Heartworm Prevention', 'Pets may develop heart failure and the appearance of a swollen belly due to excess fluid in the abdomen. Dogs with large numbers of heartworms can develop a sudden blockages of blood flow within the heart leading to a life-threatening form of cardiovascular collapse. Heartworm Prevention helps your pet preventing this failure using treatment of veterinary clinics.', 'Preventive Controls', 600, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(6, 'Blood & Urine Testing', 'A blood in urine test is usually part of a typical urinalysis. In addition to checking for blood, a urinalysis measures other substance in the urine, including proteins, acid and sugar levels, cell fragments, and crystals. this testing helps your pets to make an immediate relief for their disease.', 'Preventive Controls', 500, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(8, 'Nail trimming', 'Nail trimming is essential for maintaining good health. If a pet\'s nails can grow, they will curl over into a spiral shape; walking will become increasingly painful. Uncut nails may curl so far that they pierce the paw pad, leading to infection and debilitating pain.', 'Pet Grooming', 500, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(10, 'Nail Trimming', 'Trimming of pet\'s nails', 'Pet grooming', 300, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(18, 'Anti rabies ', 'Antirabies for dogs and cats and any kinds of animals', 'Vaccination', 350, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai'),
(19, 'Blood testing', 'testing the blood of the pet', 'Pet Examination', 500, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai');

-- --------------------------------------------------------

--
-- Table structure for table `stock_in`
--

CREATE TABLE `stock_in` (
  `stock_in_id` int(11) NOT NULL,
  `vetid` varchar(80) NOT NULL,
  `product_id` int(11) NOT NULL,
  `stockin_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stockin_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stock_in`
--

INSERT INTO `stock_in` (`stock_in_id`, `vetid`, `product_id`, `stockin_date`, `stockin_quantity`) VALUES
(5, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', 30375976, '2021-08-18 17:54:02', 50);

-- --------------------------------------------------------

--
-- Table structure for table `stock_used`
--

CREATE TABLE `stock_used` (
  `stockused_id` int(11) NOT NULL,
  `vetid` int(11) NOT NULL,
  `product_id` varchar(80) NOT NULL,
  `stockused_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stockused_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stock_used`
--

INSERT INTO `stock_used` (`stockused_id`, `vetid`, `product_id`, `stockused_date`, `stockused_quantity`) VALUES
(1, 0, '3006381', '2021-08-18 17:54:14', 50);

-- --------------------------------------------------------

--
-- Table structure for table `system_administrator`
--

CREATE TABLE `system_administrator` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `name` varchar(50) NOT NULL,
  `profilePicture` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `system_administrator`
--

INSERT INTO `system_administrator` (`admin_id`, `email`, `password`, `name`, `profilePicture`) VALUES
(1, 'admin@gmail.com', '$2b$10$qrfPll4/KDZU1PLePJVKRuQrM7K5sHuPXbKb8Mz3vk8ae2EGNd.n.', 'admin', 'http://localhost:3001/profile/petowner/profile_petowner_1621552793508.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `thread`
--

CREATE TABLE `thread` (
  `thread_id` int(11) NOT NULL,
  `pet_owner_id` int(11) NOT NULL,
  `vetid` varchar(70) NOT NULL,
  `created_time_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `thread`
--

INSERT INTO `thread` (`thread_id`, `pet_owner_id`, `vetid`, `created_time_date`) VALUES
(1, 58, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai', '2021-09-01 06:35:51');

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `user_role_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `userrole` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`user_role_id`, `email`, `userrole`) VALUES
(2, 'admin@gmail.com', 3),
(4, 'john040717@gmail.com', 1),
(48, 'tricity@gmail.com', 2),
(74, 'animalhouse@gmail.com', 2),
(75, 'johnllaneta05@gmail.com', 1),
(76, 'westvalley@gmail.com', 2);

-- --------------------------------------------------------

--
-- Table structure for table `vaccination`
--

CREATE TABLE `vaccination` (
  `vaccination_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `vet_admin_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `weight` double NOT NULL,
  `againts` varchar(100) NOT NULL,
  `manufacturer` varchar(200) NOT NULL,
  `Lot. No.` int(11) NOT NULL,
  `vet_signature` varchar(150) NOT NULL,
  `lic_no` int(11) NOT NULL,
  `exp_date` date NOT NULL,
  `ptr` int(11) NOT NULL,
  `tin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vet_clinic`
--

CREATE TABLE `vet_clinic` (
  `vet_admin_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `vet_name` varchar(100) NOT NULL,
  `vet_address` varchar(50) NOT NULL,
  `vet_contact_number` varchar(11) NOT NULL,
  `vet_permit` varchar(255) NOT NULL,
  `vet_picture` varchar(255) NOT NULL,
  `vet_status` varchar(15) NOT NULL,
  `scheduleMonday` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `scheduleTuesday` varchar(50) NOT NULL,
  `scheduleWednesday` varchar(50) NOT NULL,
  `scheduleThursday` varchar(50) NOT NULL,
  `scheduleFriday` varchar(50) NOT NULL,
  `scheduleSaturday` varchar(50) NOT NULL,
  `scheduleSunday` varchar(50) NOT NULL,
  `enableProduct` tinyint(1) NOT NULL,
  `enablePharmacy` tinyint(1) NOT NULL,
  `enableServices` tinyint(1) NOT NULL,
  `enableConsultation` tinyint(1) NOT NULL,
  `enableExamination` tinyint(1) NOT NULL,
  `enableGrooming` tinyint(1) NOT NULL,
  `enableVaccination` tinyint(1) NOT NULL,
  `enablePreventiveControls` tinyint(1) NOT NULL,
  `enableInHouseLab` tinyint(1) NOT NULL,
  `vetid` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vet_clinic`
--

INSERT INTO `vet_clinic` (`vet_admin_id`, `email`, `password`, `vet_name`, `vet_address`, `vet_contact_number`, `vet_permit`, `vet_picture`, `vet_status`, `scheduleMonday`, `scheduleTuesday`, `scheduleWednesday`, `scheduleThursday`, `scheduleFriday`, `scheduleSaturday`, `scheduleSunday`, `enableProduct`, `enablePharmacy`, `enableServices`, `enableConsultation`, `enableExamination`, `enableGrooming`, `enableVaccination`, `enablePreventiveControls`, `enableInHouseLab`, `vetid`) VALUES
(19, 'tricity@gmail.com', '$2b$10$9i2h.drYBR5hqXnv1zgr3evSS3s6Fi/rq97RdxjS/H.Wj1xLmnhbm', 'Tri-City Animal Hospital', '1942 Int. 5 Blk 10 Sta.Mesa, Manila', '09786365800', 'http://localhost:3001/vet/permit/vet_permit_1621724069477.jpg', 'http://localhost:3001/profile/vet/profile_vet_1621716387728.jpg', 'Verified', '09:00 - 17:00', '08:00 - 17:00', '08:00 - 17:00', '08:00 - 17:00', '08:00 - 17:00', '08:00 - 17:00', '08:30 - 17:30', 1, 0, 1, 1, 1, 1, 1, 1, 0, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhbc'),
(27, 'animalhouse@gmail.com', '$2b$10$54fDvasYHYzCg65QlFVQmu/EcHS/j3Q4s8eL6z.xycwEVSLddfjyq', 'Animal House Vet Clinic', '1602 int 5 F varona Street, Tondo,Manila', '09558261232', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Letter-to-the-Client-Signed.pdf?alt=media&token=b8e535fc-b41d-4aa9-9334-6a23c4fc351a', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Screen-Shot-2020-11-19-at-10.39.49-PM.png?alt=media&token=eb67c2d4-80f8-4fd1-bbc4-34961609fa5a', 'Unverified', '', '', '', '', '', '', '', 1, 1, 1, 1, 1, 1, 1, 1, 0, ''),
(28, 'westvalley@gmail.com', '$2b$10$L68mQGeYEoFlBAVtYCJBZOKLr08agfMDD0igxzWpaZtByT8rzNdV.', 'West Valley Animal Clinic', '1241 blk. 15 Velasquez Street,Tondo, Manila', '09081052103', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/Letter-to-the-Client-Signed.pdf?alt=media&token=5b6c9bfc-8c86-472f-a436-3c2b392ecf4b', 'https://firebasestorage.googleapis.com/v0/b/terravet-website.appspot.com/o/images.png?alt=media&token=a79fd71a-d4d2-4a2f-9a00-e7f9bd24afde', 'Verified', '', '', '', '', '', '', '', 1, 1, 1, 1, 1, 1, 1, 1, 1, '$2b$10$4RujGwsxeIvMLoeOjX6PYOShX5Xl5sA5A72yHDYdjBLjRWLyhLhai');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `pet_owner_id` (`pet_owner_id`),
  ADD KEY `vet_admin_id` (`vetid`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `vet_admin_id` (`vet_admin_id`),
  ADD KEY `pet_owner_id` (`pet_owner_id`);

--
-- Indexes for table `immunization_history`
--
ALTER TABLE `immunization_history`
  ADD PRIMARY KEY (`immunization_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD PRIMARY KEY (`medical_history_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `pet_owner_id` (`pet_owner_id`),
  ADD KEY `vetid` (`vetid`),
  ADD KEY `thread_id` (`thread_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`pet_id`),
  ADD KEY `pet_owner_id` (`pet_owner_id`);

--
-- Indexes for table `pet_owners`
--
ALTER TABLE `pet_owners`
  ADD PRIMARY KEY (`pet_owner_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pet_registry_for_vet`
--
ALTER TABLE `pet_registry_for_vet`
  ADD PRIMARY KEY (`pet_registry_id`),
  ADD UNIQUE KEY `pet_id` (`pet_id`),
  ADD KEY `vet_admin_id` (`vet_admin_id`);

--
-- Indexes for table `pharmacy`
--
ALTER TABLE `pharmacy`
  ADD PRIMARY KEY (`medicine_id`),
  ADD UNIQUE KEY `med_id` (`med_id`),
  ADD KEY `vetid` (`vetid`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `vet_admin_id` (`vetid`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reserve_id`),
  ADD KEY `pet_owner_id` (`pet_owner_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `vet_admin_id` (`vetid`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `vetid` (`vetid`);

--
-- Indexes for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD PRIMARY KEY (`stock_in_id`);

--
-- Indexes for table `stock_used`
--
ALTER TABLE `stock_used`
  ADD PRIMARY KEY (`stockused_id`);

--
-- Indexes for table `system_administrator`
--
ALTER TABLE `system_administrator`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `thread`
--
ALTER TABLE `thread`
  ADD PRIMARY KEY (`thread_id`),
  ADD KEY `pet_owner_id` (`pet_owner_id`),
  ADD KEY `vet_admin_id` (`vetid`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`user_role_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vaccination`
--
ALTER TABLE `vaccination`
  ADD PRIMARY KEY (`vaccination_id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `vet_admin_id` (`vet_admin_id`);

--
-- Indexes for table `vet_clinic`
--
ALTER TABLE `vet_clinic`
  ADD PRIMARY KEY (`vet_admin_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `vetid` (`vetid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `immunization_history`
--
ALTER TABLE `immunization_history`
  MODIFY `immunization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medical_history`
--
ALTER TABLE `medical_history`
  MODIFY `medical_history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `pet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pet_owners`
--
ALTER TABLE `pet_owners`
  MODIFY `pet_owner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `pet_registry_for_vet`
--
ALTER TABLE `pet_registry_for_vet`
  MODIFY `pet_registry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pharmacy`
--
ALTER TABLE `pharmacy`
  MODIFY `medicine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reserve_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `stock_in`
--
ALTER TABLE `stock_in`
  MODIFY `stock_in_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock_used`
--
ALTER TABLE `stock_used`
  MODIFY `stockused_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `thread`
--
ALTER TABLE `thread`
  MODIFY `thread_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `user_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `vaccination`
--
ALTER TABLE `vaccination`
  MODIFY `vaccination_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vet_clinic`
--
ALTER TABLE `vet_clinic`
  MODIFY `vet_admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`vetid`) REFERENCES `vet_clinic` (`vetid`);

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`vet_admin_id`) REFERENCES `vet_clinic` (`vet_admin_id`),
  ADD CONSTRAINT `history_ibfk_2` FOREIGN KEY (`pet_owner_id`) REFERENCES `pet_owners` (`pet_owner_id`);

--
-- Constraints for table `immunization_history`
--
ALTER TABLE `immunization_history`
  ADD CONSTRAINT `immunization_history_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`),
  ADD CONSTRAINT `immunization_history_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`);

--
-- Constraints for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD CONSTRAINT `medical_history_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`pet_owner_id`) REFERENCES `pet_owners` (`pet_owner_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`vetid`) REFERENCES `vet_clinic` (`vetid`),
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`thread_id`);

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`pet_owner_id`) REFERENCES `pet_owners` (`pet_owner_id`);

--
-- Constraints for table `pet_registry_for_vet`
--
ALTER TABLE `pet_registry_for_vet`
  ADD CONSTRAINT `pet_registry_for_vet_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`),
  ADD CONSTRAINT `pet_registry_for_vet_ibfk_2` FOREIGN KEY (`vet_admin_id`) REFERENCES `vet_clinic` (`vet_admin_id`);

--
-- Constraints for table `pharmacy`
--
ALTER TABLE `pharmacy`
  ADD CONSTRAINT `pharmacy_ibfk_1` FOREIGN KEY (`vetid`) REFERENCES `vet_clinic` (`vetid`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`vetid`) REFERENCES `vet_clinic` (`vetid`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`vetid`) REFERENCES `vet_clinic` (`vetid`);

--
-- Constraints for table `thread`
--
ALTER TABLE `thread`
  ADD CONSTRAINT `thread_ibfk_1` FOREIGN KEY (`pet_owner_id`) REFERENCES `pet_owners` (`pet_owner_id`),
  ADD CONSTRAINT `thread_ibfk_2` FOREIGN KEY (`vetid`) REFERENCES `vet_clinic` (`vetid`);

--
-- Constraints for table `vaccination`
--
ALTER TABLE `vaccination`
  ADD CONSTRAINT `vaccination_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`),
  ADD CONSTRAINT `vaccination_ibfk_2` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`),
  ADD CONSTRAINT `vaccination_ibfk_3` FOREIGN KEY (`vet_admin_id`) REFERENCES `vet_clinic` (`vet_admin_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
