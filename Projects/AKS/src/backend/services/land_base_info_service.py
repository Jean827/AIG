# 土地基础信息模块服务层实现
import sys
import os
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# 导入模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.land_base_info import (
    LandTypePrice,
    LandBaseInfo,
    CreateLandTypePriceRequest,
    UpdateLandTypePriceRequest,
    CreateLandBaseInfoRequest,
    UpdateLandBaseInfoRequest
)


class LandBaseInfoService:
    def __init__(self):
        # 模拟数据库存储
        self.land_type_prices_db: Dict[str, LandTypePrice] = {}
        self.land_base_info_db: Dict[str, LandBaseInfo] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化土地类型价格数据
        land_type_price1 = LandTypePrice(
            id=str(uuid.uuid4()),
            land_type="耕地",
            land_code="GD001",
            unit_price=500.0,
            currency="元",
            effective_date=datetime(2023, 1, 1),
            expiry_date=datetime(2023, 12, 31),
            status=1,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.land_type_prices_db[land_type_price1.id] = land_type_price1
        
        land_type_price2 = LandTypePrice(
            id=str(uuid.uuid4()),
            land_type="林地",
            land_code="LD001",
            unit_price=300.0,
            currency="元",
            effective_date=datetime(2023, 1, 1),
            expiry_date=datetime(2023, 12, 31),
            status=1,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.land_type_prices_db[land_type_price2.id] = land_type_price2
    
    # 土地类型价格管理
    def get_land_type_prices(self, land_type: Optional[str] = None, status: Optional[int] = None) -> List[LandTypePrice]:
        """获取所有土地类型价格信息"""
        prices = list(self.land_type_prices_db.values())
        
        if land_type is not None:
            prices = [p for p in prices if p.land_type == land_type]
        if status is not None:
            prices = [p for p in prices if p.status == status]
            
        return prices
    
    def get_land_type_price_by_id(self, price_id: str) -> Optional[LandTypePrice]:
        """根据ID获取土地类型价格信息"""
        return self.land_type_prices_db.get(price_id)
    
    def create_land_type_price(self, request: CreateLandTypePriceRequest) -> LandTypePrice:
        """创建土地类型价格信息"""
        land_type_price = LandTypePrice(
            id=str(uuid.uuid4()),
            land_type=request.land_type,
            land_code=request.land_code,
            unit_price=request.unit_price,
            currency=request.currency,
            effective_date=request.effective_date,
            expiry_date=request.expiry_date,
            status=request.status,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.land_type_prices_db[land_type_price.id] = land_type_price
        return land_type_price
    
    def update_land_type_price(self, price_id: str, request: UpdateLandTypePriceRequest) -> Optional[LandTypePrice]:
        """更新土地类型价格信息"""
        if price_id not in self.land_type_prices_db:
            return None
        
        land_type_price = self.land_type_prices_db[price_id]
        if request.land_type is not None:
            land_type_price.land_type = request.land_type
        if request.land_code is not None:
            land_type_price.land_code = request.land_code
        if request.unit_price is not None:
            land_type_price.unit_price = request.unit_price
        if request.currency is not None:
            land_type_price.currency = request.currency
        if request.effective_date is not None:
            land_type_price.effective_date = request.effective_date
        if request.expiry_date is not None:
            land_type_price.expiry_date = request.expiry_date
        if request.status is not None:
            land_type_price.status = request.status
        land_type_price.update_time = datetime.now()
        
        self.land_type_prices_db[price_id] = land_type_price
        return land_type_price
    
    def delete_land_type_price(self, price_id: str) -> bool:
        """删除土地类型价格信息"""
        if price_id not in self.land_type_prices_db:
            return False
        
        del self.land_type_prices_db[price_id]
        return True
    
    def get_current_land_type_price(self, land_type: str, land_code: str) -> Optional[LandTypePrice]:
        """获取当前有效的土地类型价格"""
        now = datetime.now()
        valid_prices = [
            p for p in self.land_type_prices_db.values()
            if p.land_type == land_type and 
               p.land_code == land_code and 
               p.status == 1 and 
               p.effective_date <= now and 
               (p.expiry_date is None or p.expiry_date >= now)
        ]
        
        # 如果有多个有效价格，返回最新的
        if valid_prices:
            return max(valid_prices, key=lambda x: x.update_time)
        return None
    
    # 土地基础信息管理
    def get_land_base_info(self, 
                          land_code: Optional[str] = None, 
                          current_status: Optional[str] = None, 
                          village_id: Optional[str] = None) -> List[LandBaseInfo]:
        """获取所有土地基础信息"""
        lands = list(self.land_base_info_db.values())
        
        if land_code is not None:
            lands = [l for l in lands if l.land_code == land_code]
        if current_status is not None:
            lands = [l for l in lands if l.current_status == current_status]
        if village_id is not None:
            lands = [l for l in lands if l.village_id == village_id]
            
        return lands
    
    def get_land_base_info_by_id(self, land_id: str) -> Optional[LandBaseInfo]:
        """根据ID获取土地基础信息"""
        return self.land_base_info_db.get(land_id)
    
    def create_land_base_info(self, request: CreateLandBaseInfoRequest) -> LandBaseInfo:
        """创建土地基础信息"""
        land = LandBaseInfo(
            id=str(uuid.uuid4()),
            land_code=request.land_code,
            land_name=request.land_name,
            land_type_id=request.land_type_id,
            area=request.area,
            unit=request.unit,
            location=request.location,
            village_id=request.village_id,
            latitude=request.latitude,
            longitude=request.longitude,
            shape_data=request.shape_data,
            soil_type=request.soil_type,
            irrigation_condition=request.irrigation_condition,
            road_condition=request.road_condition,
            current_status=request.current_status,
            remark=request.remark,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.land_base_info_db[land.id] = land
        return land
    
    def update_land_base_info(self, land_id: str, request: UpdateLandBaseInfoRequest) -> Optional[LandBaseInfo]:
        """更新土地基础信息"""
        if land_id not in self.land_base_info_db:
            return None
        
        land = self.land_base_info_db[land_id]
        if request.land_code is not None:
            land.land_code = request.land_code
        if request.land_name is not None:
            land.land_name = request.land_name
        if request.land_type_id is not None:
            land.land_type_id = request.land_type_id
        if request.area is not None:
            land.area = request.area
        if request.unit is not None:
            land.unit = request.unit
        if request.location is not None:
            land.location = request.location
        if request.village_id is not None:
            land.village_id = request.village_id
        if request.latitude is not None:
            land.latitude = request.latitude
        if request.longitude is not None:
            land.longitude = request.longitude
        if request.shape_data is not None:
            land.shape_data = request.shape_data
        if request.soil_type is not None:
            land.soil_type = request.soil_type
        if request.irrigation_condition is not None:
            land.irrigation_condition = request.irrigation_condition
        if request.road_condition is not None:
            land.road_condition = request.road_condition
        if request.current_status is not None:
            land.current_status = request.current_status
        if request.remark is not None:
            land.remark = request.remark
        land.update_time = datetime.now()
        
        self.land_base_info_db[land_id] = land
        return land
    
    def delete_land_base_info(self, land_id: str) -> bool:
        """删除土地基础信息"""
        if land_id not in self.land_base_info_db:
            return False
        
        del self.land_base_info_db[land_id]
        return True


# 创建服务实例供导入使用
land_base_info_service = LandBaseInfoService()