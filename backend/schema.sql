-- ==========================================================
-- SMART CAMPUS COMPLAINT MANAGEMENT SYSTEM
-- Relational Database Schema (MySQL 8.0+)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS smart_campus_complaints
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smart_campus_complaints;

-- ----------------------------------------------------------
-- 1. USERS TABLE (Role-Based Access: STUDENT, ADMIN, TECHNICIAN)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'TECHNICIAN') NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    icon VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 3. COMPLAINTS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL UNIQUE,
    student_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    location VARCHAR(100) NULL,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    
    INDEX idx_complaint_status (status),
    INDEX idx_complaint_priority (priority),
    INDEX idx_complaint_student (student_id),
    INDEX idx_complaint_category (category_id),
    INDEX idx_complaint_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 4. COMPLAINT ASSIGNMENTS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    technician_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_assign_technician (technician_id),
    INDEX idx_assign_complaint (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 5. COMPLAINT UPDATES / TIMELINE HISTORY TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    updated_by INT NOT NULL,
    previous_status ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED') NULL,
    new_status ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED') NOT NULL,
    remarks TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_update_complaint (complaint_id),
    INDEX idx_update_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- SEED INITIAL CATEGORIES
-- ----------------------------------------------------------
INSERT INTO categories (name, description, icon) VALUES
('Electrical', 'Issues related to lighting, power outlets, wiring, and fans', 'zap'),
('Internet/WiFi', 'Campus network outages, slow connectivity, router failures', 'wifi'),
('Classroom', 'Projectors, smartboards, benches, AC, and podium issues', 'monitor'),
('Hostel', 'Room maintenance, plumbing, water supply, and beds', 'home'),
('Library', 'Reading room facilities, lighting, book lookup kiosks', 'book-open'),
('Cleaning', 'Washrooms, hallways, grounds, and waste disposal', 'sparkles'),
('Transport', 'Campus shuttles, parking permits, and bus scheduling', 'bus'),
('Other', 'General campus utilities and infrastructure complaints', 'help-circle')
ON DUPLICATE KEY UPDATE name=name;
