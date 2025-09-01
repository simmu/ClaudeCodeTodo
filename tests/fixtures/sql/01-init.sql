-- Initialize test database with basic structure
-- This file will be executed when the test database container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create test schema
CREATE SCHEMA IF NOT EXISTS test_data;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA test_data TO test_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA test_data TO test_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA test_data TO test_user;

-- Create a simple table for basic connectivity tests
CREATE TABLE IF NOT EXISTS test_data.connection_test (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test record
INSERT INTO test_data.connection_test (message) VALUES ('Database connection successful');