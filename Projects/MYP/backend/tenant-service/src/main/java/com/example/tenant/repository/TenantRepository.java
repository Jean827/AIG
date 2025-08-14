package com.example.tenant.repository;

import com.example.tenant.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 租户数据访问接口
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    /**
     * 根据租户编码查询租户
     * @param tenantCode 租户编码
     * @return 租户信息
     */
    Optional<Tenant> findByTenantCode(String tenantCode);

    /**
     * 根据租户名称查询租户
     * @param tenantName 租户名称
     * @return 租户信息
     */
    Optional<Tenant> findByTenantName(String tenantName);

    /**
     * 检查租户编码是否存在
     * @param tenantCode 租户编码
     * @return 是否存在
     */
    boolean existsByTenantCode(String tenantCode);

    /**
     * 检查租户名称是否存在
     * @param tenantName 租户名称
     * @return 是否存在
     */
    boolean existsByTenantName(String tenantName);
}