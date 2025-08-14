package com.example.auth.service;

import com.example.auth.entity.Permission;
import java.util.List;

public interface PermissionService {
    Permission createPermission(Permission permission);
    Permission updatePermission(Long id, Permission permission);
    void deletePermission(Long id);
    Permission getPermissionById(Long id);
    List<Permission> getAllPermissions();
    List<Permission> getPermissionsByRoleId(Long roleId);
    boolean existsByName(String name);
}