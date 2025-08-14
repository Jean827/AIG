package com.example.configservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.configservice.model.ConfigItem;
import com.example.configservice.service.ConfigItemService;

@RestController
@RequestMapping("/api/config-items")
public class ConfigItemController {

    @Autowired
    private ConfigItemService configItemService;

    // 创建配置项
    @PostMapping
    public ResponseEntity<ConfigItem> createConfigItem(@RequestBody ConfigItem configItem) {
        ConfigItem createdConfigItem = configItemService.createConfigItem(configItem);
        return new ResponseEntity<>(createdConfigItem, HttpStatus.CREATED);
    }

    // 更新配置项
    @PutMapping("/{id}")
    public ResponseEntity<ConfigItem> updateConfigItem(@PathVariable Long id, @RequestBody ConfigItem configItem) {
        ConfigItem updatedConfigItem = configItemService.updateConfigItem(id, configItem);
        return ResponseEntity.ok(updatedConfigItem);
    }

    // 删除配置项
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfigItem(@PathVariable Long id) {
        configItemService.deleteConfigItem(id);
        return ResponseEntity.noContent().build();
    }

    // 根据ID查询配置项
    @GetMapping("/{id}")
    public ResponseEntity<ConfigItem> getConfigItemById(@PathVariable Long id) {
        ConfigItem configItem = configItemService.getConfigItemById(id);
        return ResponseEntity.ok(configItem);
    }

    // 根据配置项ID查询
    @GetMapping("/config-id/{configId}")
    public ResponseEntity<ConfigItem> getConfigItemByConfigId(@PathVariable String configId) {
        ConfigItem configItem = configItemService.getConfigItemByConfigId(configId);
        return ResponseEntity.ok(configItem);
    }

    // 查询所有配置项
    @GetMapping
    public ResponseEntity<List<ConfigItem>> getAllConfigItems() {
        List<ConfigItem> configItems = configItemService.getAllConfigItems();
        return ResponseEntity.ok(configItems);
    }

    // 根据应用名称和环境查询配置项
    @GetMapping("/application-environment")
    public ResponseEntity<List<ConfigItem>> getConfigItemsByApplicationAndEnvironment(
            @RequestParam String application, @RequestParam String environment) {
        List<ConfigItem> configItems = configItemService.getConfigItemsByApplicationAndEnvironment(application, environment);
        return ResponseEntity.ok(configItems);
    }

    // 根据状态查询配置项
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ConfigItem>> getConfigItemsByStatus(@PathVariable String status) {
        List<ConfigItem> configItems = configItemService.getConfigItemsByStatus(status);
        return ResponseEntity.ok(configItems);
    }

    // 提交配置项审核
    @PostMapping("/{id}/submit-for-review")
    public ResponseEntity<ConfigItem> submitForReview(@PathVariable Long id) {
        ConfigItem configItem = configItemService.submitForReview(id);
        return ResponseEntity.ok(configItem);
    }

    // 批准配置项
    @PostMapping("/{id}/approve")
    public ResponseEntity<ConfigItem> approveConfigItem(@PathVariable Long id) {
        ConfigItem configItem = configItemService.approveConfigItem(id);
        return ResponseEntity.ok(configItem);
    }

    // 拒绝配置项
    @PostMapping("/{id}/reject")
    public ResponseEntity<ConfigItem> rejectConfigItem(@PathVariable Long id, @RequestParam String reason) {
        ConfigItem configItem = configItemService.rejectConfigItem(id, reason);
        return ResponseEntity.ok(configItem);
    }

    // 发布配置项
    @PostMapping("/{id}/publish")
    public ResponseEntity<ConfigItem> publishConfigItem(@PathVariable Long id) {
        ConfigItem configItem = configItemService.publishConfigItem(id);
        return ResponseEntity.ok(configItem);
    }

    // 废弃配置项
    @PostMapping("/{id}/deprecate")
    public ResponseEntity<ConfigItem> deprecateConfigItem(@PathVariable Long id, @RequestParam String reason) {
        ConfigItem configItem = configItemService.deprecateConfigItem(id, reason);
        return ResponseEntity.ok(configItem);
    }

    // 搜索配置项
    @GetMapping("/search")
    public ResponseEntity<List<ConfigItem>> searchConfigItems(@RequestParam String keyword) {
        List<ConfigItem> configItems = configItemService.searchConfigItems(keyword);
        return ResponseEntity.ok(configItems);
    }

    // 验证配置项
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateConfigItem(@RequestBody ConfigItem configItem) {
        boolean isValid = configItemService.validateConfigItem(configItem);
        return ResponseEntity.ok(isValid);
    }

    // 评估配置项变更风险
    @PostMapping("/assess-risk")
    public ResponseEntity<String> assessRiskLevel(
            @RequestBody ConfigItem oldConfigItem, @RequestBody ConfigItem newConfigItem) {
        String riskLevel = configItemService.assessRiskLevel(oldConfigItem, newConfigItem);
        return ResponseEntity.ok(riskLevel);
    }
}