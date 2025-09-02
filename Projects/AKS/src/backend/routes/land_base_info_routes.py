# 土地基础信息管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.land_base_info import (
    LandTypePrice, 
    LandBaseInfo,
    CreateLandTypePriceRequest, 
    UpdateLandTypePriceRequest,
    CreateLandBaseInfoRequest, 
    UpdateLandBaseInfoRequest,
    LandQueryRequest
)
from services.land_base_info_service import land_base_info_service

# 创建路由实例
router = APIRouter(
    prefix="/api/land-base-info",
    tags=["Land Base Information"],
    responses={404: {"description": "Not found"}}
)


# 土地类型价格管理路由
@router.get("/type-prices", response_model=List[LandTypePrice])
def get_land_type_prices(
    land_type: Optional[str] = None,
    region: Optional[str] = None,
    effective_date_from: Optional[datetime] = None,
    effective_date_to: Optional[datetime] = None
):
    """获取土地类型价格列表"""
    return land_base_info_service.get_land_type_prices(land_type, region, effective_date_from, effective_date_to)


@router.get("/type-prices/{price_id}", response_model=LandTypePrice)
def get_land_type_price_by_id(price_id: str):
    """根据ID获取土地类型价格"""
    price = land_base_info_service.get_land_type_price_by_id(price_id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Land type price with id {price_id} not found"
        )
    return price


@router.post("/type-prices", response_model=LandTypePrice, status_code=status.HTTP_201_CREATED)
def create_land_type_price(request: CreateLandTypePriceRequest):
    """创建土地类型价格"""
    return land_base_info_service.create_land_type_price(request)


@router.put("/type-prices/{price_id}", response_model=LandTypePrice)
def update_land_type_price(price_id: str, request: UpdateLandTypePriceRequest):
    """更新土地类型价格"""
    price = land_base_info_service.update_land_type_price(price_id, request)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Land type price with id {price_id} not found"
        )
    return price


@router.delete("/type-prices/{price_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_land_type_price(price_id: str):
    """删除土地类型价格"""
    success = land_base_info_service.delete_land_type_price(price_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Land type price with id {price_id} not found"
        )


# 土地基础信息管理路由
@router.get("/lands", response_model=List[LandBaseInfo])
def get_lands(
    land_code: Optional[str] = None,
    land_name: Optional[str] = None,
    land_type: Optional[str] = None,
    village_id: Optional[str] = None,
    status: Optional[str] = None,
    farmer_id: Optional[str] = None
):
    """获取土地基础信息列表"""
    return land_base_info_service.get_lands(land_code, land_name, land_type, village_id, status, farmer_id)


@router.get("/lands/{land_id}", response_model=LandBaseInfo)
def get_land_by_id(land_id: str):
    """根据ID获取土地基础信息"""
    land = land_base_info_service.get_land_by_id(land_id)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Land with id {land_id} not found"
        )
    return land


@router.post("/lands", response_model=LandBaseInfo, status_code=status.HTTP_201_CREATED)
def create_land(request: CreateLandBaseInfoRequest):
    """创建土地基础信息"""
    land = land_base_info_service.create_land(request)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid village_id provided"
        )
    return land


@router.put("/lands/{land_id}", response_model=LandBaseInfo)
def update_land(land_id: str, request: UpdateLandBaseInfoRequest):
    """更新土地基础信息"""
    land = land_base_info_service.update_land(land_id, request)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Land with id {land_id} not found"
        )
    return land


@router.delete("/lands/{land_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_land(land_id: str):
    """删除土地基础信息"""
    success = land_base_info_service.delete_land(land_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete land with id {land_id} as it is currently allocated or has pending operations"
        )


# 高级查询路由
@router.post("/lands/query", response_model=List[LandBaseInfo])
def query_lands(request: LandQueryRequest):
    """高级查询土地信息"""
    return land_base_info_service.query_lands(request)


# 批量操作路由
@router.post("/type-prices/batch", status_code=status.HTTP_201_CREATED)
def batch_create_land_type_prices(requests: List[CreateLandTypePriceRequest]):
    """批量创建土地类型价格"""
    created_prices = []
    for req in requests:
        price = land_base_info_service.create_land_type_price(req)
        created_prices.append(price)
    return {
        "created_count": len(created_prices),
        "created_ids": [p.id for p in created_prices]
    }


@router.post("/lands/batch", status_code=status.HTTP_201_CREATED)
def batch_create_lands(requests: List[CreateLandBaseInfoRequest]):
    """批量创建土地基础信息"""
    created_lands = []
    for req in requests:
        land = land_base_info_service.create_land(req)
        if land:
            created_lands.append(land)
    return {
        "created_count": len(created_lands),
        "created_ids": [l.id for l in created_lands]
    }


# 数据统计路由
@router.get("/statistics/type-prices")
def get_land_type_price_statistics():
    """获取土地类型价格统计信息"""
    return land_base_info_service.get_land_type_price_statistics()


@router.get("/statistics/lands")
def get_land_statistics():
    """获取土地基础信息统计信息"""
    return land_base_info_service.get_land_statistics()


@router.get("/statistics/lands/township/{township_id}")
def get_lands_by_township_statistics(township_id: str):
    """获取指定乡镇的土地统计信息"""
    statistics = land_base_info_service.get_lands_by_township_statistics(township_id)
    if statistics is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No lands found for township with id {township_id}"
        )
    return statistics


@router.get("/statistics/lands/village/{village_id}")
def get_lands_by_village_statistics(village_id: str):
    """获取指定村的土地统计信息"""
    statistics = land_base_info_service.get_lands_by_village_statistics(village_id)
    if statistics is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No lands found for village with id {village_id}"
        )
    return statistics


# 导出数据路由
@router.get("/export/type-prices")
def export_land_type_prices():
    """导出土地类型价格数据"""
    file_path = land_base_info_service.export_land_type_prices()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/lands")
def export_lands():
    """导出土地基础信息数据"""
    file_path = land_base_info_service.export_lands()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


# 关系查询路由
@router.get("/lands/village/{village_id}", response_model=List[LandBaseInfo])
def get_lands_by_village(village_id: str):
    """获取指定村的所有土地"""
    lands = land_base_info_service.get_lands_by_village(village_id)
    if lands is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No lands found for village with id {village_id}"
        )
    return lands


@router.get("/lands/farmer/{farmer_id}", response_model=List[LandBaseInfo])
def get_lands_by_farmer(farmer_id: str):
    """获取指定农户的所有土地"""
    lands = land_base_info_service.get_lands_by_farmer(farmer_id)
    if lands is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No lands found for farmer with id {farmer_id}"
        )
    return lands


# 土地价值计算路由
@router.get("/lands/{land_id}/calculate-value")
def calculate_land_value(land_id: str, area: Optional[float] = None):
    """计算土地价值"""
    land = land_base_info_service.get_land_by_id(land_id)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Land with id {land_id} not found"
        )
    
    # 使用传入的面积或土地记录中的面积
    calc_area = area if area is not None else land.area
    
    value = land_base_info_service.calculate_land_value(land_id, calc_area)
    return {
        "land_id": land_id,
        "area": calc_area,
        "calculated_value": value,
        "currency": "CNY"
    }