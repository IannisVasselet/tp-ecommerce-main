-- Create order database for postgres
CREATE DATABASE order_db;

-- Create extension for UUID generation
\c order_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
