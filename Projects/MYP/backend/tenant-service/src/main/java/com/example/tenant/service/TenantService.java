package com.example.tenant.service;

import com.example.tenant.model.Tenant;

import java.util.List;
import java.util.Optional;

/**
 * 租户服务接口
 */
public interface TenantService {
    /**
     * 创建租户
     * @param tenant 租户信息
     * @return 创建后的租户
     */
    Tenant createTenant(Tenant tenant);

    /**
     * 更新租户信息
     * @param id 租户ID
     * @param tenant 新的租户信息
     * @return 更新后的租户
     */
    Tenant updateTenant(Long id, Tenant tenant);

    /**
     * 删除租户
     * @param id 租户ID
     */
    void deleteTenant(Long id);

    /**
     * 根据ID查询租户
     * @param id 租户ID
     * @return 租户信息
     */
    Optional<Tenant> getTenantById(Long id);

    /**
     * 根据租户编码查询租户
     * @param tenantCode 租户编码
     * @return 租户信息
     */
    Optional<Tenant> getTenantByCode(String tenantCode);

    /**
     * 查询所有租户
     * @return 租户列表
     */
    List<Tenant> getAllTenants();

    /**
     * 启用/禁用租户
     * @param id 租户ID
     * @param status 状态(0:禁用, 1:启用)
     * @return 更新后的租户
     */
    Tenant changeTenantStatus(Long id, Integer status);
}