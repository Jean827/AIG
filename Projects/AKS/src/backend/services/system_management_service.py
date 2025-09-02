# 系统管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# 导入模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.system_management import (
    MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest,
    TownshipOrg, CreateTownshipOrgRequest, UpdateTownshipOrgRequest,
    User, CreateUserRequest, UpdateUserRequest,
    Role, CreateRoleRequest, UpdateRoleRequest,
    Organization, CreateOrganizationRequest, UpdateOrganizationRequest,
    DataDictionary, CreateDataDictionaryRequest, UpdateDataDictionaryRequest
)

# 导入数据库连接工具
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from utils.db_utils import db_connection

# 模拟数据库连接
class Database:
    def __init__(self):
        # 模拟数据表
        self.menus = []
        self.townships = []
        self.users = []
        self.roles = []
        self.organizations = []
        self.data_dicts = []
        
        # 初始化一些示例数据
        self._init_sample_data()

    def get_connection(self):
        # 实际项目中返回真实的数据库连接
        return self
    
    def _init_sample_data(self):
        """初始化示例数据"""
        # 添加示例菜单
        self.menus = [
            MenuItem(
                id="1",
                name="系统管理",
                icon="setting",
                type="catalog",
                path="/system",
                component="Layout",
                parent_id=None,
                order=1,
                status=1,
                create_time=datetime.now(),
                update_time=datetime.now()
            ),
            MenuItem(
                id="2",
                name="用户管理",
                icon="user",
                type="menu",
                path="/system/users",
                component="system/user/index",
                parent_id="1",
                order=1,
                status=1,
                create_time=datetime.now(),
                update_time=datetime.now()
            ),
            MenuItem(
                id="3",
                name="角色管理",
                icon="team",
                type="menu",
                path="/system/roles",
                component="system/role/index",
                parent_id="1",
                order=2,
                status=1,
                create_time=datetime.now(),
                update_time=datetime.now()
            )
        ]



class MenuService:
    @staticmethod
    def get_menu_list(parent_id: Optional[str] = None) -> List[MenuItem]:
        """获取菜单列表"""
        # 尝试使用实际数据库
        with db_connection.get_cursor() as cursor:
            if cursor:
                try:
                    query = "SELECT * FROM system_menus"
                    params = []
                    
                    if parent_id:
                        query += " WHERE parent_id = %s"
                        params.append(parent_id)
                    
                    cursor.execute(query, params)
                    results = cursor.fetchall()
                    return [MenuItem(**result) for result in results]
                except Exception as e:
                    print(f"数据库查询菜单失败: {e}")
        
        # 如果数据库不可用，使用模拟数据
        if parent_id is None:
            return db.menus
        return [menu for menu in db.menus if menu.parent_id == parent_id]

    @staticmethod
    def get_menu_by_id(menu_id: str) -> Optional[MenuItem]:
        """根据ID获取菜单"""
        # 尝试使用实际数据库
        with db_connection.get_cursor() as cursor:
            if cursor:
                try:
                    cursor.execute("SELECT * FROM system_menus WHERE id = %s", (menu_id,))
                    result = cursor.fetchone()
                    if result:
                        return MenuItem(**result)
                except Exception as e:
                    print(f"数据库查询菜单失败: {e}")
        
        # 如果数据库不可用，使用模拟数据
        for menu in db.menus:
            if menu.id == menu_id:
                return menu
        return None








    @staticmethod
    def create_menu(menu_data: CreateMenuItemRequest) -> MenuItem:
        """创建菜单"""
        now = datetime.now()
        new_menu = MenuItem(
            id=str(uuid.uuid4()),
            name=menu_data.name,
            icon=menu_data.icon,
            type=menu_data.type,
            path=menu_data.path,
            component=menu_data.component,
            parent_id=menu_data.parent_id,
            order=menu_data.order,
            status=menu_data.status,
            create_time=now,
            update_time=now
        )
        db.menus.append(new_menu)
        return new_menu

    @staticmethod
    def update_menu(menu_id: str, menu_data: UpdateMenuItemRequest) -> Optional[MenuItem]:
        """更新菜单"""
        for i, menu in enumerate(db.menus):
            if menu.id == menu_id:
                update_data = menu_data.dict(exclude_unset=True)
                updated_menu = menu.copy(update=update_data)
                updated_menu.update_time = datetime.now()
                db.menus[i] = updated_menu
                return updated_menu
        return None

    @staticmethod
    def delete_menu(menu_id: str) -> bool:
        """删除菜单"""
        for i, menu in enumerate(db.menus):
            if menu.id == menu_id:
                db.menus.pop(i)
                return True
        return False

class TownshipService:
    @staticmethod
    def get_township_list(page: int = 1, page_size: int = 10, status: Optional[int] = None) -> Dict:
        """获取乡镇机构列表"""
        filtered = db.townships
        if status is not None:
            filtered = [t for t in filtered if t.status == status]
        
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        items = filtered[start_index:end_index]
        
        return {
            "items": items,
            "total": len(filtered),
            "page": page,
            "page_size": page_size
        }

    @staticmethod
    def get_township_by_id(township_id: str) -> Optional[TownshipOrg]:
        """根据ID获取乡镇机构"""
        for township in db.townships:
            if township.id == township_id:
                return township
        return None

    @staticmethod
    def create_township(township_data: CreateTownshipOrgRequest) -> TownshipOrg:
        """创建乡镇机构"""
        now = datetime.now()
        new_township = TownshipOrg(
            id=str(uuid.uuid4()),
            name=township_data.name,
            code=township_data.code,
            land_area=township_data.land_area,
            village_count=township_data.village_count,
            organization_id=township_data.organization_id,
            status=township_data.status,
            create_time=now,
            update_time=now
        )
        db.townships.append(new_township)
        return new_township

    @staticmethod
    def update_township(township_id: str, township_data: UpdateTownshipOrgRequest) -> Optional[TownshipOrg]:
        """更新乡镇机构"""
        for i, township in enumerate(db.townships):
            if township.id == township_id:
                update_data = township_data.dict(exclude_unset=True)
                updated_township = township.copy(update=update_data)
                updated_township.update_time = datetime.now()
                db.townships[i] = updated_township
                return updated_township
        return None

class UserService:
    @staticmethod
    def get_user_list(page: int = 1, page_size: int = 10, **filters) -> Dict:
        """获取用户列表"""
        filtered = db.users
        for key, value in filters.items():
            if hasattr(User, key):
                filtered = [u for u in filtered if getattr(u, key) == value]
        
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        items = filtered[start_index:end_index]
        
        return {
            "items": items,
            "total": len(filtered),
            "page": page,
            "page_size": page_size
        }

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[User]:
        """根据ID获取用户"""
        for user in db.users:
            if user.id == user_id:
                return user
        return None

    @staticmethod
    def get_user_by_username(username: str) -> Optional[User]:
        """根据用户名获取用户"""
        for user in db.users:
            if user.username == username:
                return user
        return None

    @staticmethod
    def create_user(user_data: CreateUserRequest) -> User:
        """创建用户"""
        # 在实际项目中，应该对密码进行加密
        now = datetime.now()
        new_user = User(
            id=str(uuid.uuid4()),
            username=user_data.username,
            password_hash=user_data.password,  # 实际项目中需要加密
            real_name=user_data.real_name,
            email=user_data.email,
            phone=user_data.phone,
            organization_id=user_data.organization_id,
            role_id=user_data.role_id,
            status=user_data.status,
            create_time=now,
            update_time=now
        )
        db.users.append(new_user)
        return new_user

    @staticmethod
    def update_user(user_id: str, user_data: UpdateUserRequest) -> Optional[User]:
        """更新用户"""
        for i, user in enumerate(db.users):
            if user.id == user_id:
                update_data = user_data.dict(exclude_unset=True)
                updated_user = user.copy(update=update_data)
                updated_user.update_time = datetime.now()
                db.users[i] = updated_user
                return updated_user
        return None

    @staticmethod
    def change_password(user_id: str, new_password: str) -> bool:
        """修改密码"""
        for i, user in enumerate(db.users):
            if user.id == user_id:
                # 实际项目中应该对密码进行加密
                user.password_hash = new_password
                user.update_time = datetime.now()
                return True
        return False

class RoleService:
    @staticmethod
    def get_role_list(page: int = 1, page_size: int = 10, status: Optional[int] = None) -> Dict:
        """获取角色列表"""
        filtered = db.roles
        if status is not None:
            filtered = [r for r in filtered if r.status == status]
        
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        items = filtered[start_index:end_index]
        
        return {
            "items": items,
            "total": len(filtered),
            "page": page,
            "page_size": page_size
        }

    @staticmethod
    def get_role_by_id(role_id: str) -> Optional[Role]:
        """根据ID获取角色"""
        for role in db.roles:
            if role.id == role_id:
                return role
        return None

    @staticmethod
    def create_role(role_data: CreateRoleRequest) -> Role:
        """创建角色"""
        now = datetime.now()
        new_role = Role(
            id=str(uuid.uuid4()),
            name=role_data.name,
            description=role_data.description,
            menu_ids=role_data.menu_ids,
            status=role_data.status,
            create_time=now,
            update_time=now
        )
        db.roles.append(new_role)
        return new_role

    @staticmethod
    def update_role(role_id: str, role_data: UpdateRoleRequest) -> Optional[Role]:
        """更新角色"""
        for i, role in enumerate(db.roles):
            if role.id == role_id:
                update_data = role_data.dict(exclude_unset=True)
                updated_role = role.copy(update=update_data)
                updated_role.update_time = datetime.now()
                db.roles[i] = updated_role
                return updated_role
        return None

    @staticmethod
    def update_role_permissions(role_id: str, menu_ids: List[str]) -> Optional[Role]:
        """更新角色权限"""
        for i, role in enumerate(db.roles):
            if role.id == role_id:
                role.menu_ids = menu_ids
                role.update_time = datetime.now()
                return role
        return None

class OrganizationService:
    @staticmethod
    def get_organization_list(parent_id: Optional[str] = None, status: Optional[int] = None) -> List[Organization]:
        """获取组织机构列表"""
        filtered = db.organizations
        if parent_id is not None:
            filtered = [org for org in filtered if org.parent_id == parent_id]
        if status is not None:
            filtered = [org for org in filtered if org.status == status]
        return filtered

    @staticmethod
    def get_organization_by_id(organization_id: str) -> Optional[Organization]:
        """根据ID获取组织机构"""
        for organization in db.organizations:
            if organization.id == organization_id:
                return organization
        return None

    @staticmethod
    def create_organization(organization_data: CreateOrganizationRequest) -> Organization:
        """创建组织机构"""
        now = datetime.now()
        new_organization = Organization(
            id=str(uuid.uuid4()),
            name=organization_data.name,
            code=organization_data.code,
            parent_id=organization_data.parent_id,
            type=organization_data.type,
            status=organization_data.status,
            create_time=now,
            update_time=now
        )
        db.organizations.append(new_organization)
        return new_organization

    @staticmethod
    def update_organization(organization_id: str, organization_data: UpdateOrganizationRequest) -> Optional[Organization]:

        """更新组织机构"""
        for i, organization in enumerate(db.organizations):
            if organization.id == organization_id:
                update_data = organization_data.dict(exclude_unset=True)
                updated_organization = organization.copy(update=update_data)
                updated_organization.update_time = datetime.now()
                db.organizations[i] = updated_organization
                return updated_organization
        return None

class DataDictService:
    @staticmethod
    def get_data_dict_by_type(dict_type: str, status: Optional[int] = 1) -> List[DataDictionary]:
        """根据类型获取数据字典列表"""
        filtered = [dd for dd in db.data_dicts if dd.type == dict_type]
        if status is not None:
            filtered = [dd for dd in filtered if dd.status == status]
        # 按排序字段排序
        return sorted(filtered, key=lambda x: x.order)

    @staticmethod
    def get_data_dict_by_code(dict_type: str, dict_code: str) -> Optional[DataDictionary]:
        """根据类型和编码获取数据字典"""
        for dd in db.data_dicts:
            if dd.type == dict_type and dd.code == dict_code:
                return dd
        return None

    @staticmethod
    def create_data_dict(data_dict_data: CreateDataDictionaryRequest) -> DataDictionary:
        """创建数据字典"""
        now = datetime.now()
        new_data_dict = DataDictionary(
            id=str(uuid.uuid4()),
            type=data_dict_data.type,
            code=data_dict_data.code,
            name=data_dict_data.name,
            value=data_dict_data.value,
            order=data_dict_data.order,
            status=data_dict_data.status,
            create_time=now,
            update_time=now
        )
        db.data_dicts.append(new_data_dict)
        return new_data_dict

    @staticmethod
    def update_data_dict(data_dict_id: str, data_dict_data: UpdateDataDictionaryRequest) -> Optional[DataDictionary]:
        """更新数据字典"""
        for i, data_dict in enumerate(db.data_dicts):
            if data_dict.id == data_dict_id:
                update_data = data_dict_data.dict(exclude_unset=True)
                updated_data_dict = data_dict.copy(update=update_data)
                updated_data_dict.update_time = datetime.now()
                db.data_dicts[i] = updated_data_dict
                return updated_data_dict
        return None

# 创建数据库实例
db = Database()

# 创建服务实例
class SystemManagementService:
    def __init__(self):
        self.menu_service = MenuService()
        self.township_service = TownshipService()
        self.user_service = UserService()
        self.role_service = RoleService()
        self.organization_service = OrganizationService()
        self.data_dict_service = DataDictService()

# 为了兼容现有的代码结构，添加直接的方法引用
def get_menus(*args, **kwargs):
    return MenuService.get_menu_list(*args, **kwargs)

def get_menu_by_id(*args, **kwargs):
    return MenuService.get_menu_by_id(*args, **kwargs)

def create_menu(*args, **kwargs):
    return MenuService.create_menu(*args, **kwargs)

def update_menu(*args, **kwargs):
    return MenuService.update_menu(*args, **kwargs)

def delete_menu(*args, **kwargs):
    return MenuService.delete_menu(*args, **kwargs)

system_management_service = SystemManagementService()
system_management_service.get_menus = get_menus
system_management_service.get_menu_by_id = get_menu_by_id
system_management_service.create_menu = create_menu
system_management_service.update_menu = update_menu
system_management_service.delete_menu = delete_menu