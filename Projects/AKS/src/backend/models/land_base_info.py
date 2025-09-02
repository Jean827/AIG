# 土地基础信息模块模型定义
from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field

# 地类单价设置模型
class LandTypePrice(BaseModel):
    id: str = Field(..., description="地类单价ID")
    land_type: str = Field(..., description="地类")
    land_code: str = Field(..., description="地类代码")
    unit_price: float = Field(..., description="单价")
    currency: str = Field(default="元", description="货币单位")
    effective_date: datetime = Field(..., description="生效日期")
    expiry_date: Optional[datetime] = Field(None, description="失效日期")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 枚举定义
class LandStatusEnum(str):
    IDLE = "空闲"
    CONTRACTED = "已承包"
    LEASED = "已出租"
    TRANSFERRED = "已转让"
    OTHER = "其他"

# 地类单价创建请求
class CreateLandTypePriceRequest(BaseModel):
    land_type: str = Field(..., description="地类")
    land_code: str = Field(..., description="地类代码")
    unit_price: float = Field(..., description="单价")
    currency: str = Field(default="元", description="货币单位")
    effective_date: datetime = Field(..., description="生效日期")
    expiry_date: Optional[datetime] = Field(None, description="失效日期")
    status: int = Field(..., description="状态", enum=[0, 1])

# 地类单价更新请求
class UpdateLandTypePriceRequest(BaseModel):
    land_type: Optional[str] = Field(None, description="地类")
    land_code: Optional[str] = Field(None, description="地类代码")
    unit_price: Optional[float] = Field(None, description="单价")
    currency: Optional[str] = Field(None, description="货币单位")
    effective_date: Optional[datetime] = Field(None, description="生效日期")
    expiry_date: Optional[datetime] = Field(None, description="失效日期")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 土地基础信息模型
class LandBaseInfo(BaseModel):
    id: str = Field(..., description="土地ID")
    land_code: str = Field(..., description="土地编号")
    land_name: str = Field(..., description="土地名称")
    land_type_id: str = Field(..., description="地类ID")
    area: float = Field(..., description="面积")
    unit: str = Field(default="亩", description="面积单位")
    location: str = Field(..., description="地理位置")
    village_id: str = Field(..., description="所属村队ID")
    latitude: Optional[float] = Field(None, description="纬度")
    longitude: Optional[float] = Field(None, description="经度")
    shape_data: Optional[Dict] = Field(None, description="土地形状数据")
    soil_type: Optional[str] = Field(None, description="土壤类型")
    irrigation_condition: Optional[str] = Field(None, description="灌溉条件")
    road_condition: Optional[str] = Field(None, description="道路条件")
    current_status: str = Field(..., description="当前状态", enum=["空闲", "已承包", "已出租", "已转让", "其他"])
    remark: Optional[str] = Field(None, description="备注")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 土地基础信息创建请求
class CreateLandBaseInfoRequest(BaseModel):
    land_code: str = Field(..., description="土地编号")
    land_name: str = Field(..., description="土地名称")
    land_type_id: str = Field(..., description="地类ID")
    area: float = Field(..., description="面积")
    unit: str = Field(default="亩", description="面积单位")
    location: str = Field(..., description="地理位置")
    village_id: str = Field(..., description="所属村队ID")
    latitude: Optional[float] = Field(None, description="纬度")
    longitude: Optional[float] = Field(None, description="经度")
    shape_data: Optional[Dict] = Field(None, description="土地形状数据")
    soil_type: Optional[str] = Field(None, description="土壤类型")
    irrigation_condition: Optional[str] = Field(None, description="灌溉条件")
    road_condition: Optional[str] = Field(None, description="道路条件")
    current_status: str = Field(..., description="当前状态", enum=["空闲", "已承包", "已出租", "已转让", "其他"])
    remark: Optional[str] = Field(None, description="备注")

# 土地基础信息更新请求
class UpdateLandBaseInfoRequest(BaseModel):
    land_code: Optional[str] = Field(None, description="土地编号")
    land_name: Optional[str] = Field(None, description="土地名称")
    land_type_id: Optional[str] = Field(None, description="地类ID")
    area: Optional[float] = Field(None, description="面积")
    unit: Optional[str] = Field(None, description="面积单位")
    location: Optional[str] = Field(None, description="地理位置")
    village_id: Optional[str] = Field(None, description="所属村队ID")
    latitude: Optional[float] = Field(None, description="纬度")
    longitude: Optional[float] = Field(None, description="经度")
    shape_data: Optional[Dict] = Field(None, description="土地形状数据")
    soil_type: Optional[str] = Field(None, description="土壤类型")
    irrigation_condition: Optional[str] = Field(None, description="灌溉条件")
    road_condition: Optional[str] = Field(None, description="道路条件")
    current_status: Optional[str] = Field(None, description="当前状态", enum=["空闲", "已承包", "已出租", "已转让", "其他"])
    remark: Optional[str] = Field(None, description="备注")

# 土地查询请求
class LandQueryRequest(BaseModel):
    land_code: Optional[str] = Field(None, description="土地编号")
    land_name: Optional[str] = Field(None, description="土地名称")
    land_type: Optional[str] = Field(None, description="地类")
    village_id: Optional[str] = Field(None, description="所属村队ID")
    current_status: Optional[str] = Field(None, description="当前状态")
    page: int = Field(1, description="页码")
    page_size: int = Field(10, description="每页大小")