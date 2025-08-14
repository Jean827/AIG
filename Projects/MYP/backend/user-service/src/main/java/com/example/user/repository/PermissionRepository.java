package com.example.user.repository;

import com.example.user.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 权限数据访问接口
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    /**
     * 根据名称查询权限
     * @param name 权限名称
     * @return 权限对象
     */
    Optional<Permission> findByName(String name);

    /**
     * 检查权限名称是否存在
     * @param name 权限名称
     * @return 是否存在
     */
    boolean existsByName(String name);
}