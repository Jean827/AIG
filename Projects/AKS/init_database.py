#!/usr/bin/env python3
# 数据库初始化脚本
# 用于创建项目所需的表结构

import sys
import os

# 添加项目路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src/backend'))

from src.backend.utils.db_utils import db_connection

class DatabaseInitializer:
    """数据库初始化类"""
    @staticmethod
    def create_tables():
        """创建所有必要的表结构"""
        # 表创建SQL语句
        create_table_queries = [
            # 系统管理模块表
            """
            CREATE TABLE IF NOT EXISTS system_menus (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                icon VARCHAR(50),
                type VARCHAR(20) NOT NULL,
                path VARCHAR(200),
                component VARCHAR(200),
                parent_id VARCHAR(36),
                "order" INTEGER NOT NULL,
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES system_menus(id)
            );
            """,
            
            """
            CREATE TABLE IF NOT EXISTS system_users (
                id VARCHAR(36) PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nickname VARCHAR(50),
                phone VARCHAR(20),
                email VARCHAR(100),
                role_id VARCHAR(36),
                organization_id VARCHAR(36),
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP
            );
            """,
            
            """
            CREATE TABLE IF NOT EXISTS system_roles (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                description TEXT,
                permissions TEXT,
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP
            );
            """,
            
            """
            CREATE TABLE IF NOT EXISTS system_organizations (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                code VARCHAR(50),
                parent_id VARCHAR(36),
                level INTEGER,
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES system_organizations(id)
            );
            """,
            
            # 基础信息模块表
            """
            CREATE TABLE IF NOT EXISTS basic_townships (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                code VARCHAR(50) NOT NULL,
                land_area DECIMAL(18, 2),
                village_count INTEGER,
                organization_id VARCHAR(36) NOT NULL,
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP
            );
            """,
            
            """
            CREATE TABLE IF NOT EXISTS basic_villages (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                code VARCHAR(50) NOT NULL,
                township_id VARCHAR(36) NOT NULL,
                land_area DECIMAL(18, 2),
                farmer_count INTEGER,
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP,
                FOREIGN KEY (township_id) REFERENCES basic_townships(id)
            );
            """,
            
            """
            CREATE TABLE IF NOT EXISTS basic_farmers (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                id_card VARCHAR(20) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL,
                village_id VARCHAR(36) NOT NULL,
                land_area DECIMAL(18, 2),
                status INTEGER NOT NULL,
                create_time TIMESTAMP,
                update_time TIMESTAMP,
                FOREIGN KEY (village_id) REFERENCES basic_villages(id)
            );
            """
        ]
        
        try:
            # 连接数据库
            db_connection.connect()
            
            # 获取游标并执行创建表语句
            with db_connection.get_cursor() as cursor:
                if cursor:
                    for query in create_table_queries:
                        print(f"执行SQL: {query[:50]}...")
                        cursor.execute(query)
                    print("所有表创建成功！")
                else:
                    print("警告: 无法获取数据库游标，表创建跳过。")
                    print("系统将继续使用模拟数据进行开发和测试。")
        except Exception as e:
            print(f"表创建失败: {e}")
            print("系统将继续使用模拟数据进行开发和测试。")
        finally:
            # 断开数据库连接
            db_connection.disconnect()

    @staticmethod
    def insert_initial_data():
        """插入初始数据"""
        try:
            # 连接数据库
            db_connection.connect()
            
            # 获取游标并执行插入数据语句
            with db_connection.get_cursor() as cursor:
                if cursor:
                    # 插入初始菜单数据
                    insert_menu_query = """
                    INSERT INTO system_menus (id, name, icon, type, path, component, parent_id, "order", status, create_time, update_time)
                    VALUES
                    ('1', '系统管理', 'setting', 'catalog', '/system', 'Layout', NULL, 1, 1, NOW(), NOW()),
                    ('2', '用户管理', 'user', 'menu', '/system/users', 'system/user/index', '1', 1, 1, NOW(), NOW()),
                    ('3', '角色管理', 'team', 'menu', '/system/roles', 'system/role/index', '1', 2, 1, NOW(), NOW())
                    ON CONFLICT (id) DO NOTHING;
                    """
                    cursor.execute(insert_menu_query)
                    
                    print("初始数据插入成功！")
                else:
                    print("警告: 无法获取数据库游标，初始数据插入跳过。")
        except Exception as e:
            print(f"初始数据插入失败: {e}")
        finally:
            # 断开数据库连接
            db_connection.disconnect()

    @staticmethod
    def initialize_database():
        """初始化数据库（创建表和插入初始数据）"""
        print("开始初始化数据库...")
        DatabaseInitializer.create_tables()
        DatabaseInitializer.insert_initial_data()
        print("数据库初始化完成！")

if __name__ == "__main__":
    DatabaseInitializer.initialize_database()