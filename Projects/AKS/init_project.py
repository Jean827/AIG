import os
import json
import subprocess

# 项目根目录
project_root = os.path.dirname(os.path.abspath(__file__))

# 初始化项目配置函数
def init_project():
    print("正在初始化阿克苏智慧农业数字化运营管理平台项目...")
    
    # 创建后端配置文件
    create_backend_config()
    
    # 创建数据库配置文件
    create_db_config()
    
    # 创建API文档目录
    create_api_docs()
    
    print("项目初始化完成！")

# 创建后端配置文件
def create_backend_config():
    config_dir = os.path.join(project_root, "config")
    backend_config_path = os.path.join(config_dir, "backend_config.json")
    
    # 检查目录是否存在
    if not os.path.exists(config_dir):
        os.makedirs(config_dir)
    
    # 创建后端配置
    backend_config = {
        "app_name": "阿克苏智慧农业数字化运营管理平台",
        "version": "1.0.0",
        "debug": True,
        "host": "0.0.0.0",
        "port": 8000,
        "allowed_origins": [
            "http://localhost:3000",
            "http://localhost:8000"
        ],
        "jwt_secret": "your-secret-key",
        "jwt_expire": 86400,
        "log_level": "INFO"
    }
    
    # 写入配置文件
    with open(backend_config_path, 'w', encoding='utf-8') as f:
        json.dump(backend_config, f, ensure_ascii=False, indent=4)
    
    print(f"后端配置文件已创建: {backend_config_path}")

# 创建数据库配置文件
def create_db_config():
    config_dir = os.path.join(project_root, "config")
    db_config_path = os.path.join(config_dir, "database_config.json")
    
    # 创建数据库配置
    db_config = {
        "default": {
            "engine": "postgresql",
            "host": "localhost",
            "port": 5432,
            "database": "aks_agriculture",
            "username": "postgres",
            "password": "postgres",
            "sslmode": "prefer"
        },
        "test": {
            "engine": "postgresql",
            "host": "localhost",
            "port": 5432,
            "database": "aks_agriculture_test",
            "username": "postgres",
            "password": "postgres",
            "sslmode": "prefer"
        }
    }
    
    # 写入配置文件
    with open(db_config_path, 'w', encoding='utf-8') as f:
        json.dump(db_config, f, ensure_ascii=False, indent=4)
    
    print(f"数据库配置文件已创建: {db_config_path}")
    print("注意：请根据实际环境修改数据库连接信息")

# 创建API文档目录和基本结构
def create_api_docs():
    docs_dir = os.path.join(project_root, "docs")
    api_docs_dir = os.path.join(docs_dir, "api")
    
    # 检查目录是否存在
    if not os.path.exists(api_docs_dir):
        os.makedirs(api_docs_dir)
    
    # 创建API文档README
    api_readme_path = os.path.join(api_docs_dir, "README.md")
    api_readme_content = """# API 文档

本目录包含阿克苏智慧农业数字化运营管理平台的所有API文档。

## 目录结构

- `basic_info/`: 基本信息管理相关API
- `land_management/`: 土地管理相关API
- `account_business/`: 账户业务相关API
- `auction_management/`: 竞拍管理相关API
- `contract_management/`: 合同管理相关API
- `fee_management/`: 费用管理相关API
- `payment_management/`: 收费管理相关API
- `finance_management/`: 融资与确权管理相关API
- `system_management/`: 系统管理相关API

## API文档规范

请参考Swagger/OpenAPI规范编写API文档。"""
    
    # 写入API文档README
    with open(api_readme_path, 'w', encoding='utf-8') as f:
        f.write(api_readme_content)
    
    print(f"API文档目录已创建: {api_docs_dir}")

if __name__ == "__main__":
    init_project()