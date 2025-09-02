# 数据库连接工具
from typing import Optional, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from config.database import database_config
import os

class DatabaseConnection:
    """数据库连接管理类"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance._connection = None
        return cls._instance
    
    def __init__(self):
        # 初始化时不创建连接，延迟到需要时创建
        pass
    
    def connect(self, env: str = "default") -> None:
        """创建数据库连接"""
        if self._connection and not self._connection.closed:
            return
        
        try:
            conn_string = database_config.get_connection_string(env)
            self._connection = psycopg2.connect(
                conn_string,
                cursor_factory=RealDictCursor
            )
            print("数据库连接成功")
        except psycopg2.OperationalError as e:
            print(f"数据库连接失败: {e}")
            # 在连接失败的情况下，继续使用模拟数据
            print("将继续使用模拟数据进行开发和测试")
    
    def disconnect(self) -> None:
        """关闭数据库连接"""
        if self._connection and not self._connection.closed:
            self._connection.close()
            print("数据库连接已关闭")
    
    @contextmanager
    def get_cursor(self):
        """获取数据库游标，使用上下文管理器自动处理提交和回滚"""
        if not self._connection or self._connection.closed:
            self.connect()
            
        # 如果连接仍然关闭（可能是连接失败），返回None
        if not self._connection or self._connection.closed:
            yield None
            return
        
        cursor = None
        try:
            cursor = self._connection.cursor()
            yield cursor
            self._connection.commit()
        except Exception as e:
            if self._connection and not self._connection.closed:
                self._connection.rollback()
            print(f"数据库操作失败: {e}")
            # 如果操作失败，仍然返回None，让上层代码使用模拟数据
            yield None
        finally:
            if cursor:
                cursor.close()

# 单例实例
db_connection = DatabaseConnection()