# 基本信息管理模块模型定义
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# 乡镇基础信息模型
class TownshipBaseInfo(BaseModel):
    id: str = Field(..., description="乡镇ID")
    name: str = Field(..., description="乡镇名称")
    code: str = Field(..., description="乡镇代码")
    region_id: str = Field(..., description="所属区域ID")
    land_area: float = Field(..., description="土地面积")
    population: int = Field(..., description="人口数量")
    contact_person: str = Field(..., description="联系人")
    contact_phone: str = Field(..., description="联系电话")
    address: str = Field(..., description="地址")
    description: Optional[str] = Field(None, description="描述")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 乡镇基础信息创建请求
class CreateTownshipBaseInfoRequest(BaseModel):
    name: str = Field(..., description="乡镇名称")
    code: str = Field(..., description="乡镇代码")
    region_id: str = Field(..., description="所属区域ID")
    land_area: float = Field(..., description="土地面积")
    population: int = Field(..., description="人口数量")
    contact_person: str = Field(..., description="联系人")
    contact_phone: str = Field(..., description="联系电话")
    address: str = Field(..., description="地址")
    description: Optional[str] = Field(None, description="描述")
    status: int = Field(..., description="状态", enum=[0, 1])

# 乡镇基础信息更新请求
class UpdateTownshipBaseInfoRequest(BaseModel):
    name: Optional[str] = Field(None, description="乡镇名称")
    code: Optional[str] = Field(None, description="乡镇代码")
    region_id: Optional[str] = Field(None, description="所属区域ID")
    land_area: Optional[float] = Field(None, description="土地面积")
    population: Optional[int] = Field(None, description="人口数量")
    contact_person: Optional[str] = Field(None, description="联系人")
    contact_phone: Optional[str] = Field(None, description="联系电话")
    address: Optional[str] = Field(None, description="地址")
    description: Optional[str] = Field(None, description="描述")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 村队基础信息模型
class VillageBaseInfo(BaseModel):
    id: str = Field(..., description="村队ID")
    name: str = Field(..., description="村队名称")
    code: str = Field(..., description="村队代码")
    township_id: str = Field(..., description="所属乡镇ID")
    land_area: float = Field(..., description="土地面积")
    household_count: int = Field(..., description="户数")
    contact_person: str = Field(..., description="联系人")
    contact_phone: str = Field(..., description="联系电话")
    address: str = Field(..., description="地址")
    description: Optional[str] = Field(None, description="描述")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 村队基础信息创建请求
class CreateVillageBaseInfoRequest(BaseModel):
    name: str = Field(..., description="村队名称")
    code: str = Field(..., description="村队代码")
    township_id: str = Field(..., description="所属乡镇ID")
    land_area: float = Field(..., description="土地面积")
    household_count: int = Field(..., description="户数")
    contact_person: str = Field(..., description="联系人")
    contact_phone: str = Field(..., description="联系电话")
    address: str = Field(..., description="地址")
    description: Optional[str] = Field(None, description="描述")
    status: int = Field(..., description="状态", enum=[0, 1])

# 村队基础信息更新请求
class UpdateVillageBaseInfoRequest(BaseModel):
    name: Optional[str] = Field(None, description="村队名称")
    code: Optional[str] = Field(None, description="村队代码")
    township_id: Optional[str] = Field(None, description="所属乡镇ID")
    land_area: Optional[float] = Field(None, description="土地面积")
    household_count: Optional[int] = Field(None, description="户数")
    contact_person: Optional[str] = Field(None, description="联系人")
    contact_phone: Optional[str] = Field(None, description="联系电话")
    address: Optional[str] = Field(None, description="地址")
    description: Optional[str] = Field(None, description="描述")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 种植户信息模型
class FarmerInfo(BaseModel):
    id: str = Field(..., description="种植户ID")
    farmer_name: str = Field(..., description="种植户姓名")
    id_card_number: str = Field(..., description="身份证号码")
    phone_number: str = Field(..., description="手机号码")
    address: str = Field(..., description="地址")
    village_id: str = Field(..., description="所属村队ID")
    household_size: int = Field(..., description="家庭人口")
    cultivated_area: float = Field(..., description="种植面积")
    main_crops: List[str] = Field(..., description="主要种植作物")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 种植户信息创建请求
class CreateFarmerInfoRequest(BaseModel):
    farmer_name: str = Field(..., description="种植户姓名")
    id_card_number: str = Field(..., description="身份证号码")
    phone_number: str = Field(..., description="手机号码")
    address: str = Field(..., description="地址")
    village_id: str = Field(..., description="所属村队ID")
    household_size: int = Field(..., description="家庭人口")
    cultivated_area: float = Field(..., description="种植面积")
    main_crops: List[str] = Field(..., description="主要种植作物")
    status: int = Field(..., description="状态", enum=[0, 1])

# 种植户信息更新请求
class UpdateFarmerInfoRequest(BaseModel):
    farmer_name: Optional[str] = Field(None, description="种植户姓名")
    id_card_number: Optional[str] = Field(None, description="身份证号码")
    phone_number: Optional[str] = Field(None, description="手机号码")
    address: Optional[str] = Field(None, description="地址")
    village_id: Optional[str] = Field(None, description="所属村队ID")
    household_size: Optional[int] = Field(None, description="家庭人口")
    cultivated_area: Optional[float] = Field(None, description="种植面积")
    main_crops: Optional[List[str]] = Field(None, description="主要种植作物")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 种植户查询请求
class FarmerQueryRequest(BaseModel):
    farmer_name: Optional[str] = Field(None, description="种植户姓名")
    village_id: Optional[str] = Field(None, description="所属村队ID")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])
    page: int = Field(1, description="页码")
    page_size: int = Field(10, description="每页大小")