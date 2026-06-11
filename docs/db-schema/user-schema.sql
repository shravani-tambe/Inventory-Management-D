-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE alert_type AS ENUM ('low_stock', 'system');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');

CREATE TYPE audit_action_type AS ENUM (
    'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED',
    'STOCK_ADDED', 'STOCK_REMOVED', 'STOCK_TRANSFERRED',
    'PO_CREATED', 'PO_APPROVED', 'GOODS_RECEIVED',
    'SO_CREATED', 'SO_DISPATCHED', 'SO_COMPLETED',
    'USER_LOGIN', 'USER_REGISTERED', 'USER_ROLE_CHANGED'
);

-- ============================================================
-- TABLE 1: roles
-- Stores RBAC roles such as 'admin', 'manager', and 'staff'
-- ============================================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE 2: users
-- Stores user accounts, authentication details, and links to roles
-- ============================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users table
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE 3: alerts
-- Stores automated and system alerts, such as low stock notifications
-- ============================================================
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    type alert_type NOT NULL,
    message TEXT,
    severity alert_severity NOT NULL,
    product_id INTEGER REFERENCES products(id),     -- Foreign key to Member 1's table
    warehouse_id INTEGER REFERENCES warehouses(id), -- Foreign key to Member 2's table
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast dashboard filtering (e.g., fetching unread critical alerts)
CREATE INDEX idx_alerts_is_read_severity ON alerts(is_read, severity);

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON alerts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE 4: audit_logs
-- Centralized append-only log for tracking user actions across all modules
-- ============================================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type audit_action_type NOT NULL,
    entity_type VARCHAR,
    entity_id INTEGER,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
