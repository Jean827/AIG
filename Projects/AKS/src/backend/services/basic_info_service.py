# 基本信息管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# 导入模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.basic_info import (
    TownshipBaseInfo,
    VillageBaseInfo,
    FarmerInfo,
    CreateTownshipBaseInfoRequest as CreateTownshipRequest,
    UpdateTownshipBaseInfoRequest as UpdateTownshipRequest,
    CreateVillageBaseInfoRequest as CreateVillageRequest,
    UpdateVillageBaseInfoRequest as UpdateVillageRequest,
    CreateFarmerInfoRequest as CreateFarmerRequest,
    UpdateFarmerInfoRequest as UpdateFarmerRequest
)


class BasicInfoService:
    def __init__(self):
        # 模拟数据库存储
        self.townships_db: Dict[str, TownshipBaseInfo] = {}
        self.villages_db: Dict[str, VillageBaseInfo] = {}
        self.farmers_db: Dict[str, FarmerInfo] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化乡镇数据
        township1 = TownshipBaseInfo(
            id=str(uuid.uuid4()),
            name="北屯镇",
            code="BTZ001",
            region_id="REG001",
            land_area=1200.5,
            population=25000,
            contact_person="张三",
            contact_phone="13800138001",
            address="阿克苏市团结路1号",
            description="北屯镇是阿克苏地区的重要农业区",
            status=1,  # 1: 启用
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.townships_db[township1.id] = township1
        
        # 初始化村庄数据
        village1 = VillageBaseInfo(
            id=str(uuid.uuid4()),
            name="团结村",
            code="TJCV001",
            township_id=township1.id,
            land_area=2500.5,
            household_count=1500,
            contact_person="李四",
            contact_phone="13800138002",
            address="团结村1组",
            description="团结村位于北屯镇东部",
            status=1,  # 1: 启用
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.villages_db[village1.id] = village1
        
        # 初始化农户数据
        farmer1 = FarmerInfo(
            id=str(uuid.uuid4()),
            farmer_name="王五",
            id_card_number="110101199001010001",
            phone_number="13800138003",
            address="团结村1组1号",
            village_id=village1.id,
            household_size=4,
            cultivated_area=15.5,
            main_crops=["小麦", "棉花"],
            status=1,  # 1: 启用
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.farmers_db[farmer1.id] = farmer1
    
    # 乡镇信息管理
    def get_townships(self, status: Optional[int] = None) -> List[TownshipBaseInfo]:
        """获取所有乡镇信息"""
        if status is not None:
            return [t for t in self.townships_db.values() if t.status == status]
        return list(self.townships_db.values())
    
    def get_township_by_id(self, township_id: str) -> Optional[TownshipBaseInfo]:
        """根据ID获取乡镇信息"""
        return self.townships_db.get(township_id)
    
    def create_township(self, request: CreateTownshipRequest) -> TownshipBaseInfo:
        """创建乡镇信息"""
        township = TownshipBaseInfo(
            id=str(uuid.uuid4()),
            name=request.name,
            code=request.code,
            region_id=request.region_id,
            land_area=request.land_area,
            population=request.population,
            contact_person=request.contact_person,
            contact_phone=request.contact_phone,
            address=request.address,
            description=request.description,
            status=request.status,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.townships_db[township.id] = township
        return township
    
    def update_township(self, township_id: str, request: UpdateTownshipRequest) -> Optional[TownshipBaseInfo]:
        """更新乡镇信息"""
        if township_id not in self.townships_db:
            return None
        
        township = self.townships_db[township_id]
        if request.name is not None:
            township.name = request.name
        if request.code is not None:
            township.code = request.code
        if request.region_id is not None:
            township.region_id = request.region_id
        if request.land_area is not None:
            township.land_area = request.land_area
        if request.population is not None:
            township.population = request.population
        if request.contact_person is not None:
            township.contact_person = request.contact_person
        if request.contact_phone is not None:
            township.contact_phone = request.contact_phone
        if request.address is not None:
            township.address = request.address
        if request.description is not None:
            township.description = request.description
        if request.status is not None:
            township.status = request.status
        township.update_time = datetime.now()
        
        self.townships_db[township_id] = township
        return township
    
    def delete_township(self, township_id: str) -> bool:
        """删除乡镇信息"""
        if township_id not in self.townships_db:
            return False
        
        # 检查是否有关联的村庄
        has_related_villages = any(
            village.township_id == township_id for village in self.villages_db.values()
        )
        
        if has_related_villages:
            # 如果有关联的村庄，不允许删除
            return False
        
        del self.townships_db[township_id]
        return True
    
    # 村庄信息管理
    def get_villages(self, township_id: Optional[str] = None, status: Optional[int] = None) -> List[VillageBaseInfo]:
        """获取所有村庄信息"""
        villages = list(self.villages_db.values())
        
        if township_id:
            villages = [v for v in villages if v.township_id == township_id]
        if status is not None:
            villages = [v for v in villages if v.status == status]
            
        return villages
    
    def get_village_by_id(self, village_id: str) -> Optional[VillageBaseInfo]:
        """根据ID获取村庄信息"""
        return self.villages_db.get(village_id)
    
    def create_village(self, request: CreateVillageRequest) -> Optional[VillageBaseInfo]:
        """创建村庄信息"""
        # 检查乡镇是否存在
        if request.township_id not in self.townships_db:
            return None
        
        village = VillageBaseInfo(
            id=str(uuid.uuid4()),
            name=request.name,
            code=request.code,
            township_id=request.township_id,
            land_area=request.land_area,
            household_count=request.household_count,
            contact_person=request.contact_person,
            contact_phone=request.contact_phone,
            address=request.address,
            description=request.description,
            status=request.status,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.villages_db[village.id] = village
        return village
    
    def update_village(self, village_id: str, request: UpdateVillageRequest) -> Optional[VillageBaseInfo]:
        """更新村庄信息"""
        if village_id not in self.villages_db:
            return None
        
        village = self.villages_db[village_id]
        if request.township_id and request.township_id != village.township_id:
            # 检查新的乡镇是否存在
            if request.township_id not in self.townships_db:
                return None
            village.township_id = request.township_id
        if request.name is not None:
            village.name = request.name
        if request.code is not None:
            village.code = request.code
        if request.land_area is not None:
            village.land_area = request.land_area
        if request.household_count is not None:
            village.household_count = request.household_count
        if request.contact_person is not None:
            village.contact_person = request.contact_person
        if request.contact_phone is not None:
            village.contact_phone = request.contact_phone
        if request.address is not None:
            village.address = request.address
        if request.description is not None:
            village.description = request.description
        if request.status is not None:
            village.status = request.status
        village.update_time = datetime.now()
        
        self.villages_db[village_id] = village
        return village
    
    def delete_village(self, village_id: str) -> bool:
        """删除村庄信息"""
        if village_id not in self.villages_db:
            return False
        
        # 检查是否有关联的农户
        has_related_farmers = any(
            farmer.village_id == village_id for farmer in self.farmers_db.values()
        )
        
        if has_related_farmers:
            # 如果有关联的农户，不允许删除
            return False
        
        del self.villages_db[village_id]
        return True
    
    # 农户信息管理
    def get_users(self, village_id: Optional[str] = None, status: Optional[int] = None) -> List[FarmerInfo]:
        """获取所有用户信息"""
        farmers = list(self.farmers_db.values())
        
        if village_id:
            farmers = [f for f in farmers if f.village_id == village_id]
        if status is not None:
            farmers = [f for f in farmers if f.status == status]
            
        return farmers
    
    def get_user_by_id(self, user_id: str) -> Optional[FarmerInfo]:
        """根据ID获取用户信息"""
        return self.farmers_db.get(user_id)
    
    def create_user(self, request: CreateFarmerRequest) -> Optional[FarmerInfo]:
        """创建用户信息"""
        # 检查村庄是否存在
        if request.village_id not in self.villages_db:
            return None
        
        user = FarmerInfo(
            id=str(uuid.uuid4()),
            farmer_name=request.farmer_name,
            id_card_number=request.id_card_number,
            phone_number=request.phone_number,
            address=request.address,
            village_id=request.village_id,
            household_size=request.household_size,
            cultivated_area=request.cultivated_area,
            main_crops=request.main_crops,
            status=request.status,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.farmers_db[user.id] = user
        return user
    
    def update_user(self, user_id: str, request: UpdateFarmerRequest) -> Optional[FarmerInfo]:
        """更新用户信息"""
        if user_id not in self.farmers_db:
            return None
        
        farmer = self.farmers_db[user_id]
        if request.village_id and request.village_id != farmer.village_id:
            # 检查新的村庄是否存在
            if request.village_id not in self.villages_db:
                return None
            farmer.village_id = request.village_id
        if request.farmer_name is not None:
            farmer.farmer_name = request.farmer_name
        if request.id_card_number is not None:
            farmer.id_card_number = request.id_card_number
        if request.phone_number is not None:
            farmer.phone_number = request.phone_number
        if request.address is not None:
            farmer.address = request.address
        if request.household_size is not None:
            farmer.household_size = request.household_size
        if request.cultivated_area is not None:
            farmer.cultivated_area = request.cultivated_area
        if request.main_crops is not None:
            farmer.main_crops = request.main_crops
        if request.status is not None:
            farmer.status = request.status
        farmer.update_time = datetime.now()
        
        self.farmers_db[farmer_id] = farmer
        return farmer
    
    def delete_user(self, user_id: str) -> bool:
        """删除用户信息"""
        if user_id not in self.farmers_db:
            return False
        
        del self.farmers_db[user_id]
        return True


# 创建服务实例供导入使用
basic_info_service = BasicInfoService()