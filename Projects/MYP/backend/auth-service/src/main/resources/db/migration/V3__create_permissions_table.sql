-- 创建权限表
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    role_id BIGINT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 插入初始权限数据
INSERT IGNORE INTO permissions (name, description, role_id) 
SELECT 'VIEW_USERS', '查看用户列表', r.id FROM roles r WHERE r.name = 'ROLE_ADMIN';

INSERT IGNORE INTO permissions (name, description, role_id) 
SELECT 'MANAGE_USERS', '管理用户', r.id FROM roles r WHERE r.name = 'ROLE_ADMIN';

INSERT IGNORE INTO permissions (name, description, role_id) 
SELECT 'VIEW_TENANTS', '查看租户列表', r.id FROM roles r WHERE r.name IN ('ROLE_ADMIN', 'ROLE_TENANT_ADMIN');

INSERT IGNORE INTO permissions (name, description, role_id) 
SELECT 'MANAGE_TENANTS', '管理租户', r.id FROM roles r WHERE r.name = 'ROLE_ADMIN';