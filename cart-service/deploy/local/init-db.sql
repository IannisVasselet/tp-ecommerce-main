-- Create cart database for postgres
CREATE DATABASE cart_db;

-- Create extension for UUID generation
\c cart_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
