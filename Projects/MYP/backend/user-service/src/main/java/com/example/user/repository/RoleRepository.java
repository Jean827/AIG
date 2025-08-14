package com.example.user.repository;

import com.example.user.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 角色数据访问接口
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * 根据名称查询角色
     * @param name 角色名称
     * @return 角色对象
     */
    Optional<Role> findByName(String name);

    /**
     * 检查角色名称是否存在
     * @param name 角色名称
     * @return 是否存在
     */
    boolean existsByName(String name);
}