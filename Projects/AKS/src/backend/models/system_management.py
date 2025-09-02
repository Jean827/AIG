# 系统管理模块模型定义
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr

# 菜单模型
class MenuItem(BaseModel):
    id: str = Field(..., description="菜单ID")
    name: str = Field(..., description="菜单名称")
    icon: Optional[str] = Field(None, description="菜单图标")
    type: str = Field(..., description="菜单类型", enum=["menu", "button", "catalog"])
    path: Optional[str] = Field(None, description="菜单路径")
    component: Optional[str] = Field(None, description="组件路径")
    parent_id: Optional[str] = Field(None, description="父菜单ID")
    order: int = Field(..., description="菜单排序")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 菜单创建请求
class CreateMenuItemRequest(BaseModel):
    name: str = Field(..., description="菜单名称")
    icon: Optional[str] = Field(None, description="菜单图标")
    type: str = Field(..., description="菜单类型", enum=["menu", "button", "catalog"])
    path: Optional[str] = Field(None, description="菜单路径")
    component: Optional[str] = Field(None, description="组件路径")
    parent_id: Optional[str] = Field(None, description="父菜单ID")
    order: int = Field(..., description="菜单排序")
    status: int = Field(..., description="状态", enum=[0, 1])

# 菜单更新请求
class UpdateMenuItemRequest(BaseModel):
    name: Optional[str] = Field(None, description="菜单名称")
    icon: Optional[str] = Field(None, description="菜单图标")
    type: Optional[str] = Field(None, description="菜单类型", enum=["menu", "button", "catalog"])
    path: Optional[str] = Field(None, description="菜单路径")
    component: Optional[str] = Field(None, description="组件路径")
    parent_id: Optional[str] = Field(None, description="父菜单ID")
    order: Optional[int] = Field(None, description="菜单排序")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 乡镇机构模型
class TownshipOrg(BaseModel):
    id: str = Field(..., description="乡镇机构ID")
    name: str = Field(..., description="乡镇名称")
    code: str = Field(..., description="乡镇编号")
    land_area: float = Field(..., description="土地面积")
    village_count: int = Field(..., description="村组数量")
    organization_id: str = Field(..., description="所属机构ID")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 乡镇机构创建请求
class CreateTownshipOrgRequest(BaseModel):
    name: str = Field(..., description="乡镇名称")
    code: str = Field(..., description="乡镇编号")
    land_area: float = Field(..., description="土地面积")
    village_count: int = Field(..., description="村组数量")
    organization_id: str = Field(..., description="所属机构ID")
    status: int = Field(..., description="状态", enum=[0, 1])

# 乡镇机构更新请求
class UpdateTownshipOrgRequest(BaseModel):
    name: Optional[str] = Field(None, description="乡镇名称")
    code: Optional[str] = Field(None, description="乡镇编号")
    land_area: Optional[float] = Field(None, description="土地面积")
    village_count: Optional[int] = Field(None, description="村组数量")
    organization_id: Optional[str] = Field(None, description="所属机构ID")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 用户模型
class User(BaseModel):
    id: str = Field(..., description="用户ID")
    username: str = Field(..., description="用户名")
    password_hash: str = Field(..., description="密码哈希")
    real_name: str = Field(..., description="真实姓名")
    email: Optional[EmailStr] = Field(None, description="电子邮箱")
    phone: Optional[str] = Field(None, description="手机号码")
    organization_id: str = Field(..., description="所属机构ID")
    role_id: str = Field(..., description="角色ID")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 用户创建请求
class CreateUserRequest(BaseModel):
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")
    real_name: str = Field(..., description="真实姓名")
    email: Optional[EmailStr] = Field(None, description="电子邮箱")
    phone: Optional[str] = Field(None, description="手机号码")
    organization_id: str = Field(..., description="所属机构ID")
    role_id: str = Field(..., description="角色ID")
    status: int = Field(..., description="状态", enum=[0, 1])

# 用户更新请求
class UpdateUserRequest(BaseModel):
    real_name: Optional[str] = Field(None, description="真实姓名")
    email: Optional[EmailStr] = Field(None, description="电子邮箱")
    phone: Optional[str] = Field(None, description="手机号码")
    organization_id: Optional[str] = Field(None, description="所属机构ID")
    role_id: Optional[str] = Field(None, description="角色ID")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 登录请求
class LoginRequest(BaseModel):
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")

# 角色模型
class Role(BaseModel):
    id: str = Field(..., description="角色ID")
    name: str = Field(..., description="角色名称")
    description: Optional[str] = Field(None, description="角色描述")
    menu_ids: List[str] = Field(..., description="菜单权限列表")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 角色创建请求
class CreateRoleRequest(BaseModel):
    name: str = Field(..., description="角色名称")
    description: Optional[str] = Field(None, description="角色描述")
    menu_ids: List[str] = Field(..., description="菜单权限列表")
    status: int = Field(..., description="状态", enum=[0, 1])

# 角色更新请求
class UpdateRoleRequest(BaseModel):
    name: Optional[str] = Field(None, description="角色名称")
    description: Optional[str] = Field(None, description="角色描述")
    menu_ids: Optional[List[str]] = Field(None, description="菜单权限列表")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 组织机构模型
class Organization(BaseModel):
    id: str = Field(..., description="组织机构ID")
    name: str = Field(..., description="组织机构名称")
    code: str = Field(..., description="组织机构代码")
    parent_id: Optional[str] = Field(None, description="父组织机构ID")
    type: str = Field(..., description="组织机构类型")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 组织机构创建请求
class CreateOrganizationRequest(BaseModel):
    name: str = Field(..., description="组织机构名称")
    code: str = Field(..., description="组织机构代码")
    parent_id: Optional[str] = Field(None, description="父组织机构ID")
    type: str = Field(..., description="组织机构类型")
    status: int = Field(..., description="状态", enum=[0, 1])

# 组织机构更新请求
class UpdateOrganizationRequest(BaseModel):
    name: Optional[str] = Field(None, description="组织机构名称")
    code: Optional[str] = Field(None, description="组织机构代码")
    parent_id: Optional[str] = Field(None, description="父组织机构ID")
    type: Optional[str] = Field(None, description="组织机构类型")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])

# 数据字典模型
class DataDictionary(BaseModel):
    id: str = Field(..., description="数据字典ID")
    type: str = Field(..., description="字典类型")
    code: str = Field(..., description="字典编码")
    name: str = Field(..., description="字典名称")
    value: str = Field(..., description="字典值")
    order: int = Field(..., description="排序")
    status: int = Field(..., description="状态", enum=[0, 1])  # 0: 禁用, 1: 启用
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 数据字典创建请求
class CreateDataDictionaryRequest(BaseModel):
    type: str = Field(..., description="字典类型")
    code: str = Field(..., description="字典编码")
    name: str = Field(..., description="字典名称")
    value: str = Field(..., description="字典值")
    order: int = Field(..., description="排序")
    status: int = Field(..., description="状态", enum=[0, 1])

# 数据字典更新请求
class UpdateDataDictionaryRequest(BaseModel):
    type: Optional[str] = Field(None, description="字典类型")
    code: Optional[str] = Field(None, description="字典编码")
    name: Optional[str] = Field(None, description="字典名称")
    value: Optional[str] = Field(None, description="字典值")
    order: Optional[int] = Field(None, description="排序")
    status: Optional[int] = Field(None, description="状态", enum=[0, 1])