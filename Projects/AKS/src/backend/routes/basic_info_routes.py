# 基本信息管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.basic_info import (
    TownshipBaseInfo, 
    VillageBaseInfo, 
    FarmerInfo,
    CreateTownshipBaseInfoRequest, 
    UpdateTownshipBaseInfoRequest,
    CreateVillageBaseInfoRequest, 
    UpdateVillageBaseInfoRequest,
    CreateFarmerInfoRequest, 
    UpdateFarmerInfoRequest,
    FarmerQueryRequest
)
from services.basic_info_service import basic_info_service

# 创建路由实例
router = APIRouter(
    prefix="/api/basic-info",
    tags=["Basic Information"],
    responses={404: {"description": "Not found"}}
)


# 乡镇基本信息管理路由
@router.get("/townships", response_model=List[TownshipBaseInfo])
def get_townships(
    township_name: Optional[str] = None,
    township_code: Optional[str] = None,
    status: Optional[str] = None
):
    """获取乡镇列表"""
    return basic_info_service.get_townships(township_name, township_code, status)


@router.get("/townships/{township_id}", response_model=TownshipBaseInfo)
def get_township_by_id(township_id: str):
    """根据ID获取乡镇信息"""
    township = basic_info_service.get_township_by_id(township_id)
    if not township:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township with id {township_id} not found"
        )
    return township


@router.post("/townships", response_model=TownshipBaseInfo, status_code=status.HTTP_201_CREATED)
def create_township(request: CreateTownshipBaseInfoRequest):
    """创建乡镇信息"""
    return basic_info_service.create_township(request)


@router.put("/townships/{township_id}", response_model=TownshipBaseInfo)
def update_township(township_id: str, request: UpdateTownshipBaseInfoRequest):
    """更新乡镇信息"""
    township = basic_info_service.update_township(township_id, request)
    if not township:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township with id {township_id} not found"
        )
    return township


@router.delete("/townships/{township_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_township(township_id: str):
    """删除乡镇信息"""
    success = basic_info_service.delete_township(township_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete township with id {township_id} as it has associated villages or farmers"
        )


# 村基本信息管理路由
@router.get("/villages", response_model=List[VillageBaseInfo])
def get_villages(
    village_name: Optional[str] = None,
    village_code: Optional[str] = None,
    township_id: Optional[str] = None,
    status: Optional[str] = None
):
    """获取村列表"""
    return basic_info_service.get_villages(village_name, village_code, township_id, status)


@router.get("/villages/{village_id}", response_model=VillageBaseInfo)
def get_village_by_id(village_id: str):
    """根据ID获取村信息"""
    village = basic_info_service.get_village_by_id(village_id)
    if not village:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Village with id {village_id} not found"
        )
    return village


@router.post("/villages", response_model=VillageBaseInfo, status_code=status.HTTP_201_CREATED)
def create_village(request: CreateVillageBaseInfoRequest):
    """创建村信息"""
    village = basic_info_service.create_village(request)
    if not village:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid township_id provided"
        )
    return village


@router.put("/villages/{village_id}", response_model=VillageBaseInfo)
def update_village(village_id: str, request: UpdateVillageBaseInfoRequest):
    """更新村信息"""
    village = basic_info_service.update_village(village_id, request)
    if not village:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Village with id {village_id} not found"
        )
    return village


@router.delete("/villages/{village_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_village(village_id: str):
    """删除村信息"""
    success = basic_info_service.delete_village(village_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete village with id {village_id} as it has associated farmers"
        )


# 农户信息管理路由
@router.get("/users", response_model=List[FarmerInfo])
def get_users(
    user_name: Optional[str] = None,
    id_card: Optional[str] = None,
    village_id: Optional[str] = None,
    status: Optional[str] = None
):
    """获取用户列表"""
    return basic_info_service.get_users(user_name, id_card, village_id, status)


@router.get("/users/{user_id}", response_model=FarmerInfo)
def get_user_by_id(user_id: str):
    """根据ID获取用户信息"""
    user = basic_info_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


@router.post("/users", response_model=FarmerInfo, status_code=status.HTTP_201_CREATED)
def create_user(request: CreateFarmerInfoRequest):
    """创建用户信息"""
    user = basic_info_service.create_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid village_id provided or duplicate ID card"
        )
    return user


@router.put("/users/{user_id}", response_model=FarmerInfo)
def update_user(user_id: str, request: UpdateFarmerInfoRequest):
    """更新用户信息"""
    user = basic_info_service.update_user(user_id, request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str):
    """删除用户信息"""
    success = basic_info_service.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )


# 高级查询路由
@router.post("/users/query", response_model=List[FarmerInfo])
def query_users(request: FarmerQueryRequest):
    """高级查询用户信息"""
    return basic_info_service.query_users(request)


# 批量操作路由
@router.post("/townships/batch", status_code=status.HTTP_201_CREATED)
def batch_create_townships(requests: List[CreateTownshipBaseInfoRequest]):
    """批量创建乡镇信息"""
    created_townships = []
    for req in requests:
        township = basic_info_service.create_township(req)
        created_townships.append(township)
    return {
        "created_count": len(created_townships),
        "created_ids": [t.id for t in created_townships]
    }


@router.post("/villages/batch", status_code=status.HTTP_201_CREATED)
def batch_create_villages(requests: List[CreateVillageBaseInfoRequest]):
    """批量创建村信息"""
    created_villages = []
    for req in requests:
        village = basic_info_service.create_village(req)
        if village:
            created_villages.append(village)
    return {
        "created_count": len(created_villages),
        "created_ids": [v.id for v in created_villages]
    }


@router.post("/users/batch", status_code=status.HTTP_201_CREATED)
def batch_create_users(requests: List[CreateFarmerInfoRequest]):
    """批量创建用户信息"""
    created_users = []
    for req in requests:
        user = basic_info_service.create_user(req)
        if user:
            created_users.append(user)
    return {
        "created_count": len(created_users),
        "created_ids": [u.id for u in created_users]
    }


# 数据统计路由
@router.get("/statistics/townships")
def get_township_statistics():
    """获取乡镇统计信息"""
    return basic_info_service.get_township_statistics()


@router.get("/statistics/villages")
def get_village_statistics():
    """获取村统计信息"""
    return basic_info_service.get_village_statistics()


@router.get("/statistics/farmers")
def get_farmer_statistics():
    """获取农户统计信息"""
    return basic_info_service.get_farmer_statistics()


@router.get("/statistics/township/{township_id}/villages")
def get_villages_by_township_statistics(township_id: str):
    """获取指定乡镇的村统计信息"""
    statistics = basic_info_service.get_villages_by_township_statistics(township_id)
    if statistics is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township with id {township_id} not found"
        )
    return statistics


@router.get("/statistics/village/{village_id}/farmers")
def get_farmers_by_village_statistics(village_id: str):
    """获取指定村的农户统计信息"""
    statistics = basic_info_service.get_farmers_by_village_statistics(village_id)
    if statistics is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Village with id {village_id} not found"
        )
    return statistics


# 导出数据路由
@router.get("/export/townships")
def export_townships():
    """导出乡镇数据"""
    file_path = basic_info_service.export_townships()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/villages")
def export_villages():
    """导出村数据"""
    file_path = basic_info_service.export_villages()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/farmers")
def export_farmers():
    """导出农户数据"""
    file_path = basic_info_service.export_farmers()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


# 关系查询路由
@router.get("/township/{township_id}/villages", response_model=List[VillageBaseInfo])
def get_villages_by_township(township_id: str):
    """获取指定乡镇的所有村"""
    villages = basic_info_service.get_villages_by_township(township_id)
    if villages is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township with id {township_id} not found"
        )
    return villages


@router.get("/village/{village_id}/farmers", response_model=List[FarmerInfo])
def get_farmers_by_village(village_id: str):
    """获取指定村的所有农户"""
    farmers = basic_info_service.get_farmers_by_village(village_id)
    if farmers is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Village with id {village_id} not found"
        )
    return farmers


@router.get("/township/{township_id}/farmers", response_model=List[FarmerInfo])
def get_farmers_by_township(township_id: str):
    """获取指定乡镇的所有农户"""
    farmers = basic_info_service.get_farmers_by_township(township_id)
    if farmers is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township with id {township_id} not found"
        )
    return farmers