package com.example.auth.service.impl;

import com.example.auth.entity.Permission;
import com.example.auth.repository.PermissionRepository;
import com.example.auth.service.PermissionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionServiceImpl(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    @Transactional
    public Permission createPermission(Permission permission) {
        if (existsByName(permission.getName())) {
            throw new RuntimeException("Permission name already exists");
        }
        return permissionRepository.save(permission);
    }

    @Override
    @Transactional
    public Permission updatePermission(Long id, Permission permission) {
        Permission existingPermission = getPermissionById(id);

        if (!existingPermission.getName().equals(permission.getName()) && existsByName(permission.getName())) {
            throw new RuntimeException("Permission name already exists");
        }

        existingPermission.setName(permission.getName());
        existingPermission.setDescription(permission.getDescription());
        existingPermission.setRole(permission.getRole());

        return permissionRepository.save(existingPermission);
    }

    @Override
    @Transactional
    public void deletePermission(Long id) {
        Permission permission = getPermissionById(id);
        permissionRepository.delete(permission);
    }

    @Override
    public Permission getPermissionById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found with id: " + id));
    }

    @Override
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @Override
    public List<Permission> getPermissionsByRoleId(Long roleId) {
        return permissionRepository.findByRoleId(roleId);
    }

    @Override
    public boolean existsByName(String name) {
        return permissionRepository.existsByName(name);
    }
}