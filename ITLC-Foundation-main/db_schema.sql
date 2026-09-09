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

-- Seed Core CMS Pages
INSERT INTO `cms_pages` (`page_key`,`page_name`,`slug`,`page_type`,`title`,`meta_title`,`meta_description`,`status`) VALUES
('home', 'Home Page', '/', 'core', 'ITLC Foundation - Reclaiming Nature, Empowering Lives', 'ITLC Foundation Lucknow | Top NGO in Uttar Pradesh', 'Leading humanitarian and environmental NGO in Lucknow, Uttar Pradesh. Working in tree plantation, stray animal welfare, women empowerment, and child education.', 'published'),
('about', 'About Us', '/about', 'core', 'About Our Foundation - A Leading NGO in Lucknow', 'About ITLC Foundation | Mission, Vision & Impact', 'Learn about ITLC Foundation, our dedicated volunteers, grassroots journey, and transparency in social welfare across Uttar Pradesh.', 'published'),
('projects', 'Our Projects', '/projects', 'listing', 'Creating Meaningful Change Across Uttar Pradesh', 'Our Projects & Drives | ITLC Foundation Lucknow', 'Explore all active environmental, animal welfare, women empowerment, and educational projects run by ITLC Foundation.', 'published'),
('blog', 'Blog & Insights', '/blog', 'listing', 'Latest Updates, Field Insights & Community Stories', 'ITLC Blog & News | Stories of Change in Lucknow', 'Read verified articles and on-ground field logs about ecological conservation, animal rescue, and women empowerment.', 'published'),
('donate', 'Donate Now', '/donate', 'core', 'Support Our Grassroots Work in Lucknow', 'Donate to ITLC Foundation | 80G Tax Exemption', 'Make a tax-exempt donation under section 80G to support tree planting, hungry stray animals, and underprivileged school children.', 'published'),
('volunteer', 'Volunteer With Us', '/volunteer', 'core', 'Join Hands for a Greener, Kinder Uttar Pradesh', 'Volunteer Registration | ITLC Foundation Lucknow', 'Sign up as an on-ground volunteer to participate in weekend tree planting, animal feeding, and children teaching drives.', 'published'),
('contact', 'Contact Us', '/contact', 'core', 'Get in Touch with ITLC Foundation Lucknow', 'Contact ITLC Foundation | Office Address & Phone', 'Reach out to our Lucknow headquarters for CSR partnerships, volunteer opportunities, and emergency rescues.', 'published')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Seed Default Ad Slots
INSERT INTO `ad_slots` (`name`, `ad_type`, `page_type`, `placement`, `is_active`) VALUES
('Blog Top Ad Banner', 'adsense', 'blog_detail', 'content_top', 0),
('Blog In-Article Mid Ad', 'adsense', 'blog_detail', 'content_middle', 0),
('Blog Sticky Sidebar Ad', 'adsense', 'blog_detail', 'sidebar', 0),
('Blog Footer Banner Ad', 'adsense', 'blog_detail', 'content_bottom', 0);
