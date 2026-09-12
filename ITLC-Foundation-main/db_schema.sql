-- ============================================================================
-- ITLC FOUNDATION - PRODUCTION DATABASE SCHEMA (24 TABLES)
-- Database Name: itlc_foundation
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `itlc_foundation` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `itlc_foundation`;

-- ============================================================================
-- 1. ADMIN & SECURITY TABLES
-- ============================================================================

-- Table 1: admins (SuperAdmin, SubAdmin, Content Editor, Accountant)
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'sub_admin', 'content_editor', 'accountant') NOT NULL DEFAULT 'sub_admin',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_login_at` DATETIME DEFAULT NULL,
    `last_login_ip` VARCHAR(45) DEFAULT NULL,
    `password_changed_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_admin_role` (`role`),
    INDEX `idx_admin_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: admin_sessions
CREATE TABLE IF NOT EXISTS `admin_sessions` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `admin_id` INT UNSIGNED NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL UNIQUE,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `expires_at` DATETIME NOT NULL,
    `revoked_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
    INDEX `idx_admin_session` (`admin_id`, `expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: admin_activity_logs
CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `admin_id` INT UNSIGNED DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) DEFAULT NULL,
    `entity_id` BIGINT UNSIGNED DEFAULT NULL,
    `details_json` JSON DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
    INDEX `idx_activity_entity` (`entity_type`, `entity_id`),
    INDEX `idx_activity_admin` (`admin_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. CMS TABLES (PAGES, SECTIONS & FAQS)
-- ============================================================================

-- Table 4: cms_pages
CREATE TABLE IF NOT EXISTS `cms_pages` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `page_key` VARCHAR(100) NOT NULL UNIQUE,
    `page_name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `page_type` ENUM('core', 'listing', 'service', 'legal') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `hero_title` VARCHAR(255) DEFAULT NULL,
    `hero_description` TEXT DEFAULT NULL,
    `hero_image_desktop` VARCHAR(500) DEFAULT NULL,
    `hero_image_mobile` VARCHAR(500) DEFAULT NULL,
    `meta_title` VARCHAR(255) DEFAULT NULL,
    `meta_description` VARCHAR(320) DEFAULT NULL,
    `meta_keywords` TEXT DEFAULT NULL,
    `canonical_url` VARCHAR(500) DEFAULT NULL,
    `og_title` VARCHAR(255) DEFAULT NULL,
    `og_description` TEXT DEFAULT NULL,
    `og_image` VARCHAR(500) DEFAULT NULL,
    `seo_index` TINYINT(1) NOT NULL DEFAULT 1,
    `ads_enabled` TINYINT(1) NOT NULL DEFAULT 0,
    `status` ENUM('draft', 'scheduled', 'published', 'archived') NOT NULL DEFAULT 'published',
    `scheduled_at` DATETIME DEFAULT NULL,
    `published_at` DATETIME DEFAULT NULL,
    `updated_by` INT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`updated_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
    INDEX `idx_cms_status` (`status`),
    INDEX `idx_cms_type` (`page_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 5: cms_sections
CREATE TABLE IF NOT EXISTS `cms_sections` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `page_id` BIGINT UNSIGNED NOT NULL,
    `section_key` VARCHAR(100) NOT NULL,
    `section_type` ENUM(
        'hero', 'rich_text', 'cards', 'stats', 'gallery', 'video',
        'projects', 'blogs', 'team', 'testimonials', 'faq',
        'donation_cta', 'volunteer_cta', 'contact', 'custom'
    ) NOT NULL,
    `heading` VARCHAR(255) DEFAULT NULL,
    `subheading` TEXT DEFAULT NULL,
    `content_json` JSON DEFAULT NULL,
    `background_color` VARCHAR(50) DEFAULT NULL,
    `background_image` VARCHAR(500) DEFAULT NULL,
    `design_style` VARCHAR(50) DEFAULT 'default',
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`page_id`) REFERENCES `cms_pages`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_page_section` (`page_id`, `section_key`),
    INDEX `idx_section_display` (`page_id`, `is_enabled`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 6: page_faqs
CREATE TABLE IF NOT EXISTS `page_faqs` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `page_id` BIGINT UNSIGNED NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`page_id`) REFERENCES `cms_pages`(`id`) ON DELETE CASCADE,
    INDEX `idx_page_faq` (`page_id`, `is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. BLOG TABLES
-- ============================================================================

-- Table 7: blog_categories
CREATE TABLE IF NOT EXISTS `blog_categories` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `description` TEXT DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 8: blogs
CREATE TABLE IF NOT EXISTS `blogs` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT UNSIGNED DEFAULT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `author` VARCHAR(100) DEFAULT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `images_json` JSON DEFAULT NULL,
    `content_image_url` VARCHAR(500) DEFAULT NULL,
    `content` LONGTEXT NOT NULL,
    `tags_json` JSON DEFAULT NULL,
    `key_points_json` JSON DEFAULT NULL,
    `read_time` VARCHAR(50) DEFAULT '6 min read',
    `design_style` VARCHAR(50) DEFAULT 'default',
    `meta_title` VARCHAR(255) DEFAULT NULL,
    `meta_description` VARCHAR(320) DEFAULT NULL,
    `meta_keywords` TEXT DEFAULT NULL,
    `canonical_url` VARCHAR(500) DEFAULT NULL,
    `og_title` VARCHAR(255) DEFAULT NULL,
    `og_description` TEXT DEFAULT NULL,
    `og_image_url` VARCHAR(500) DEFAULT NULL,
    `seo_index` TINYINT(1) NOT NULL DEFAULT 1,
    `status` ENUM('draft', 'scheduled', 'published', 'archived') NOT NULL DEFAULT 'published',
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `scheduled_at` DATETIME DEFAULT NULL,
    `published_at` DATETIME DEFAULT NULL,
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
    INDEX `idx_blog_status` (`status`, `published_at`),
    INDEX `idx_blog_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 9: blog_faqs
CREATE TABLE IF NOT EXISTS `blog_faqs` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `blog_id` BIGINT UNSIGNED NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON DELETE CASCADE,
    INDEX `idx_blog_faq` (`blog_id`, `is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. PROJECT TABLES
-- ============================================================================

-- Table 10: key_projects
CREATE TABLE IF NOT EXISTS `key_projects` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `status` ENUM('upcoming', 'ongoing', 'completed', 'paused') NOT NULL DEFAULT 'ongoing',
    `location` VARCHAR(150) DEFAULT 'Lucknow, Uttar Pradesh',
    `short_description` TEXT DEFAULT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `why_it_matters` TEXT DEFAULT NULL,
    `about_markdown` LONGTEXT DEFAULT NULL,
    `objectives_json` JSON DEFAULT NULL,
    `activities_json` JSON DEFAULT NULL,
    `stats_json` JSON DEFAULT NULL,
    `gallery_json` JSON DEFAULT NULL,
    `video_url` VARCHAR(500) DEFAULT NULL,
    `donation_enabled` TINYINT(1) NOT NULL DEFAULT 1,
    `one_time_enabled` TINYINT(1) NOT NULL DEFAULT 1,
    `monthly_enabled` TINYINT(1) NOT NULL DEFAULT 0,
    `custom_amount_enabled` TINYINT(1) NOT NULL DEFAULT 1,
    `minimum_donation` DECIMAL(12,2) DEFAULT 100.00,
    `suggested_amounts_json` JSON DEFAULT NULL,
    `donation_button_text` VARCHAR(100) DEFAULT 'Support This Mission',
    `volunteer_enabled` TINYINT(1) NOT NULL DEFAULT 1,
    `volunteer_button_text` VARCHAR(100) DEFAULT 'Join as Volunteer',
    `fundraising_goal` DECIMAL(12,2) DEFAULT NULL,
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `publish_status` ENUM('draft', 'scheduled', 'published', 'archived') NOT NULL DEFAULT 'published',
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    `scheduled_at` DATETIME DEFAULT NULL,
    `published_at` DATETIME DEFAULT NULL,
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
    INDEX `idx_project_status` (`status`),
    INDEX `idx_project_publish` (`publish_status`, `published_at`),
    INDEX `idx_project_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 11: project_faqs
CREATE TABLE IF NOT EXISTS `project_faqs` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (`project_id`) REFERENCES `key_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 12: project_updates
CREATE TABLE IF NOT EXISTS `project_updates` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `update_date` DATE NOT NULL,
    `is_published` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `key_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. DONATIONS & PAYMENT TABLES
-- ============================================================================

-- Table 13: subscriptions (Must be created before donations)
CREATE TABLE IF NOT EXISTS `subscriptions` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `donor_name` VARCHAR(100) NOT NULL,
    `donor_email` VARCHAR(150) NOT NULL,
    `donor_phone` VARCHAR(20) DEFAULT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `status` ENUM('created', 'active', 'paused', 'cancelled', 'completed') NOT NULL DEFAULT 'created',
    `razorpay_plan_id` VARCHAR(100) DEFAULT NULL,
    `razorpay_subscription_id` VARCHAR(100) NOT NULL UNIQUE,
    `started_at` DATETIME DEFAULT NULL,
    `next_charge_at` DATETIME DEFAULT NULL,
    `cancelled_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 14: donations
CREATE TABLE IF NOT EXISTS `donations` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED DEFAULT NULL,
    `subscription_id` BIGINT UNSIGNED DEFAULT NULL,
    `receipt_number` VARCHAR(50) DEFAULT NULL UNIQUE,
    `donor_name` VARCHAR(100) NOT NULL,
    `donor_email` VARCHAR(150) NOT NULL,
    `donor_phone` VARCHAR(20) DEFAULT NULL,
    `donor_pan` VARCHAR(20) DEFAULT NULL,
    `donor_address` TEXT DEFAULT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `donation_type` ENUM('one_time', 'monthly') NOT NULL DEFAULT 'one_time',
    `payment_status` ENUM('created', 'pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'created',
    `payment_method` VARCHAR(50) DEFAULT 'UPI',
    `razorpay_order_id` VARCHAR(100) DEFAULT NULL UNIQUE,
    `razorpay_payment_id` VARCHAR(100) DEFAULT NULL UNIQUE,
    `razorpay_signature` VARCHAR(255) DEFAULT NULL,
    `payment_verified_at` DATETIME DEFAULT NULL,
    `receipt_url` VARCHAR(500) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `key_projects`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL,
    INDEX `idx_donation_status` (`payment_status`),
    INDEX `idx_donation_email` (`donor_email`),
    INDEX `idx_donation_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 15: payment_webhooks
CREATE TABLE IF NOT EXISTS `payment_webhooks` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `provider` VARCHAR(30) NOT NULL DEFAULT 'razorpay',
    `event_id` VARCHAR(150) DEFAULT NULL UNIQUE,
    `event_type` VARCHAR(100) NOT NULL,
    `payload_json` JSON NOT NULL,
    `signature` VARCHAR(255) DEFAULT NULL,
    `verification_status` ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
    `processed_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. VOLUNTEER & CONTACT TABLES
-- ============================================================================

-- Table 16: volunteers
CREATE TABLE IF NOT EXISTS `volunteers` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `city` VARCHAR(100) DEFAULT 'Lucknow',
    `interests` JSON DEFAULT NULL,
    `message` TEXT DEFAULT NULL,
    `application_status` ENUM('new', 'contacted', 'approved', 'rejected') NOT NULL DEFAULT 'new',
    `admin_notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_volunteer_status` (`application_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 17: contact_inquiries
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `subject` VARCHAR(255) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'read', 'replied', 'closed') NOT NULL DEFAULT 'new',
    `admin_notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_contact_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. GALLERY & MEDIA TABLES
-- ============================================================================

-- Table 18: gallery_albums
CREATE TABLE IF NOT EXISTS `gallery_albums` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `category` VARCHAR(100) DEFAULT 'General',
    `description` TEXT DEFAULT NULL,
    `cover_image` VARCHAR(500) NOT NULL,
    `event_date` DATE DEFAULT NULL,
    `location` VARCHAR(150) DEFAULT 'Lucknow',
    `is_published` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 19: gallery_images
CREATE TABLE IF NOT EXISTS `gallery_images` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `album_id` BIGINT UNSIGNED NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `title` VARCHAR(255) DEFAULT NULL,
    `caption` TEXT DEFAULT NULL,
    `alt_text` VARCHAR(255) DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 20: media_library
CREATE TABLE IF NOT EXISTS `media_library` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `file_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `mime_type` VARCHAR(100) DEFAULT NULL,
    `file_size` BIGINT UNSIGNED DEFAULT NULL,
    `alt_text` VARCHAR(255) DEFAULT NULL,
    `uploaded_by` INT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`uploaded_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. ADVERTISEMENT TABLE
-- ============================================================================

-- Table 21: ad_slots
CREATE TABLE IF NOT EXISTS `ad_slots` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `ad_type` ENUM('adsense', 'image', 'html', 'internal', 'video') NOT NULL DEFAULT 'adsense',
    `page_type` ENUM(
        'all', 'home', 'blog_listing', 'blog_detail', 'project_listing',
        'project_detail', 'service', 'donate', 'gallery', 'custom'
    ) NOT NULL DEFAULT 'all',
    `page_identifier` VARCHAR(255) DEFAULT NULL,
    `placement` ENUM(
        'header', 'below_hero', 'content_top', 'after_paragraph',
        'content_middle', 'sidebar', 'before_faq', 'after_faq',
        'content_bottom', 'footer', 'mobile_sticky'
    ) NOT NULL DEFAULT 'content_top',
    `after_paragraph_number` INT DEFAULT NULL,
    `ad_code` LONGTEXT DEFAULT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `destination_url` VARCHAR(500) DEFAULT NULL,
    `alt_text` VARCHAR(255) DEFAULT NULL,
    `device_target` ENUM('all', 'desktop', 'mobile') NOT NULL DEFAULT 'all',
    `priority` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 0,
    `start_at` DATETIME DEFAULT NULL,
    `end_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ad_display` (`page_type`, `placement`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. GLOBAL SETTINGS, TEAM & STATS TABLES
-- ============================================================================

-- Table 22: site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `setting_key` VARCHAR(150) NOT NULL UNIQUE,
    `setting_value` LONGTEXT DEFAULT NULL,
    `value_type` ENUM('text', 'number', 'boolean', 'json', 'image') NOT NULL DEFAULT 'text',
    `is_public` TINYINT(1) NOT NULL DEFAULT 0,
    `updated_by` INT UNSIGNED DEFAULT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`updated_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 23: team_members
CREATE TABLE IF NOT EXISTS `team_members` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(150) NOT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `bio` TEXT DEFAULT NULL,
    `social_links_json` JSON DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 24: impact_stats
CREATE TABLE IF NOT EXISTS `impact_stats` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `label` VARCHAR(150) NOT NULL,
    `value` VARCHAR(50) NOT NULL,
    `suffix` VARCHAR(20) DEFAULT NULL,
    `icon` VARCHAR(100) DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. INITIAL SEED DATA
-- ============================================================================

-- Seed Default Admins
INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`) VALUES 
(1, 'admin', 'info@itlcfoundation.org', '$2y$10$Rr.hVYjY8oHglnVjjJ9hLep4vkYlcgVJ757LdetAtuhf1NxciUC5m', 'super_admin', 1)
ON DUPLICATE KEY UPDATE `role` = 'super_admin';

-- Seed Blog Categories
INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Environment Protection', 'environment-protection', 'Afforestation, seed balls, pollution mitigation, and native canopy restoration in Uttar Pradesh.'),
(2, 'Animal Welfare', 'animal-welfare', 'Stray rescue, emergency veterinary care, sterilization, and community animal feeding.'),
(3, 'Women Empowerment', 'women-empowerment', 'Skill development, sewing centers, financial independence, and SHGs in rural UP.'),
(4, 'Education Support', 'education-support', 'Slum children tuition centers, digital literacy, and school kit distribution.'),
(5, 'Clean Water & Sanitation', 'clean-water-sanitation', 'Safe drinking water handpumps, filtration, and hygiene awareness.'),
(6, 'Social Welfare', 'social-welfare', 'Community relief, ration bags, medical health camps, and winter blanket drives.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Impact Stats
INSERT INTO `impact_stats` (`label`, `value`, `suffix`, `icon`, `sort_order`) VALUES
('Lives Impacted & Benefited', '50,000+', NULL, 'Users', 1),
('Native Trees Planted', '25,000+', NULL, 'Leaf', 2),
('Animals Rescued & Treated', '3,500+', NULL, 'Heart', 3),
('Women Economically Empowered', '1,200+', NULL, 'Sparkles', 4);

-- Seed Team Members
INSERT INTO `team_members` (`name`, `designation`, `image_url`, `bio`, `sort_order`) VALUES
('Pankaj Kumar', 'Founder & Director', '/pro/ab.png', 'Passionate humanitarian and environmentalist leading grassroots initiatives across Lucknow and Uttar Pradesh.', 1),
('Sunita Sharma', 'Head of Women Empowerment Wing', '/pro/ser.png', 'Community social worker managing vocational centers and self-help groups for rural women.', 2),
('Dr. R. K. Verma', 'Senior Veterinary Consultant', '/pro/ani.png', 'Veterinary doctor overseeing mobile medical units and animal rescue emergency treatments.', 3);

-- Seed Core & Focus CMS Pages
INSERT INTO `cms_pages` (`page_key`,`page_name`,`slug`,`page_type`,`title`,`meta_title`,`meta_description`,`status`) VALUES
('home', 'Home Page', '/', 'core', 'ITLC Foundation - Reclaiming Nature, Empowering Lives', 'ITLC Foundation Lucknow | Top NGO in Uttar Pradesh', 'Leading humanitarian and environmental NGO in Lucknow, Uttar Pradesh. Working in tree plantation, stray animal welfare, women empowerment, and child education.', 'published'),
('about', 'About Us', '/about', 'core', 'About Our Foundation - A Leading NGO in Lucknow', 'About ITLC Foundation | Mission, Vision & Impact', 'Learn about ITLC Foundation, our dedicated volunteers, grassroots journey, and transparency in social welfare across Uttar Pradesh.', 'published'),
('projects', 'Our Projects', '/projects', 'listing', 'Creating Meaningful Change Across Uttar Pradesh', 'Our Projects & Drives | ITLC Foundation Lucknow', 'Explore all active environmental, animal welfare, women empowerment, and educational projects run by ITLC Foundation.', 'published'),
('services', 'Services & Causes', '/services', 'listing', 'Our Focus Areas & Initiatives in Lucknow', 'Focus Areas & Cause Programs | ITLC Foundation', 'Explore all 6 core intervention pillars: Environmental Protection, Animal Rescue, Women Empowerment, Education, Clean Water, and Social Welfare.', 'published'),
('gallery', 'Photo Gallery', '/gallery', 'listing', 'Ground Reality: Field Photos & Visual Archives', 'Photo Gallery & Ground Impact | ITLC Foundation', 'High-definition photography from tree planting drives, stray dog emergency feeding, and women vocational centers in UP.', 'published'),
('blog', 'Blog & Insights', '/blog', 'listing', 'Latest Updates, Field Insights & Community Stories', 'ITLC Blog & News | Stories of Change in Lucknow', 'Read verified articles and on-ground field logs about ecological conservation, animal rescue, and women empowerment.', 'published'),
('donate', 'Donate Now', '/donate', 'core', 'Support Our Grassroots Work in Lucknow', 'Donate to ITLC Foundation | 80G Tax Exemption', 'Make a tax-exempt donation under section 80G to support tree planting, hungry stray animals, and underprivileged school children.', 'published'),
('volunteer', 'Volunteer With Us', '/volunteer', 'core', 'Join Hands for a Greener, Kinder Uttar Pradesh', 'Volunteer Registration | ITLC Foundation Lucknow', 'Sign up as an on-ground volunteer to participate in weekend tree planting, animal feeding, and children teaching drives.', 'published'),
('transparency', 'Transparency & Governance', '/transparency', 'core', 'Transparency, Financial Reports & Trust', 'NGO Transparency & 80G Certificates | ITLC Foundation', 'Access our official registration certificates, 80G tax exemption, donation utilization reports, and annual statements.', 'published'),
('contact', 'Contact Us', '/contact', 'core', 'Get in Touch with ITLC Foundation Lucknow', 'Contact ITLC Foundation | Office Address & Phone', 'Reach out to our Lucknow headquarters for CSR partnerships, volunteer opportunities, and emergency rescues.', 'published'),
('paryavaran-sanrakshan', 'Environment Welfare', '/paryavaran-sanrakshan', 'service', 'Environmental Protection in Uttar Pradesh', 'Tree Plantation & Environmental NGO in Lucknow', 'Afforestation, native trees, and clean air initiatives across urban and rural Uttar Pradesh.', 'published'),
('animal-welfare', 'Animal Welfare', '/animal-welfare', 'service', 'Stray Animal Rescue & Welfare in Lucknow', 'Stray Animal Rescue NGO Lucknow | 24/7 Veterinary Aid', 'Emergency veterinary care, reflective safety collars, and daily street feeding for community animals.', 'published'),
('women-empowerment', 'Women Empowerment', '/women-empowerment', 'service', 'Women Empowerment & Vocational Training', 'Women Vocational Centers Lucknow | Self-Help Groups', 'Vocational tailoring, digital literacy, and self-employment for rural women in UP.', 'published'),
('education', 'Education Support', '/education', 'service', 'Education Support for Slum Children', 'Free Education NGO in Lucknow | School Kit Distribution', 'Remedial learning centers, school supplies, and RTE admissions for first-generation learners in UP.', 'published'),
('clean-water', 'Clean Water & Sanitation', '/clean-water', 'service', 'Clean Water & Sanitation Campaign', 'Clean Drinking Water Projects in Rural Uttar Pradesh', 'Borewell handpump restoration, bio-sand filters, and community WASH awareness.', 'published'),
('social-welfare', 'Social Welfare in UP', '/social-welfare', 'service', 'Community Social Welfare & Relief Drives', 'Social Welfare NGO Lucknow | Winter Relief & Ration Kits', 'Emergency dry ration kits, winter blankets, and free health checkups across Lucknow and peripheral UP.', 'published'),
('privacy-policy', 'Privacy Policy', '/privacy-policy', 'legal', 'Privacy Policy | ITLC Foundation', 'Privacy Policy & Data Security | ITLC Foundation', 'Official data protection, cookies disclosure, and Section 80G donor privacy guidelines.', 'published'),
('terms-and-conditions', 'Terms & Conditions', '/terms-and-conditions', 'legal', 'Terms and Conditions | ITLC Foundation', 'Website Terms of Use & Policies | ITLC Foundation', 'Governing terms of portal usage, non-commercial reproduction, and donor compliance.', 'published'),
('disclaimer', 'Disclaimer', '/disclaimer', 'legal', 'Legal & Non-Profit Disclaimer | ITLC Foundation', 'Legal & Tax Exemption Disclaimer | ITLC Foundation', 'Non-profit disclaimer, Section 80G tax rules, and informational scope.', 'published'),
('cookie-policy', 'Cookie Policy', '/cookie-policy', 'legal', 'Cookie Policy | ITLC Foundation', 'Cookie Policy & Web Tracking Disclosure | ITLC Foundation', 'Explanation of essential cookies, Google AdSense cookies, and user preferences.', 'published'),
('refund-policy', 'Donation & Refund Policy', '/refund-policy', 'legal', 'Donation & Refund Policy | ITLC Foundation', 'Donation Refund Policy | 7-Day Reversal Terms', 'Guidelines on duplicate debit reversals, tax-exemption receipts, and donor terms.', 'published'),
('sitemap-page', 'Website Sitemap', '/sitemap-page', 'core', 'HTML Website Directory & Sitemap | ITLC Foundation', 'Complete Website Directory | ITLC Foundation Lucknow', 'Index of all focus areas, causes, projects, and legal pages on itlcfoundation.com.', 'published')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `meta_title` = VALUES(`meta_title`), `meta_description` = VALUES(`meta_description`);


-- Seed Site Settings (SEO, Analytics, GTM, Payment & Brand Configuration)
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `value_type`, `is_public`) VALUES
('canonical_site_url', 'https://itlcfoundation.com', 'text', 1),
('sitemap_url', 'https://itlcfoundation.com/sitemap.xml', 'text', 1),
('robots_url', 'https://itlcfoundation.com/robots.txt', 'text', 1),
('google_site_verification', 'PGhV84C11AofLbbgcqGSqWfOF6Su5x10bykyx3E3Ptg', 'text', 1),
('google_tag_manager_id', 'GTM-WZZ54M84', 'text', 1),
('google_adsense_id', 'ca-pub-5020716602157264', 'text', 1),
('official_email', 'info@itlcfoundation.com', 'text', 1),
('donation_email', 'donation@itlcfoundation.com', 'text', 1),
('helpline_phone', '+91 94150 00000', 'text', 1),
('donate_upi_id', 'itlcpa@upi', 'text', 1),
('donate_qr_image', '/qr.png', 'image', 1),
('donation_modal_qr_image', '/qr.png', 'image', 1),
('headquarters_address', 'G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030', 'text', 1)
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- Seed Default Ad Slots
INSERT INTO `ad_slots` (`name`, `ad_type`, `page_type`, `placement`, `is_active`) VALUES
('Blog Top Ad Banner', 'adsense', 'blog_detail', 'content_top', 0),
('Blog In-Article Mid Ad', 'adsense', 'blog_detail', 'content_middle', 0),
('Blog Sticky Sidebar Ad', 'adsense', 'blog_detail', 'sidebar', 0),
('Blog Footer Banner Ad', 'adsense', 'blog_detail', 'content_bottom', 0);


-- ============================================================================
-- 11. SYNCHRONIZED SEED DATA (PROJECTS & BLOGS WITH VERIFIED CAUSE ASSETS)
-- ============================================================================

-- Seed Key Projects
INSERT INTO `key_projects` (`slug`, `title`, `category`, `status`, `location`, `short_description`, `image_url`, `why_it_matters`, `about_markdown`, `objectives_json`, `activities_json`, `stats_json`, `gallery_json`, `fundraising_goal`, `is_featured`, `publish_status`) VALUES
('tree-plantation-green-lucknow', 'Tree Plantation & Green Lucknow Initiative', 'Environment', 'ongoing', 'Lucknow, Uttar Pradesh', 'Building greener communities across urban and peri-urban Lucknow through massive native tree plantations, sapling distribution, and 3-year post-care adoption drives.', '/causes/environment_hero.jpg', 'Urban growth, rising asphalt corridors, and vehicular emissions continue to degrade air quality in central Uttar Pradesh. Planting native shade-giving trees naturally purifies toxic particulate matter (PM 2.5/PM 10), lowers ambient city temperatures by 3–5°C, and secures ecological micro-habitats for birds and pollinators.', '## Restoring Lucknow\'s Urban Green Canopy\n\nRapid urban growth and infrastructural expansion in Lucknow have significantly depleted the historic city\'s tree cover, exacerbating summer heat island effects and winter smog levels. ITLC Foundation\'s **Tree Plantation & Green Lucknow Initiative** takes direct, community-anchored action to reverse this decline.\n\n### The Core Strategy\n- **Native Species Selection**: We strictly prioritize deep-rooted, drought-hardy native Indian trees—including Neem, Peepal, Banyan, Jamun, Sheesham, and Gulmohar—which possess high survival rates in Gangetic plains soil without draining groundwater.\n- **3-Year Adopt-a-Tree Protocol**: Every sapling is secured with a protective tree guard and placed under the care of a dedicated neighborhood volunteer or student guardian who oversees weekly watering and organic composting.\n- **School & Community Drives**: We organize weekend plantation campaigns where families, students, and local residents actively plant and name their own trees, fostering a sense of long-term environmental stewardship.', '[\"Plant and nurture 50,000+ native saplings across Lucknow and surrounding districts.\",\"Achieve and maintain an 85\%+ sapling survival rate through structured 3-year post-care monitoring.\",\"Mobilize 10,000+ students and citizen volunteers through \'Adopt-a-Tree\' green stewardship pledges.\",\"Establish green bio-shields along arterial highways and industrial buffer zones to mitigate particulate pollution.\"]', '[\"Native Tree Plantation Drives\",\"Free Sapling Distribution to Households\",\"Environmental Awareness Workshops in Schools\",\"Tree Guard Installation & Drip Irrigation Setup\",\"Organic Vermicomposting Sessions\"]', '[{\"number\":\"25,000+\",\"label\":\"Trees Planted & Protected\"},{\"number\":\"88\%\",\"label\":\"Sapling Survival Rate\"},{\"number\":\"45+\",\"label\":\"Community Plantation Drives\"},{\"number\":\"8,500+\",\"label\":\"Citizen Volunteers Engaged\"}]', '[{\"image\":\"/causes/environment_hero.jpg\",\"caption\":\"Native Tree Plantation Drive in Lucknow\",\"alt\":\"Tree Plantation\",\"order\":1},{\"image\":\"/ref/story_3_hd.jpg\",\"caption\":\"Community Sapling Distribution Drive\",\"alt\":\"Sapling Distribution\",\"order\":2}]', 500000.00, 1, 'published'),
('animal-rescue-emergency-welfare', 'Stray Animal Rescue, Emergency First Aid & Welfare', 'Animal Welfare', 'ongoing', 'Lucknow, Uttar Pradesh', 'Providing on-site emergency veterinary first aid, anti-rabies vaccination, reflective anti-collision safety collars, and nutritious daily feeding rounds for community animals in Lucknow.', '/causes/animal_welfare_hero.jpg', 'A compassionate society protects its most vulnerable and defenseless beings. Stray animals on urban highways suffer painful injuries and preventable starvation every day. By delivering systematic veterinary care and road safety collars, we save animal lives and prevent serious traffic collisions for motorists.', '## Compassion on the Streets: Protecting Vulnerable Animals\n\nStray dogs and abandoned community cattle on the bustling streets of Uttar Pradesh face constant hazards: fast vehicular traffic, road accidents, seasonal starvation, and untreated maggot wounds. ITLC Foundation\'s **Animal Rescue & Emergency Welfare Program** bridges this critical care gap.\n\n### Life-Saving Direct Interventions\n- **Rapid On-Site First Aid**: Our mobile rescue volunteers respond to distress calls involving hit-and-run road accidents, cleaning wounds, administering pain relief, and coordinating emergency veterinary clinic care.\n- **Reflective Safety Collars**: During dense winter fog across Lucknow and peripheral highways, highway visibility plunges. We fit high-grade retro-reflective safety collars on street dogs and cattle, slashing nighttime road accidents by over 70\%.\n- **Daily Community Feeding Network**: Dedicated volunteer routes ensure clean water bowls and warm, nutritious meals (boiled rice, bone broth, eggs) reach street animals every single day.', '[\"Provide immediate emergency on-site medical first aid for 1,200+ injured stray animals annually.\",\"Install 5,000+ reflective safety collars on community dogs and stray cattle to prevent highway road deaths.\",\"Conduct mass anti-rabies vaccination drives covering 3,000+ community animals across vulnerable sectors.\",\"Maintain 25+ daily feeding routes delivering balanced, hygienic meals to street animals.\"]', '[\"Emergency Hit-and-Run Animal Rescue\",\"Nighttime Reflective Collar Installation\",\"Anti-Rabies & Parasite Vaccination Camps\",\"Daily Street Animal Feeding Routes\",\"Foster Care & Adoption Placement\"]', '[{\"number\":\"1,450+\",\"label\":\"Animals Rescued & Treated\"},{\"number\":\"3,200+\",\"label\":\"Reflective Collars Installed\"},{\"number\":\"15,000+\",\"label\":\"Nutritious Meals Served\"},{\"number\":\"2,800+\",\"label\":\"Anti-Rabies Vaccinations\"}]', '[{\"image\":\"/causes/animal_welfare_hero.jpg\",\"caption\":\"Stray Animal Medical Rescue & Care\",\"alt\":\"Animal Rescue\",\"order\":1},{\"image\":\"/causes/animal_feeding_drive.jpg\",\"caption\":\"Daily Stray Animal Community Feeding Drive\",\"alt\":\"Animal Feeding Drive\",\"order\":2},{\"image\":\"/causes/animal_rescue_treatment.jpg\",\"caption\":\"On-site Veterinary First Aid Treatment\",\"alt\":\"Veterinary Treatment\",\"order\":3}]', 500000.00, 1, 'published'),
('women-vocational-skill-center', 'Women Empowerment & Vocational Skill Centers', 'Women Empowerment', 'ongoing', 'Lucknow & Barabanki, Uttar Pradesh', 'Empowering underprivileged and rural women in Uttar Pradesh through free vocational training in tailoring, computer literacy, handicrafts, and micro-enterprise development.', '/causes/women_empowerment_hero.jpg', 'When you empower a woman with a vocational skill, the economic and educational status of the entire household transforms. Financial autonomy shields women from domestic vulnerability, ensures their children stay in school, and creates intergenerational prosperity.', '## Unlocking Financial Dignity for Women in Rural UP\n\nIn many semi-urban and rural clusters surrounding Lucknow, women lack access to formal skill education, keeping them financially dependent and vulnerable. The **Women Empowerment & Vocational Skill Centers** established by ITLC Foundation offer free, comprehensive vocational training designed to foster sustainable self-employment.\n\n### Pathways to Independence\n- **Professional Tailoring & Textile Design**: 6-month intensive diploma courses covering pattern cutting, stitching, and modern garment finishing, equipped with professional sewing machines.\n- **Digital Literacy & Basic Computing**: Equipping young girls and women with fundamental computer skills, online banking knowledge, and digital literacy required for modern administrative jobs.\n- **Self-Help Groups (SHGs) & Market Links**: We help women establish local SHGs, access formal micro-credit, and connect with retail exhibitions and bulk handicraft buyers to sell finished goods at fair market rates.', '[\"Train 1,000+ marginalized women annually in certified tailoring and vocational trades.\",\"Distribute free startup sewing kits to top graduates to launch home-based micro-enterprises.\",\"Establish 50+ Women Self-Help Groups (SHGs) linked to local banks and cooperative federations.\",\"Provide legal literacy, financial planning, and digital payment workshops for all trainees.\"]', '[\"Professional Tailoring & Embroidery Classes\",\"Basic Computer Literacy & Office Tools\",\"Handicrafts & Organic Product Crafting\",\"Financial Literacy & Bank Account Opening\",\"Exhibition Stalls & Market Linkage Support\"]', '[{\"number\":\"750+\",\"label\":\"Women Graduated & Certified\"},{\"number\":\"82\%\",\"label\":\"Self-Employment Placement\"},{\"number\":\"4\",\"label\":\"Active Training Centers\"},{\"number\":\"₹8,500\",\"label\":\"Avg Monthly Income Earned\"}]', '[{\"image\":\"/causes/women_empowerment_hero.jpg\",\"caption\":\"Women Vocational Skill Workshop\",\"alt\":\"Women Vocational Training\",\"order\":1},{\"image\":\"/causes/women_shg_workshop.jpg\",\"caption\":\"Self-Help Group (SHG) Sewing & Handicraft Center\",\"alt\":\"SHG Workshop\",\"order\":2}]', 500000.00, 1, 'published'),
('education-support-slum-children', 'Bridging Learning Gaps: Education Support for Slum Children', 'Education', 'ongoing', 'Lucknow, Uttar Pradesh', 'Operating free evening remedial study centers, distributing school kits, and facilitating formal RTE school admissions for first-generation learners in Lucknow slums.', '/ref/hero_boy_hd.jpg', 'Education is the single most powerful weapon against inherited poverty. Without foundational reading and writing skills, children from marginalized families remain trapped in low-wage cyclical hardship. Providing loving, structured educational guidance unlocks a future filled with dignity and opportunity.', '## Illuminating Young Minds Through Quality Education\n\nChildren of migrant laborers, street vendors, and slum dwellers in Lucknow often face overwhelming barriers to education: crowded living conditions, lack of parental literacy, and expensive school stationery that lead to early dropouts. ITLC Foundation\'s **Education Support Program** ensures that every child receives the foundation they need to thrive.\n\n### Comprehensive Educational Intervention\n- **Evening Remedial Learning Centers**: Free, safe study centers run by trained educators and university volunteers, focusing on Foundational Literacy and Numeracy (FLN).\n- **School Kit & Uniform Distribution**: Providing durable backpacks, notebooks, stationery sets, geometry kits, and school uniforms so no child feels excluded in class.\n- **RTE Admission Facilitation**: Helping illiterate parents navigate government Right to Education (RTE) admission portals and obtain mandatory Aadhaar and income paperwork.\n- **Daily Nutritional Support**: Every remedial session concludes with healthy, protein-rich snacks and clean drinking water to combat chronic childhood malnutrition.', '[\"Provide free daily evening remedial tutoring for 500+ slum and underprivileged children.\",\"Facilitate 100+ formal government and private school admissions under the RTE Act each academic year.\",\"Distribute 1,500+ complete educational kits (bags, textbooks, stationery) to needy students.\",\"Maintain a 95\%+ school retention rate and eliminate elementary school dropouts across adopted clusters.\"]', '[\"Daily Foundational Literacy & Numeracy Classes\",\"Free Annual School Bag & Stationery Drives\",\"Parent Counseling & RTE Admission Assistance\",\"Interactive Science & Creative Arts Workshops\",\"Daily Nutritional Health Snacks Distribution\"]', '[{\"number\":\"650+\",\"label\":\"Children Enrolled & Tutored\"},{\"number\":\"140+\",\"label\":\"Formal RTE School Admissions\"},{\"number\":\"1,800+\",\"label\":\"Study Kits Distributed\"},{\"number\":\"96\%\",\"label\":\"School Retention Rate\"}]', '[{\"image\":\"/ref/hero_boy_hd.jpg\",\"caption\":\"Children excited to receive their brand new school bags and study kits\",\"alt\":\"Children with school bags\",\"order\":1},{\"image\":\"/ref/project_education_hd.jpg\",\"caption\":\"Dedicated remedial tutoring session in foundational mathematics and reading\",\"alt\":\"Remedial class\",\"order\":2},{\"image\":\"/ref/project_community_hd.jpg\",\"caption\":\"Interactive weekend science demonstrations conducted by college volunteer tutors\",\"alt\":\"Science workshop\",\"order\":3},{\"image\":\"/pro/ab.png\",\"caption\":\"Parent orientation meeting assisting families with formal school enrollment documents\",\"alt\":\"Parent orientation\",\"order\":4}]', 500000.00, 1, 'published'),
('clean-water-sanitation-rural-up', 'Clean Water & Community Sanitation Campaign', 'Clean Water', 'ongoing', 'Sitapur & Lucknow Rural, Uttar Pradesh', 'Restoring defunct community hand pumps, installing bio-sand and RO filtration systems, and promoting WASH hygiene practices in water-stressed Uttar Pradesh hamlets.', '/causes/clean_water_hero.jpg', 'Clean drinking water is an undeniable fundamental human right. When rural communities drink uncontaminated water, child sickness drops dramatically, families save money on medical emergencies, and adolescent girls no longer miss school due to lack of sanitation.', '## Pure Water for Healthy, Thriving Villages\n\nContaminated drinking water containing excess fluoride, iron, and harmful biological bacteria causes chronic gastroenteritis, skin infections, and stunted growth among children in rural Uttar Pradesh. ITLC Foundation\'s **Clean Water & Community Sanitation Campaign** tackles this crisis through decentralized, sustainable solutions.\n\n### Practical Ground Interventions\n- **Deep Borewell Hand Pump Rehabilitation**: Repairing neglected community hand pumps, replacing broken cylinders, and extending riser pipes to tap cleaner aquifers.\n- **Community Water Filtration Units**: Installing multi-stage bio-sand and low-maintenance RO purification plants near village schools and Anganwadi centers.\n- **WASH Hygiene & Sanitation Training**: Educating families on safe water storage, regular hand washing, and sanitary household practices to eliminate waterborne epidemics.\n- **Jal Mitra Youth Committees**: Training local village youth and women to conduct periodic water quality tests and handle preventative mechanical maintenance.', '[\"Rehabilitate 100+ defunct community hand pumps across water-stressed villages in central UP.\",\"Install 15 community bio-sand and multi-stage filtration units near rural primary schools.\",\"Provide safe, tested drinking water access to 20,000+ rural residents and school students.\",\"Train 50+ local \'Jal Mitra\' community stewards in water testing and preventative maintenance.\"]', '[\"Water Quality Chemical & Microbial Testing\",\"Hand Pump Cylinder & Mechanical Overhaul\",\"Community Bio-Sand Filter Installation\",\"School WASH & Hygiene Awareness Workshops\",\"Village Jal Mitra Stewardship Training\"]', '[{\"number\":\"14,000+\",\"label\":\"Villagers with Safe Water\"},{\"number\":\"65+\",\"label\":\"Hand Pumps Restored\"},{\"number\":\"8\",\"label\":\"School Filtration Units\"},{\"number\":\"68\%\",\"label\":\"Drop in Waterborne Illness\"}]', '[{\"image\":\"/causes/clean_water_hero.jpg\",\"caption\":\"Clean Drinking Water Filtration & Pump Installation\",\"alt\":\"Clean Water Project\",\"order\":1},{\"image\":\"/causes/clean_water_hygiene.jpg\",\"caption\":\"Community WASH Sanitation & Hygiene Training\",\"alt\":\"Sanitation Awareness\",\"order\":2}]', 500000.00, 1, 'published'),
('social-welfare-community-relief', 'Community Social Welfare & Emergency Relief Drives', 'Social Welfare', 'ongoing', 'Lucknow & Peripheral UP', 'Delivering emergency dry ration kits, seasonal winter warm blankets, free health checkups, and elder dignity support to vulnerable families across Uttar Pradesh.', '/causes/social_welfare_hero.jpg', 'No human being should sleep hungry or freeze on the pavement during harsh North Indian winters. By extending unconditional compassion and direct material relief to distressed families, we restore human dignity and provide a lifeline during crisis.', '## Standing Beside Marginalized Families in Times of Need\n\nDaily wage laborers, widows, destitute senior citizens, and families affected by sudden medical emergencies or natural distress often lack basic social safety nets. ITLC Foundation\'s **Community Social Welfare Wing** provides timely, dignified humanitarian relief across Lucknow and neighboring districts.\n\n### Pillars of Humanitarian Care\n- **Emergency Dry Ration Kits**: Providing essential monthly grocery staples (flour, rice, lentils, cooking oil, spices, hygiene soap) to distressed daily-wage families during economic crises.\n- **Annual Winter Warmth Drives**: Distributing high-grade wool blankets, thermal sweaters, and warm footwear to homeless individuals and slum dwellers during North India\'s freezing winter nights.\n- **Free Health & Vision Camps**: Partnering with voluntary physicians and ophthalmologists to offer general health screenings, blood pressure checks, and free prescription spectacles for the elderly.\n- **Dignity Support for Destitute Elders**: Regular companionship visits, walking canes, and essential generic medicines delivered to abandoned elderly citizens.', '[\"Distribute 5,000+ emergency dry ration kits to destitute families annually.\",\"Hand out 3,000+ heavy wool blankets and thermal wear during severe winter months.\",\"Organize 12 free community health, eye checkup, and medicine distribution camps annually.\",\"Provide ongoing dignity, mobility, and medical companionship to 200+ vulnerable senior citizens.\"]', '[\"Emergency Dry Ration Kit Packing & Delivery\",\"Nighttime Street Winter Blanket Distribution\",\"Free Community Health & Vision Camps\",\"Elder Care Companionship & Medicine Delivery\",\"Disaster Relief & Flood Assistance Operations\"]', '[{\"number\":\"9,500+\",\"label\":\"Individuals Supported\"},{\"number\":\"4,200+\",\"label\":\"Winter Blankets Given\"},{\"number\":\"6,800+\",\"label\":\"Dry Ration Kits Distributed\"},{\"number\":\"18\",\"label\":\"Free Health Camps Run\"}]', '[{\"image\":\"/causes/social_welfare_hero.jpg\",\"caption\":\"Underprivileged Family Ration & Blanket Relief Drive\",\"alt\":\"Social Welfare Relief\",\"order\":1},{\"image\":\"/ref/story_4_hd.jpg\",\"caption\":\"Grassroots Community Health Checkup Camp\",\"alt\":\"Community Camp\",\"order\":2}]', 500000.00, 1, 'published'),
('master-test-project-1788868198114', 'Master Test Project UP', 'Education', 'ongoing', 'Lucknow, Uttar Pradesh', '', '/pro/tree.png', '', 'Providing test digital classrooms across rural UP', '[]', '[]', '[]', '[]', 500000.00, 1, 'published')
ON DUPLICATE KEY UPDATE `image_url` = VALUES(`image_url`), `short_description` = VALUES(`short_description`);

-- Seed Blogs
INSERT INTO `blogs` (`slug`, `title`, `excerpt`, `author`, `image_url`, `images_json`, `content_image_url`, `content`, `tags_json`, `key_points_json`, `read_time`, `status`, `is_featured`) VALUES
('qfrhe', 'qwhcqhuqhwuqw gtu', 'asgdsjyrkktld', 'ITLC Foundation', '/uploads/1789020509041-screenshot__259_.png', '[\"/uploads/1789020509041-screenshot__259_.png\"]', 'fdjdkdkkdkd', '[\"AHRejksjtyrsk.ltfd\",\"mnvc\"]', '[\"qweert\"]', '6 min read', 'published', 1),
('environmental-protection-tree-plantation-lucknow-uttar-pradesh', 'Environmental Protection in Uttar Pradesh: How Massive Tree Plantation Drives are Restoring Lucknow’s Green Canopy', 'Rapid urbanization in Lucknow and central UP has heightened heat islands and air pollution. Discover how community-led native afforestation is bringing back clean air and biodiversity.', 'ITLC Environmental Conservation Wing', '/causes/environment_hero.jpg', '[\"/causes/environment_hero.jpg\",\"/ref/story_3_hd.jpg\"]', '## The Urgent Need for Green Belts in Central Uttar Pradesh\n\nLucknow, the historic capital of Uttar Pradesh, has experienced unprecedented infrastructural and demographic expansion over the last twenty years. While economic growth has connected communities and modernized transportation, it has also brought severe ecological consequences: expanding asphalt, concrete corridors, declining water tables, and worsening urban heat islands.\n\nDuring the summer months, urban temperatures frequently exceed 44°C, creating unbearable heat for street vendors, daily wage workers, and school children. Come winter, heavy smog laden with toxic particulate matter (PM 2.5 and PM 10) blankets the city, aggravating bronchial ailments among children and senior citizens.\n\nAgainst this backdrop, passive conservation is no longer adequate. What Uttar Pradesh requires is **active, aggressive, community-anchored afforestation**.\n\n---\n\n## Why Native Trees Matter: Neem, Peepal, Banyan, and Jamun\n\nA common mistake in quick greening initiatives is the planting of non-native ornamental trees like Eucalyptus or Conocarpus, which consume disproportionate groundwater and support minimal local fauna. At ITLC Foundation, our environmental research team adheres strictly to **indigenous biodiverse species**:\n\n1. **Neem (*Azadirachta indica*):** Renowned as nature\'s air purifier, Neem trees release oxygen for extended periods, possess antibacterial properties, and thrive in semi-arid soil without demanding excessive groundwater.\n2. **Peepal (*Ficus religiosa*):** Capable of releasing oxygen round-the-clock, Peepal provides a broad leafy canopy that captures dust and airborne pollutants while housing over 40 species of birds and pollinators.\n3. **Banyan (*Ficus benghalensis*):** Deep-rooted and resilient, Banyan trees act as soil anchors, preventing soil erosion along riverbanks and peri-urban roadways.\n4. **Jamun & Bel (*Syzygium cumini* & *Aegle marmelos*):** In addition to cooling the atmosphere, these fruit-bearing native trees provide nourishment for urban wildlife and local birds.\n\n---\n\n## The \"Adopt-a-Tree\" Model: Beyond Mere Photo-Op Planting\n\nThe fundamental downfall of many corporate plantation drives is abandonment: saplings are planted for photographs during monsoon season and left to wither under the scorching summer sun without irrigation or fencing.\n\nTo overcome this, ITLC Foundation pioneered the **Adopt-a-Tree Stewardship Initiative**:\n- **Geo-tagged Saplings:** Every batch of saplings planted across Golf City, Mohanlalganj, and outer ring roads in Lucknow is mapped.\n- **Local Caretaker Networks:** We partner with nearby small shopkeepers, school groundskeepers, and residential societies, providing them with watering cans, organic compost, and protective iron tree guards.\n- **Bi-weekly Maintenance Patrols:** Volunteer teams conduct regular weeding, staking, and drip-watering rounds, achieving an industry-leading **88\% survival rate** across over 25,000 planted saplings.\n\n---\n\n## Citizen Action: What You Can Do Today\n\nEnvironmental conservation is not the exclusive domain of government agencies; it starts on your own balcony, lane, and community park. You can:\n- **Pledge a Tree:** Support the cost of a native sapling, protective guard, and 2-year maintenance through ITLC Foundation.\n- **Join Weekend Green Drives:** Spend 2 hours every Sunday morning digging pits, planting saplings, and greening public schools.\n- **Harvest Rainwater:** Prevent urban runoff by ensuring open soil patches in your home compound to recharge the Lucknow aquifer.\n\nTogether, we can build a resilient, breathable, and verdant Uttar Pradesh for generations to come.', '[\"Environment\",\"Tree Plantation\",\"Lucknow\",\"Uttar Pradesh\",\"Clean Air\",\"Biodiversity\"]', '[\"Urban Lucknow has witnessed a 14\% contraction of dense tree cover over the last two decades.\",\"Over 25,000 native saplings (Neem, Peepal, Banyan, Jamun) planted with an 88\% survival rate.\",\"Citizen involvement through \\\"Adopt-a-Tree\\\" drives ensures ongoing watering and tree guard protection.\",\"Community afforestation helps naturally filter particulate matter (PM 2.5 and PM 10) during winter smog.\"]', '6 min read', 'published', 1),
('animal-welfare-stray-rescue-feeding-care-uttar-pradesh', 'Compassion in Action: Stray Animal Welfare, Rescue, and Emergency Medical Care Across Lucknow', 'Street dogs, abandoned cows, and birds face extreme hunger, road trauma, and climate stress. Learn how ITLC Foundation is providing emergency veterinary first aid, daily feeding, and humane rehabilitation.', 'ITLC Animal Welfare & Rescue Unit', '/causes/animal_welfare_hero.jpg', '[\"/causes/animal_welfare_hero.jpg\",\"/causes/animal_feeding_drive.jpg\",\"/causes/animal_rescue_treatment.jpg\"]', '## The Silent Struggle of Street Animals in Our Cities\n\nIn every neighborhood of Lucknow and across Uttar Pradesh, thousands of stray animals live alongside human society. From community indie dogs patrolling market squares to abandoned dairy cattle wandering busy highways, these sentient beings navigate a harsh existence marked by starvation, territorial vehicular accidents, dehydration in scorching summers, and shivering cold in winter.\n\nAnimal welfare is not merely an act of kindness—it is a fundamental public health and civic duty. When street animals are vaccinated, nourished, and treated with compassion, human-animal conflicts decline dramatically, rabies risks diminish, and communities become safer for everyone.\n\n---\n\n## Pillar 1: Daily Nutritious Feeding Drives\n\nUrban strays frequently rely on garbage dumps and plastic-laced discarded food, leading to chronic gastrointestinal infections and malnutrition. \n\nITLC Foundation operates a **Dedicated Community Feeding Network**:\n- **Balanced Meals:** We prepare fresh, wholesome batches of rice, turmeric, boiled lentils, boiled eggs, and nutrient-dense broth daily.\n- **Consistent Feeding Routes:** Street animals are creatures of habit. By feeding them at fixed times and designated quiet spots late in the evening or early morning, we prevent aggressive territorial fights and food begging near traffic intersections.\n- **Hydration Bowls:** During the peak summer months (April to July), our volunteers install and regularly replenish **cement water bowls** outside shops and residential blocks, quenching the thirst of strays, squirrels, and birds.\n\n---\n\n## Pillar 2: Emergency First-Aid & Road Safety Collars\n\nRoad accidents represent the single largest cause of fatalities and severe trauma among street dogs in Uttar Pradesh. With poor street lighting on bypasses and ring roads, drivers often spot animals too late.\n\nTo counter this, ITLC Foundation launched the **Reflective Collar Safety Campaign**:\n- We fit community dogs with durable, weather-resistant fluorescent **reflective collars**. When vehicle headlights hit the collar from hundreds of meters away, it shines brightly, giving drivers ample braking time.\n- Over **1,200 dogs** have been fitted with these life-saving collars across Lucknow, reducing vehicular collisions in targeted zones by over 60\%.\n- Our mobile volunteer kit carries antiseptic sprays, maggot-wound powders (Negasunt/Topicure), bandage wraps, and pain-relief medications to treat minor lacerations and bite wounds on-the-spot.\n\n---\n\n## Pillar 3: Addressing Rabies & Humane Sterilization\n\nThe only proven, scientific, and humane method to stabilize stray dog populations and eliminate rabies is the **Animal Birth Control (ABC) and Anti-Rabies Vaccination (ARV)** protocol recommended by the World Health Organization (WHO).\n\nCruelty, relocation, or culling is both illegal under the Prevention of Cruelty to Animals Act, 1960, and counterproductive, as new un-vaccinated dogs quickly migrate into vacated territories. ITLC Foundation collaborates with registered local veterinary surgeons and municipal shelters to ensure street dogs are vaccinated against rabies and gently rehabilitated in their original home territories.', '[\"Animal Welfare\",\"Stray Dogs\",\"Rescue\",\"Lucknow\",\"Humane Care\",\"Veterinary Aid\"]', '[\"Over 600 street animals fed nutritious meals daily across multiple zones in Lucknow.\",\"More than 1,200 reflective safety collars installed to prevent nocturnal road accidents.\",\"Summer hydration drives deployed over 350 cement water bowls for strays and birds.\",\"Humane rabies vaccination and veterinary wound dressing drives conducted weekly.\"]', '7 min read', 'published', 1),
('women-empowerment-skill-development-rural-uttar-pradesh', 'Empowering Women in Rural Uttar Pradesh: Vocational Training, Self-Help Groups, and Economic Independence', 'When a woman earns, her entire family flourishes. Explore how sewing centers, digital financial literacy, and self-help collectives are transforming the lives of women in peri-urban Lucknow.', 'ITLC Women Empowerment Cell', '/causes/women_empowerment_hero.jpg', '[\"/causes/women_empowerment_hero.jpg\",\"/causes/women_shg_workshop.jpg\"]', '## The Catalyst for Intergenerational Change\n\nIn many peri-urban clusters and rural hamlets across Uttar Pradesh, women possess immense grit, resourcefulness, and creativity. Yet, systemic barriers—such as restricted mobility, lack of formalized vocational skills, and absence of independent financial accounts—have historically kept them dependent on male relatives for basic household necessities.\n\nEconomic empowerment is the definitive antidote to gender inequality. When a mother or daughter earns independent income, studies consistently prove that **over 90\% of her earnings are reinvested directly into her family**: healthier food, cleaner drinking water, school uniforms, and medicines for children.\n\n---\n\n## The ITLC Skill & Tailoring Centers: From Learners to Entrepreneurs\n\nTo provide women with a dignified, scalable livelihood, ITLC Foundation established grassroots **Sewing, Tailoring & Handicraft Skill Centers** in underserved neighborhoods of Lucknow:\n\n1. **Structured 6-Month Curriculum:** Women learn basic garment construction, blouse drafting, school uniform stitching, and intricate Lucknowi Chikankari embroidery.\n2. **Quality Tooling:** Each participant trains on modern industrial sewing machines, learning maintenance, precision cutting, and fabric management.\n3. **Market Linkages & Order Fulfillment:** Training without income is incomplete. ITLC Foundation bridges our graduates with local cloth merchants, school uniform contracts, and festival bag orders, ensuring that every woman earns while learning.\n\nGraduates frequently establish home-based tailoring boutiques or form small sewing cooperatives, generating an average monthly income of **₹6,000 to ₹12,000**—transforming their status within their households from dependents to respected decision-makers.\n\n---\n\n## Digital Financial Literacy: Unlocking Independence\n\nEarning money is step one; retaining and growing financial assets is step two. Many rural women who receive cash payments are vulnerable to having their earnings appropriated by others.\n\nITLC Foundation conducts targeted **Digital & Banking Literacy Workshops**:\n- **Zero-Balance Accounts:** Assisting women in opening and operating their individual bank accounts under Pradhan Mantri Jan Dhan Yojana.\n- **Secure UPI & Mobile Banking:** Training women to use smartphone payment apps securely, verifying SMS transaction alerts, and guarding against fraud or sharing OTPs.\n- **Micro-Savings:** Encouraging women to deposit small weekly sums into savings accounts, building an emergency buffer against medical crises or crop failures.', '[\"Women Empowerment\",\"Skill Development\",\"Rural UP\",\"Financial Literacy\",\"Livelihoods\"]', '[\"Over 450 rural and semi-urban women trained in commercial stitching, sewing, and handicrafts.\",\"Digital literacy drives teaching UPI payments, Jan Dhan savings, and direct benefit transfers.\",\"Formation of community Self-Help Groups (SHGs) facilitating micro-enterprise and collective savings.\",\"Measurable increase in household investment towards girl child education and nutritious diets.\"]', '6 min read', 'published', 1),
('education-support-underprivileged-slum-children-lucknow', 'Bridging the Learning Divide: Quality Education Support for Underprivileged and Slum Children in Lucknow', 'Poverty should never be a barrier to a child’s imagination and learning. Read how free school kits, remedial coaching, and digital classrooms are keeping vulnerable children in school.', 'ITLC Education & Child Development Desk', '/ref/hero_boy_hd.jpg', '[\"/ref/hero_boy_hd.jpg\",\"/ref/project_education_hd.jpg\",\"/ref/story_1_hd.jpg\",\"/pro/2.png\"]', '## The Hidden Crisis in Foundational Learning\n\nEducation is universally recognized as the most potent equalizer in human society. Yet, in the informal settlements, brick kiln belts, and migrant laborer clusters of Lucknow and surrounding Uttar Pradesh districts, thousands of young minds are at severe risk of dropping out before completing upper primary school.\n\nThe barrier is twofold:\n1. **Economic Friction:** The inability of daily-wage earning parents to purchase new notebooks, school uniforms, shoes, and stationery each academic term.\n2. **The \"First-Generation\" Learning Barrier:** When parents are illiterate, children have no academic guidance at home. If a child falls behind in foundational reading or basic mathematics in Class 2 or 3, embarrassment and confusion lead directly to permanent absenteeism and child labor.\n\n---\n\n## Step 1: Eliminating Economic Friction with Comprehensive School Kits\n\nAt the start of every academic session, ITLC Foundation organizes the **\"Shiksha Umeed\" School Supply Drive**:\n- **High-Quality Backpacks:** Sturdy, water-resistant school bags that can endure daily walks on dusty lanes.\n- **Complete Stationery Sets:** Multi-subject notebooks, pens, pencils, erasers, sharpeners, rulers, and geometry kits.\n- **Hygiene & Utility Essentials:** Stainless steel water bottles and lunch boxes, keeping children hydrated and nourished throughout school hours.\n\nOver **2,800 children** have been equipped with these learning kits in the past year alone.\n\n---\n\n## Step 2: Remedial Learning Centers (Gyan Kendras)\n\nEquipping a child with a bag is useless if they cannot read the letters inside their textbook. ITLC Foundation operates **After-School Remedial Gyan Kendras** in targeted community centers:\n- Passionate Volunteer Teachers\n- Foundational Literacy & Numeracy\n- Digital Curiosity Labs with tablets.', '[\"Education\",\"Child Welfare\",\"Slum Children\",\"Lucknow\",\"Literacy\",\"School Kits\"]', '[\"Over 2,800 school kits (backpacks, notebooks, geometry boxes, stationery) distributed annually.\",\"After-school remedial learning centers helping first-generation learners pass foundational grades.\",\"Parental counseling initiatives cutting primary school dropout rates by over 45\% in target pockets.\",\"Introduction of basic digital tablets and storytelling sessions to kindle curiosity and scientific temper.\"]', '7 min read', 'published', 1),
('clean-water-sanitation-hygiene-communities-uttar-pradesh', 'Clean Water & Sanitation: Ensuring Safe Drinking Water and Hygiene Awareness in Semi-Urban Communities', 'Waterborne diseases rob children of school days and drain family savings. Discover our initiatives to install water testing, clean storage systems, and health hygiene workshops in UP.', 'ITLC Public Health & Sanitation Team', '/causes/clean_water_hero.jpg', '[\"/causes/clean_water_hero.jpg\",\"/causes/clean_water_hygiene.jpg\"]', '## The Silent Toll of Waterborne Illnesses\n\nClean drinking water is not a luxury; it is a fundamental human right. Yet across semi-urban fringes and rural settlements in Uttar Pradesh, shallow hand pumps often draw water contaminated with high total dissolved solids (TDS), excess iron, nitrates, and microbial pathogens from unlined open drainage.\n\nAccording to public health data, waterborne ailments—including acute diarrheal disease, typhoid, cholera, and hepatitis A—are among the leading causes of child mortality and chronic stunting among children under five in India.\n\n---\n\n## Clean Water Interventions: Storage & Filtration\n\nITLC Foundation addresses this through a pragmatic, community-centered approach:\n1. **Food-Grade Covered Storage Units:** Distributing 25-liter durable, food-grade water containers equipped with push-taps and secure screw lids.\n2. **Community Bio-Sand & Ceramic Filters:** Installing low-maintenance, electricity-free gravity water purification filters.\n3. **Periodic Water Testing:** Conducting field chemical and microbial testing on tube-wells across project sites.', '[\"Clean Water\",\"Sanitation\",\"Public Health\",\"Uttar Pradesh\",\"Hygiene Awareness\"]', '[\"Contaminated groundwater and lack of covered storage remain leading causes of diarrhea and typhoid in rural UP.\",\"Deployment of food-grade water storage drums and community filtration points in vulnerable clusters.\",\"WASH (Water, Sanitation, and Hygiene) school workshops educating over 3,500 children on effective handwashing.\",\"Regular water quality testing (pH, TDS, bacterial presence) with local civic health departments.\"]', '6 min read', 'published', 1),
('social-welfare-grassroots-community-upliftment-uttar-pradesh', 'Grassroots Social Welfare in Uttar Pradesh: Winter Relief, Food Security, and Holistic Community Care', 'From freezing winter nights on pavements to emergency hunger relief, discover how ITLC Foundation provides immediate humanitarian aid while building long-term community resilience.', 'ITLC Social Welfare & Relief Directorate', '/causes/social_welfare_hero.jpg', '[\"/causes/social_welfare_hero.jpg\",\"/ref/story_4_hd.jpg\"]', '## Compassion at the Grassroots: Leaving No One Behind\n\nA truly civilized society is measured not by the grandeur of its monuments or the wealth of its elite, but by how it cares for its most vulnerable members: the elderly abandoned on city streets, the migrant laborer sleeping under an overpass, and the impoverished family struggling to put two meals on the table.\n\nITLC Foundation was founded on the singular principle of **\"Seva Paramo Dharmah\"**—compassionate service without discrimination of caste, creed, gender, or religion.\n\n---\n\n## Winter Warmth Drives: Saving Lives on Freezing Nights\n\nThe northern Indian winter between December and January is brutal. Temperatures in Lucknow and central Uttar Pradesh frequently dip below 4°C, accompanied by dense, damp fog and icy winds.\n\nEvery winter, ITLC Foundation mobilizes the **\"Winter Warmth Relief Brigade\"**:\n- **Late-Night Patrolling Teams:** Volunteers scour bus terminals, hospital verandahs, and construction colonies.\n- **Heavy Thermal Blankets:** Providing high-grade warm blankets directly to citizens sleeping exposed to frost.\n- **Hot Wholesome Meals:** Serving hot khichdi and tea during severe cold waves.', '[\"Social Welfare\",\"Winter Relief\",\"Food Security\",\"Lucknow\",\"Uttar Pradesh\",\"Humanitarian Aid\"]', '[\"Over 4,000 thermal blankets and warm winter jackets distributed to homeless citizens and night shelters.\",\"Emergency dry ration kits (wheat flour, rice, pulses, cooking oil, salt) delivered during crisis periods.\",\"Support for abandoned senior citizens with emergency medical supplies and walking aids.\",\"Collaboration with district disaster and administrative teams for rapid humanitarian response.\"]', '7 min read', 'published', 1)
ON DUPLICATE KEY UPDATE `image_url` = VALUES(`image_url`), `content` = VALUES(`content`);
