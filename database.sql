-- bdoffer PHP + MySQL schema
-- Create the database in cPanel first, then import this file in phpMyAdmin.

CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash CHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS affiliate_links (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    link_key VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 50,
    placements JSON NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_affiliate_links_active_order (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inquiries (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    contact VARCHAR(120) NOT NULL,
    topic VARCHAR(80) NOT NULL,
    message VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inquiries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO affiliate_links (link_key, label, url, is_active, sort_order, placements)
VALUES
('banglalink', 'Banglalink', 'https://www.banglalink.net/', 1, 10, '["hero_cta","operator_buttons","offer_cards","section_ctas","countdown_cta"]'),
('gp', 'Grameenphone', 'https://www.grameenphone.com/', 1, 20, '["hero_cta","operator_buttons","offer_cards","section_ctas","countdown_cta"]'),
('robi', 'Robi', 'https://www.robi.com.bd/', 1, 30, '["hero_cta","operator_buttons","offer_cards","section_ctas","countdown_cta"]'),
('airtel', 'Airtel', 'https://www.bd.airtel.com/', 1, 40, '["hero_cta","operator_buttons","offer_cards","section_ctas","countdown_cta"]')
ON DUPLICATE KEY UPDATE link_key = VALUES(link_key);
