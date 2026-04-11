-- Career Guidance Website Database Setup
-- Run this SQL in phpMyAdmin or MySQL command line

-- Create Database
CREATE DATABASE IF NOT EXISTS career_guidance;
USE career_guidance;

-- Create Students Table
-- Stores student career exploration data
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    stream VARCHAR(50) NOT NULL,
    interest VARCHAR(100) NOT NULL,
    suggested_career VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admin Table
-- Stores admin login credentials
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin Account
-- Username: admin | Password: admin123
-- Note: In production, use password_hash() for security
INSERT INTO admin (username, password) VALUES ('admin', 'admin123');

-- Sample student data (optional - for testing)
INSERT INTO students (name, email, stream, interest, suggested_career) VALUES
('Test Student', 'test@example.com', 'Science', 'Coding', 'Software Engineer');
