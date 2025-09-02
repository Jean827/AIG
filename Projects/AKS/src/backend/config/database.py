# 数据库配置模块
import os
import json
from typing import Optional

class DatabaseConfig:
    """数据库配置类"""
    def __init__(self):
        # 从配置文件读取数据库连接信息
        self.config_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            'config',
            'database_config.json'
        )
        self.config = self._load_config()
        
    def _load_config(self) -> dict:
        """加载数据库配置文件"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"警告: 无法加载数据库配置文件: {e}")
            # 返回默认配置
            return {
                "default": {
                    "engine": "postgresql",
                    "host": "localhost",
                    "port": 5432,
                    "database": "aks_agriculture",
                    "username": "super",
                    "password": "1qazxsw2",
                    "sslmode": "prefer"
                },
                "test": {
                    "engine": "postgresql",
                    "host": "localhost",
                    "port": 5432,
                    "database": "aks_agriculture_test",
                    "username": "super",
                    "password": "1qazxsw2",
                    "sslmode": "prefer"
                }
            }
    
    def get_connection_string(self, env: str = "default") -> str:
        """获取数据库连接字符串"""
        if env not in self.config:
            env = "default"
        
        db_config = self.config[env]
        return (
            f"postgresql://{db_config['username']}:{db_config['password']}@"
            f"{db_config['host']}:{db_config['port']}/{db_config['database']}?"
            f"sslmode={db_config['sslmode']}"
        )

# 单例实例
database_config = DatabaseConfig()