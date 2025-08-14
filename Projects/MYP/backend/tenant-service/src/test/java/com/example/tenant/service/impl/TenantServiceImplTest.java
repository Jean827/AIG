package com.example.tenant.service.impl;

import com.example.tenant.model.Tenant;
import com.example.tenant.repository.TenantRepository;
import com.example.tenant.service.TenantSchemaManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TenantServiceImplTest {

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private TenantSchemaManager tenantSchemaManager;

    @InjectMocks
    private TenantServiceImpl tenantService;

    private Tenant testTenant;

    @BeforeEach
    void setUp() {
        testTenant = new Tenant();
        testTenant.setId(1L);
        testTenant.setTenantCode("TEST_TENANT");
        testTenant.setTenantName("测试租户");
        testTenant.setDescription("这是一个测试租户");
        testTenant.setStatus(1);
        testTenant.setCreatedAt(new Date());
        testTenant.setUpdatedAt(new Date());
    }

    @Test
    void testCreateTenant_Success() {
        // 准备数据
        when(tenantRepository.existsByTenantCode(anyString())).thenReturn(false);
        when(tenantRepository.existsByTenantName(anyString())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(testTenant);

        // 执行测试
        Tenant createdTenant = tenantService.createTenant(testTenant);

        // 验证结果
        assertNotNull(createdTenant);
        assertEquals(testTenant.getTenantCode(), createdTenant.getTenantCode());
        assertEquals(testTenant.getTenantName(), createdTenant.getTenantName());
        verify(tenantSchemaManager).createTenantSchema(testTenant.getTenantCode());
        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    void testCreateTenant_TenantCodeExists() {
        // 准备数据
        when(tenantRepository.existsByTenantCode(anyString())).thenReturn(true);

        // 执行测试并验证异常
        AssertionFailedError exception = assertThrows(AssertionFailedError.class, () -> {
            tenantService.createTenant(testTenant);
        });

        // 验证结果
        assertEquals("租户编码已存在", exception.getMessage());
        verify(tenantSchemaManager, never()).createTenantSchema(anyString());
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testCreateTenant_TenantNameExists() {
        // 准备数据
        when(tenantRepository.existsByTenantCode(anyString())).thenReturn(false);
        when(tenantRepository.existsByTenantName(anyString())).thenReturn(true);

        // 执行测试并验证异常
        AssertionFailedError exception = assertThrows(AssertionFailedError.class, () -> {
            tenantService.createTenant(testTenant);
        });

        // 验证结果
        assertEquals("租户名称已存在", exception.getMessage());
        verify(tenantSchemaManager, never()).createTenantSchema(anyString());
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testUpdateTenant_Success() {
        // 准备数据
        Long tenantId = 1L;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(testTenant));
        when(tenantRepository.existsByTenantCode(anyString())).thenReturn(false);
        when(tenantRepository.existsByTenantName(anyString())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(testTenant);

        // 修改租户信息
        Tenant updatedTenant = new Tenant();
        updatedTenant.setTenantCode("UPDATED_TENANT");
        updatedTenant.setTenantName("更新后的租户");
        updatedTenant.setDescription("这是更新后的测试租户");
        updatedTenant.setStatus(0);

        // 执行测试
        Tenant result = tenantService.updateTenant(tenantId, updatedTenant);

        // 验证结果
        assertNotNull(result);
        assertEquals(updatedTenant.getTenantCode(), result.getTenantCode());
        assertEquals(updatedTenant.getTenantName(), result.getTenantName());
        assertEquals(updatedTenant.getDescription(), result.getDescription());
        assertEquals(updatedTenant.getStatus(), result.getStatus());
        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    void testUpdateTenant_NotFound() {
        // 准备数据
        Long tenantId = 1L;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.empty());

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tenantService.updateTenant(tenantId, testTenant);
        });

        // 验证结果
        assertEquals("租户不存在，ID: " + tenantId, exception.getMessage());
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testDeleteTenant_Success() {
        // 准备数据
        Long tenantId = 1L;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(testTenant));

        // 执行测试
        tenantService.deleteTenant(tenantId);

        // 验证结果
        verify(tenantSchemaManager).dropTenantSchema(testTenant.getTenantCode());
        verify(tenantRepository).deleteById(tenantId);
    }

    @Test
    void testDeleteTenant_NotFound() {
        // 准备数据
        Long tenantId = 1L;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.empty());

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tenantService.deleteTenant(tenantId);
        });

        // 验证结果
        assertEquals("租户不存在，ID: " + tenantId, exception.getMessage());
        verify(tenantSchemaManager, never()).dropTenantSchema(anyString());
        verify(tenantRepository, never()).deleteById(anyLong());
    }

    @Test
    void testGetTenantById_Success() {
        // 准备数据
        Long tenantId = 1L;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(testTenant));

        // 执行测试
        Optional<Tenant> result = tenantService.getTenantById(tenantId);

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals(testTenant.getId(), result.get().getId());
    }

    @Test
    void testGetTenantById_NotFound() {
        // 准备数据
        Long tenantId = 1L;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.empty());

        // 执行测试
        Optional<Tenant> result = tenantService.getTenantById(tenantId);

        // 验证结果
        assertFalse(result.isPresent());
    }

    @Test
    void testGetTenantByCode_Success() {
        // 准备数据
        String tenantCode = "TEST_TENANT";
        when(tenantRepository.findByTenantCode(tenantCode)).thenReturn(Optional.of(testTenant));

        // 执行测试
        Optional<Tenant> result = tenantService.getTenantByCode(tenantCode);

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals(testTenant.getTenantCode(), result.get().getTenantCode());
    }

    @Test
    void testGetTenantByCode_NotFound() {
        // 准备数据
        String tenantCode = "NON_EXISTENT";
        when(tenantRepository.findByTenantCode(tenantCode)).thenReturn(Optional.empty());

        // 执行测试
        Optional<Tenant> result = tenantService.getTenantByCode(tenantCode);

        // 验证结果
        assertFalse(result.isPresent());
    }

    @Test
    void testGetAllTenants() {
        // 准备数据
        when(tenantRepository.findAll()).thenReturn(Arrays.asList(testTenant));

        // 执行测试
        List<Tenant> result = tenantService.getAllTenants();

        // 验证结果
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(testTenant.getId(), result.get(0).getId());
    }

    @Test
    void testChangeTenantStatus_Success() {
        // 准备数据
        Long tenantId = 1L;
        Integer newStatus = 0;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(testTenant));
        when(tenantRepository.save(any(Tenant.class))).thenReturn(testTenant);

        // 执行测试
        Tenant result = tenantService.changeTenantStatus(tenantId, newStatus);

        // 验证结果
        assertNotNull(result);
        assertEquals(newStatus, result.getStatus());
        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    void testChangeTenantStatus_InvalidStatus() {
        // 准备数据
        Long tenantId = 1L;
        Integer invalidStatus = 2;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(testTenant));

        // 执行测试并验证异常
        AssertionFailedError exception = assertThrows(AssertionFailedError.class, () -> {
            tenantService.changeTenantStatus(tenantId, invalidStatus);
        });

        // 验证结果
        assertEquals("状态值无效，必须是0或1", exception.getMessage());
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testChangeTenantStatus_NotFound() {
        // 准备数据
        Long tenantId = 1L;
        Integer newStatus = 0;
        when(tenantRepository.findById(tenantId)).thenReturn(Optional.empty());

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tenantService.changeTenantStatus(tenantId, newStatus);
        });

        // 验证结果
        assertEquals("租户不存在，ID: " + tenantId, exception.getMessage());
        verify(tenantRepository, never()).save(any(Tenant.class));
    }
}