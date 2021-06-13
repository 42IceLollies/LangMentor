-- SQL Commands for LangMentor database management

-- Create Database
CREATE DATABASE langmentor_db;

-- Create necessary Tables for database
CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	user_name VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL,
	user_pass VARCHAR(255) NOT NULL
);

CREATE TABLE unverified_users (
	user_id INT NOT NULL,
	user_name VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL,
	user_pass VARCHAR(255) NOT NULL
);

-- Get all users based on user_id
SELECT * FROM users ORDER BY user_id;

-- Get all unverified_users based on their id
SELECT * FROM unverified_users ORDER BY user_id;
