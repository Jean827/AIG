package com.example.tenant.service.impl;

import com.example.tenant.model.Tenant;
import com.example.tenant.repository.TenantRepository;
import com.example.tenant.service.TenantService;
import com.example.tenant.service.TenantSchemaManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * 租户服务实现类
 */
@Service
public class TenantServiceImpl implements TenantService {
    private final TenantRepository tenantRepository;
    private final TenantSchemaManager tenantSchemaManager;

    @Autowired
    public TenantServiceImpl(TenantRepository tenantRepository, TenantSchemaManager tenantSchemaManager) {
        this.tenantRepository = tenantRepository;
        this.tenantSchemaManager = tenantSchemaManager;
    }

    @Override
    public Tenant createTenant(Tenant tenant) {
        // 验证租户编码和名称是否已存在
        Assert.isTrue(!tenantRepository.existsByTenantCode(tenant.getTenantCode()), "租户编码已存在");
        Assert.isTrue(!tenantRepository.existsByTenantName(tenant.getTenantName()), "租户名称已存在");

        // 设置创建和更新时间
        tenant.setCreatedAt(new Date());
        tenant.setUpdatedAt(new Date());

        // 确定要使用的Schema名称
        String schemaName = tenant.getCustomSchemaName() != null && !tenant.getCustomSchemaName().isEmpty()
                ? tenant.getCustomSchemaName() : tenant.getTenantCode();

        // 创建租户对应的数据库Schema
        tenantSchemaManager.createTenantSchema(schemaName);

        return tenantRepository.save(tenant);
    }

    @Override
    public Tenant updateTenant(Long id, Tenant tenant) {
        // 验证租户是否存在
        Tenant existingTenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("租户不存在，ID: " + id));

        // 如果修改了租户编码，验证新编码是否已存在
        if (!existingTenant.getTenantCode().equals(tenant.getTenantCode())) {
            Assert.isTrue(!tenantRepository.existsByTenantCode(tenant.getTenantCode()), "租户编码已存在");
        }

        // 如果修改了租户名称，验证新名称是否已存在
        if (!existingTenant.getTenantName().equals(tenant.getTenantName())) {
            Assert.isTrue(!tenantRepository.existsByTenantName(tenant.getTenantName()), "租户名称已存在");
        }

        // 更新租户信息
        existingTenant.setTenantName(tenant.getTenantName());
        existingTenant.setTenantCode(tenant.getTenantCode());
        existingTenant.setDescription(tenant.getDescription());
        existingTenant.setStatus(tenant.getStatus());
        existingTenant.setUpdatedAt(new Date());

        return tenantRepository.save(existingTenant);
    }

    @Override
    public void deleteTenant(Long id) {
        // 验证租户是否存在
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("租户不存在，ID: " + id));

        // 删除租户对应的数据库Schema
        tenantSchemaManager.dropTenantSchema(tenant.getTenantCode());

        // 删除租户记录
        tenantRepository.deleteById(id);
    }

    @Override
    public Optional<Tenant> getTenantById(Long id) {
        return tenantRepository.findById(id);
    }

    @Override
    public Optional<Tenant> getTenantByCode(String tenantCode) {
        return tenantRepository.findByTenantCode(tenantCode);
    }

    @Override
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    @Override
    public Tenant changeTenantStatus(Long id, Integer status) {
        // 验证租户是否存在
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("租户不存在，ID: " + id));

        // 验证状态值是否有效
        Assert.isTrue(status == 0 || status == 1, "状态值无效，必须是0或1");

        // 更新状态
        tenant.setStatus(status);
        tenant.setUpdatedAt(new Date());

        return tenantRepository.save(tenant);
    }
}