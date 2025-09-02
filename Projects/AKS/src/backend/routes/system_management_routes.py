# 系统管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.system_management import (
    MenuItem, 
    TownshipOrg, 
    User, 
    Role, 
    Organization, 
    DataDictionary,
    CreateMenuItemRequest, 
    UpdateMenuItemRequest,
    CreateTownshipOrgRequest, 
    UpdateTownshipOrgRequest,
    CreateUserRequest, 
    UpdateUserRequest, 
    LoginRequest,
    CreateRoleRequest, 
    UpdateRoleRequest,
    CreateOrganizationRequest, 
    UpdateOrganizationRequest,
    CreateDataDictionaryRequest, 
    UpdateDataDictionaryRequest
)
from services.system_management_service import system_management_service

# 创建路由实例
router = APIRouter(
    prefix="/api/system",
    tags=["System Management"],
    responses={404: {"description": "Not found"}}
)


# 菜单管理路由
@router.get("/menus", response_model=List[MenuItem])
def get_menus(
    menu_name: Optional[str] = None,
    parent_id: Optional[str] = None,
    status: Optional[str] = None
):
    """获取菜单列表"""
    return system_management_service.get_menus(menu_name, parent_id, status)


@router.get("/menus/{menu_id}", response_model=MenuItem)
def get_menu_by_id(menu_id: str):
    """根据ID获取菜单"""
    menu = system_management_service.get_menu_by_id(menu_id)
    if not menu:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu with id {menu_id} not found"
        )
    return menu


@router.post("/menus", response_model=MenuItem, status_code=status.HTTP_201_CREATED)
def create_menu(request: CreateMenuItemRequest):
    """创建菜单"""
    return system_management_service.create_menu(request)


@router.put("/menus/{menu_id}", response_model=MenuItem)
def update_menu(menu_id: str, request: UpdateMenuItemRequest):
    """更新菜单"""
    menu = system_management_service.update_menu(menu_id, request)
    if not menu:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu with id {menu_id} not found"
        )
    return menu


@router.delete("/menus/{menu_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu(menu_id: str):
    """删除菜单"""
    success = system_management_service.delete_menu(menu_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu with id {menu_id} not found or has submenus"
        )


# 乡镇组织管理路由
@router.get("/township-orgs", response_model=List[TownshipOrg])
def get_township_orgs(
    org_name: Optional[str] = None,
    status: Optional[str] = None,
    parent_id: Optional[str] = None
):
    """获取乡镇组织列表"""
    return system_management_service.get_township_orgs(org_name, status, parent_id)


@router.get("/township-orgs/{org_id}", response_model=TownshipOrg)
def get_township_org_by_id(org_id: str):
    """根据ID获取乡镇组织"""
    org = system_management_service.get_township_org_by_id(org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township organization with id {org_id} not found"
        )
    return org


@router.post("/township-orgs", response_model=TownshipOrg, status_code=status.HTTP_201_CREATED)
def create_township_org(request: CreateTownshipOrgRequest):
    """创建乡镇组织"""
    return system_management_service.create_township_org(request)


@router.put("/township-orgs/{org_id}", response_model=TownshipOrg)
def update_township_org(org_id: str, request: UpdateTownshipOrgRequest):
    """更新乡镇组织"""
    org = system_management_service.update_township_org(org_id, request)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township organization with id {org_id} not found"
        )
    return org


@router.delete("/township-orgs/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_township_org(org_id: str):
    """删除乡镇组织"""
    success = system_management_service.delete_township_org(org_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Township organization with id {org_id} not found or has sub-organizations"
        )


# 用户管理路由
@router.get("/users", response_model=List[User])
def get_users(
    username: Optional[str] = None,
    real_name: Optional[str] = None,
    org_id: Optional[str] = None,
    role_id: Optional[str] = None,
    status: Optional[str] = None
):
    """获取用户列表"""
    return system_management_service.get_users(username, real_name, org_id, role_id, status)


@router.get("/users/{user_id}", response_model=User)
def get_user_by_id(user_id: str):
    """根据ID获取用户"""
    user = system_management_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


@router.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(request: CreateUserRequest):
    """创建用户"""
    return system_management_service.create_user(request)


@router.put("/users/{user_id}", response_model=User)
def update_user(user_id: str, request: UpdateUserRequest):
    """更新用户"""
    user = system_management_service.update_user(user_id, request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str):
    """删除用户"""
    success = system_management_service.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )


@router.post("/login")
def login(request: LoginRequest):
    """用户登录"""
    user = system_management_service.authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # 生成并返回token（简化实现）
    token = system_management_service.generate_token(user.id)
    return {
        "user_id": user.id,
        "username": user.username,
        "real_name": user.real_name,
        "role_id": user.role_id,
        "org_id": user.org_id,
        "token": token
    }


@router.post("/logout")
def logout():
    """用户登出"""
    # 实际实现中需要清理token
    return {"message": "Logout successful"}


# 角色管理路由
@router.get("/roles", response_model=List[Role])
def get_roles(
    role_name: Optional[str] = None,
    status: Optional[str] = None
):
    """获取角色列表"""
    return system_management_service.get_roles(role_name, status)


@router.get("/roles/{role_id}", response_model=Role)
def get_role_by_id(role_id: str):
    """根据ID获取角色"""
    role = system_management_service.get_role_by_id(role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with id {role_id} not found"
        )
    return role


@router.post("/roles", response_model=Role, status_code=status.HTTP_201_CREATED)
def create_role(request: CreateRoleRequest):
    """创建角色"""
    return system_management_service.create_role(request)


@router.put("/roles/{role_id}", response_model=Role)
def update_role(role_id: str, request: UpdateRoleRequest):
    """更新角色"""
    role = system_management_service.update_role(role_id, request)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with id {role_id} not found"
        )
    return role


@router.delete("/roles/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(role_id: str):
    """删除角色"""
    success = system_management_service.delete_role(role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with id {role_id} not found or has associated users"
        )


# 组织管理路由
@router.get("/organizations", response_model=List[Organization])
def get_organizations(
    org_name: Optional[str] = None,
    org_type: Optional[str] = None,
    status: Optional[str] = None
):
    """获取组织列表"""
    return system_management_service.get_organizations(org_name, org_type, status)


@router.get("/organizations/{org_id}", response_model=Organization)
def get_organization_by_id(org_id: str):
    """根据ID获取组织"""
    org = system_management_service.get_organization_by_id(org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization with id {org_id} not found"
        )
    return org


@router.post("/organizations", response_model=Organization, status_code=status.HTTP_201_CREATED)
def create_organization(request: CreateOrganizationRequest):
    """创建组织"""
    return system_management_service.create_organization(request)


@router.put("/organizations/{org_id}", response_model=Organization)
def update_organization(org_id: str, request: UpdateOrganizationRequest):
    """更新组织"""
    org = system_management_service.update_organization(org_id, request)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization with id {org_id} not found"
        )
    return org


@router.delete("/organizations/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(org_id: str):
    """删除组织"""
    success = system_management_service.delete_organization(org_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization with id {org_id} not found or has associated users"
        )


# 数据字典管理路由
@router.get("/data-dictionaries", response_model=List[DataDictionary])
def get_data_dictionaries(
    dict_type: Optional[str] = None,
    dict_code: Optional[str] = None,
    status: Optional[str] = None
):
    """获取数据字典列表"""
    return system_management_service.get_data_dictionaries(dict_type, dict_code, status)


@router.get("/data-dictionaries/{dict_id}", response_model=DataDictionary)
def get_data_dictionary_by_id(dict_id: str):
    """根据ID获取数据字典"""
    data_dict = system_management_service.get_data_dictionary_by_id(dict_id)
    if not data_dict:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data dictionary with id {dict_id} not found"
        )
    return data_dict


@router.post("/data-dictionaries", response_model=DataDictionary, status_code=status.HTTP_201_CREATED)
def create_data_dictionary(request: CreateDataDictionaryRequest):
    """创建数据字典"""
    return system_management_service.create_data_dictionary(request)


@router.put("/data-dictionaries/{dict_id}", response_model=DataDictionary)
def update_data_dictionary(dict_id: str, request: UpdateDataDictionaryRequest):
    """更新数据字典"""
    data_dict = system_management_service.update_data_dictionary(dict_id, request)
    if not data_dict:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data dictionary with id {dict_id} not found"
        )
    return data_dict


@router.delete("/data-dictionaries/{dict_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_data_dictionary(dict_id: str):
    """删除数据字典"""
    success = system_management_service.delete_data_dictionary(dict_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data dictionary with id {dict_id} not found"
        )


# 系统统计路由
@router.get("/statistics")
def get_system_statistics():
    """获取系统统计信息"""
    return system_management_service.get_system_statistics()


# 导出数据路由
@router.get("/export/users")
def export_users():
    """导出用户数据"""
    file_path = system_management_service.export_users()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/roles")
def export_roles():
    """导出角色数据"""
    file_path = system_management_service.export_roles()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/organizations")
def export_organizations():
    """导出组织数据"""
    file_path = system_management_service.export_organizations()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }