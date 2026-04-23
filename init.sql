-- Create Enum Type for User Roles
CREATE TYPE userrole AS ENUM ('Admin', 'VIP', 'Free');

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role userrole DEFAULT 'Free'
);

-- Create Indexes (to match SQLAlchemy's index=True)
CREATE INDEX ix_users_id ON users (id);
CREATE INDEX ix_users_username ON users (username);

-- Insert Seed Data
INSERT INTO users (username, hashed_password, role) VALUES 
('admin', '$2b$12$FEOJ7/Ysoflzxzsw4GN/9ekxv1vB90BHCYhty0OrXzinlt3J4x1Ia', 'Admin'),
('vip_user', '$2b$12$gW/01nCWonUXfw/RUWHFGudS/yyH6uFLWb3qdV4bST0evw/jJdlJa', 'VIP'),
('free_user', '$2b$12$26Ro2hXDU..IHna2Z8aWY.N9rLlVFrBIeyCpG/IDynGpq/0gs/sVq', 'Free');
