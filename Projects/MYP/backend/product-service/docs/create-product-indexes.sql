-- 连接到product_service数据库
USE product_service;

-- Product表索引
-- 为name字段添加普通索引
CREATE INDEX idx_product_name ON products(name);

-- 为category_id字段添加普通索引
CREATE INDEX idx_product_category ON products(category_id);

-- 为tenant_id字段添加普通索引
CREATE INDEX idx_product_tenant ON products(tenant_id);

-- 为status和tenant_id添加复合索引（常用于多租户查询）
CREATE INDEX idx_product_status_tenant ON products(status, tenant_id);

-- 查看已创建的索引
SHOW INDEX FROM products;