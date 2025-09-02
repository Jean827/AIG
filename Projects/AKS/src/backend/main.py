# 主应用程序文件
import sys
import os
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# 创建FastAPI应用实例
app = FastAPI(
    title="AKS - Agricultural Land System",
    description="农村土地综合管理系统API",
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "系统管理员",
        "url": "http://example.com/contact/",
        "email": "admin@example.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 导入所有路由模块
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 系统管理模块路由
from routes.system_management_routes import router as system_management_router

# 基础信息管理模块路由
from routes.basic_info_routes import router as basic_info_router

# 土地基础信息模块路由
from routes.land_base_info_routes import router as land_base_info_router

# 账户管理模块路由
from routes.account_management_routes import router as account_management_router

# 土地竞价管理模块路由
from routes.land_bidding_routes import router as land_bidding_router

# 合同管理模块路由
from routes.contract_management_routes import router as contract_management_router

# 费用管理模块路由
from routes.fee_management_routes import router as fee_management_router

# 融资确权管理模块路由
from routes.financing_management_routes import router as financing_management_router

# 注册路由
app.include_router(system_management_router)
app.include_router(basic_info_router)
app.include_router(land_base_info_router)
app.include_router(account_management_router)
app.include_router(land_bidding_router)
app.include_router(contract_management_router)
app.include_router(fee_management_router)
app.include_router(financing_management_router)

# 静态文件服务
# 创建uploads目录（如果不存在）
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory=uploads_dir), name="static")


# 健康检查端点
@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """服务健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


# 根路径端点
@app.get("/")
def root():
    """系统根路径"""
    return {
        "message": "Welcome to AKS - Agricultural Land System",
        "api_docs": "/docs",
        "redoc": "/redoc"
    }


# 文件下载端点
@app.get("/download/{file_name}")
def download_file(file_name: str):
    """下载文件"""
    file_path = os.path.join(uploads_dir, file_name)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File {file_name} not found"
        )
    return FileResponse(
        path=file_path,
        filename=file_name,
        media_type='application/octet-stream'
    )


# 全局异常处理
@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    """全局异常处理器"""
    logger.error(f"全局异常: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc)
        }
    )


@app.exception_handler(HTTPException)
def http_exception_handler(request, exc):
    """HTTP异常处理器"""
    logger.error(f"HTTP异常: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


# 启动服务
if __name__ == "__main__":
    try:
        logger.info("正在启动AKS系统服务...")
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True  # 开发模式下启用自动重载
        )
    except KeyboardInterrupt:
        logger.info("接收到终止信号，正在关闭服务...")
    except Exception as e:
        logger.error(f"服务启动失败: {str(e)}", exc_info=True)