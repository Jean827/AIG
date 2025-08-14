package com.example.tenant.controller;

import com.example.tenant.model.Tenant;
import com.example.tenant.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 租户管理控制器
 */
@RestController
@RequestMapping("/api/tenants")
public class TenantController {
    private final TenantService tenantService;

    @Autowired
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    /**
     * 创建租户
     * @param tenant 租户信息
     * @return 创建后的租户
     */
    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody Tenant tenant) {
        try {
            Tenant createdTenant = tenantService.createTenant(tenant);
            return new ResponseEntity<>(createdTenant, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 更新租户信息
     * @param id 租户ID
     * @param tenant 新的租户信息
     * @return 更新后的租户
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable("id") Long id, @RequestBody Tenant tenant) {
        try {
            Tenant updatedTenant = tenantService.updateTenant(id, tenant);
            return new ResponseEntity<>(updatedTenant, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 删除租户
     * @param id 租户ID
     * @return 响应状态
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTenant(@PathVariable("id") Long id) {
        try {
            tenantService.deleteTenant(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 根据ID查询租户
     * @param id 租户ID
     * @return 租户信息
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tenant> getTenantById(@PathVariable("id") Long id) {
        Optional<Tenant> tenantData = tenantService.getTenantById(id);

        return tenantData.map(tenant -> new ResponseEntity<>(tenant, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * 根据租户编码查询租户
     * @param code 租户编码
     * @return 租户信息
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Tenant> getTenantByCode(@PathVariable("code") String code) {
        Optional<Tenant> tenantData = tenantService.getTenantByCode(code);

        return tenantData.map(tenant -> new ResponseEntity<>(tenant, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * 查询所有租户
     * @return 租户列表
     */
    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        try {
            List<Tenant> tenants = tenantService.getAllTenants();
            if (tenants.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(tenants, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 启用/禁用租户
     * @param id 租户ID
     * @param status 状态(0:禁用, 1:启用)
     * @return 更新后的租户
     */
    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<Tenant> changeTenantStatus(@PathVariable("id") Long id, @PathVariable("status") Integer status) {
        try {
            Tenant updatedTenant = tenantService.changeTenantStatus(id, status);
            return new ResponseEntity<>(updatedTenant, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}