-- Create Enum Type for User Roles
CREATE TYPE userrole AS ENUM ('Admin', 'VIP', 'Free');

-- Create Enum Type for Transaction Types
CREATE TYPE transactiontype AS ENUM ('Income', 'Expense');

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role userrole DEFAULT 'Free',
    monthly_income INTEGER,
    savings_goal VARCHAR(255),
    dream_item VARCHAR(255),
    max_spending INTEGER
);

-- Create Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    type transactiontype NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX ix_users_id ON users (id);
CREATE INDEX ix_users_username ON users (username);
CREATE INDEX ix_transactions_user_id ON transactions (user_id);

-- Insert Seed Data (Passwords: admin123, vip123, free123)
INSERT INTO users (username, hashed_password, role) VALUES 
('admin', '$2b$12$FEOJ7/Ysoflzxzsw4GN/9ekxv1vB90BHCYhty0OrXzinlt3J4x1Ia', 'Admin'),
('vip_user', '$2b$12$gW/01nCWonUXfw/RUWHFGudS/yyH6uFLWb3qdV4bST0evw/jJdlJa', 'VIP'),
('free_user', '$2b$12$26Ro2hXDU..IHna2Z8aWY.N9rLlVFrBIeyCpG/IDynGpq/0gs/sVq', 'Free');
