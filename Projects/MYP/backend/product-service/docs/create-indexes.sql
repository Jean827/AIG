-- 产品服务数据库索引创建脚本

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

-- Order表索引
-- 为product_id字段添加普通索引
CREATE INDEX idx_order_product ON orders(product_id);

-- 为tenant_id字段添加普通索引
CREATE INDEX idx_order_tenant ON orders(tenant_id);

-- 为status字段添加普通索引
CREATE INDEX idx_order_status ON orders(status);

-- 为product_id和status添加复合索引（常用于关联查询）
CREATE INDEX idx_order_product_status ON orders(product_id, status);

-- 为order_no字段添加唯一索引
-- 注意：如果order_no在实体类中已定义为unique，此索引可能已存在
-- CREATE UNIQUE INDEX idx_order_no ON orders(order_no);

-- 查看已创建的索引
SHOW INDEX FROM products;
SHOW INDEX FROM orders;