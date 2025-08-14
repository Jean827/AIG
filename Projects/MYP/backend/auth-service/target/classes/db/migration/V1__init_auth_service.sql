-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    tenant_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert initial roles
INSERT IGNORE INTO roles (name, description) VALUES
('ROLE_USER', '普通用户角色'),
('ROLE_ADMIN', '管理员角色'),
('ROLE_TENANT_ADMIN', '租户管理员角色');

-- Insert admin user (password: admin123)
INSERT IGNORE INTO users (username, password, email, tenant_id, is_active)
VALUES ('admin', '$2a$10$Dkqz4A5cRQlYlG1z5dJz3u.2QV3n6w4T5U6I7O8P9L0K1J2H3G4F', 'admin@example.com', NULL, TRUE);

-- Assign admin role to admin user
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';