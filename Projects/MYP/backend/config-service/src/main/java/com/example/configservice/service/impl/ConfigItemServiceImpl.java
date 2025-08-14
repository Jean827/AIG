package com.example.configservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.configservice.model.ConfigItem;
import com.example.configservice.repository.ConfigItemRepository;
import com.example.configservice.service.ConfigItemService;

@Service
public class ConfigItemServiceImpl implements ConfigItemService {

    @Autowired
    private ConfigItemRepository configItemRepository;

    @Override
    @Transactional
    public ConfigItem createConfigItem(ConfigItem configItem) {
        // 验证配置项
        if (!validateConfigItem(configItem)) {
            throw new IllegalArgumentException("Invalid config item");
        }

        // 生成配置项ID
        String typeCode = getTypeCode(configItem.getType());
        String configId = String.format("CFG-%s-%s-%s",
                typeCode,
                UUID.randomUUID().toString().substring(0, 6),
                configItem.getVersion());
        configItem.setConfigId(configId);

        // 设置默认状态为草稿
        configItem.setStatus("草稿");

        // 设置时间戳
        LocalDateTime now = LocalDateTime.now();
        configItem.setCreatedAt(now);
        configItem.setUpdatedAt(now);

        return configItemRepository.save(configItem);
    }

    @Override
    @Transactional
    public ConfigItem updateConfigItem(Long id, ConfigItem configItem) {
        Optional<ConfigItem> existingConfigItemOpt = configItemRepository.findById(id);
        if (!existingConfigItemOpt.isPresent()) {
            throw new IllegalArgumentException("Config item not found");
        }

        ConfigItem existingConfigItem = existingConfigItemOpt.get();

        // 检查状态，如果已发布，则不允许修改
        if ("已发布".equals(existingConfigItem.getStatus())) {
            throw new IllegalStateException("Cannot modify published config item");
        }

        // 更新字段
        existingConfigItem.setName(configItem.getName());
        existingConfigItem.setValue(configItem.getValue());
        existingConfigItem.setDescription(configItem.getDescription());
        existingConfigItem.setEnvironment(configItem.getEnvironment());
        existingConfigItem.setApplication(configItem.getApplication());
        existingConfigItem.setAttributes(configItem.getAttributes());
        existingConfigItem.setChangeReason(configItem.getChangeReason());
        existingConfigItem.setUpdatedAt(LocalDateTime.now());
        existingConfigItem.setUpdatedBy(configItem.getUpdatedBy());

        // 验证配置项
        if (!validateConfigItem(existingConfigItem)) {
            throw new IllegalArgumentException("Invalid config item");
        }

        return configItemRepository.save(existingConfigItem);
    }

    @Override
    @Transactional
    public void deleteConfigItem(Long id) {
        Optional<ConfigItem> configItemOpt = configItemRepository.findById(id);
        if (!configItemOpt.isPresent()) {
            throw new IllegalArgumentException("Config item not found");
        }

        ConfigItem configItem = configItemOpt.get();

        // 检查状态，如果已发布，则不允许删除
        if ("已发布".equals(configItem.getStatus())) {
            throw new IllegalStateException("Cannot delete published config item");
        }

        configItemRepository.deleteById(id);
    }

    @Override
    public ConfigItem getConfigItemById(Long id) {
        return configItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Config item not found"));
    }

    @Override
    public ConfigItem getConfigItemByConfigId(String configId) {
        ConfigItem configItem = configItemRepository.findByConfigId(configId);
        if (configItem == null) {
            throw new IllegalArgumentException("Config item not found");
        }
        return configItem;
    }

    @Override
    public List<ConfigItem> getAllConfigItems() {
        return configItemRepository.findAll();
    }

    @Override
    public List<ConfigItem> getConfigItemsByApplicationAndEnvironment(String application, String environment) {
        return configItemRepository.findByApplicationAndEnvironment(application, environment);
    }

    @Override
    public List<ConfigItem> getConfigItemsByStatus(String status) {
        return configItemRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public ConfigItem submitForReview(Long id) {
        ConfigItem configItem = getConfigItemById(id);

        // 检查状态，如果不是草稿，则不允许提交审核
        if (!"草稿".equals(configItem.getStatus())) {
            throw new IllegalStateException("Only draft config items can be submitted for review");
        }

        // 更新状态为待审核
        configItem.setStatus("待审核");
        configItem.setUpdatedAt(LocalDateTime.now());

        return configItemRepository.save(configItem);
    }

    @Override
    @Transactional
    public ConfigItem approveConfigItem(Long id) {
        ConfigItem configItem = getConfigItemById(id);

        // 检查状态，如果不是待审核，则不允许批准
        if (!"待审核".equals(configItem.getStatus())) {
            throw new IllegalStateException("Only config items pending review can be approved");
        }

        // 更新状态为已批准
        configItem.setStatus("已批准");
        configItem.setUpdatedAt(LocalDateTime.now());

        return configItemRepository.save(configItem);
    }

    @Override
    @Transactional
    public ConfigItem rejectConfigItem(Long id, String reason) {
        ConfigItem configItem = getConfigItemById(id);

        // 检查状态，如果不是待审核，则不允许拒绝
        if (!"待审核".equals(configItem.getStatus())) {
            throw new IllegalStateException("Only config items pending review can be rejected");
        }

        // 更新状态为草稿，并添加拒绝原因
        configItem.setStatus("草稿");
        configItem.setChangeReason(reason);
        configItem.setUpdatedAt(LocalDateTime.now());

        return configItemRepository.save(configItem);
    }

    @Override
    @Transactional
    public ConfigItem publishConfigItem(Long id) {
        ConfigItem configItem = getConfigItemById(id);

        // 检查状态，如果不是已批准，则不允许发布
        if (!"已批准".equals(configItem.getStatus())) {
            throw new IllegalStateException("Only approved config items can be published");
        }

        // 更新状态为已发布
        configItem.setStatus("已发布");
        configItem.setUpdatedAt(LocalDateTime.now());

        return configItemRepository.save(configItem);
    }

    @Override
    @Transactional
    public ConfigItem deprecateConfigItem(Long id, String reason) {
        ConfigItem configItem = getConfigItemById(id);

        // 检查状态，如果不是已发布，则不允许废弃
        if (!"已发布".equals(configItem.getStatus())) {
            throw new IllegalStateException("Only published config items can be deprecated");
        }

        // 更新状态为已废弃
        configItem.setStatus("已废弃");
        configItem.setChangeReason(reason);
        configItem.setUpdatedAt(LocalDateTime.now());

        return configItemRepository.save(configItem);
    }

    @Override
    public List<ConfigItem> searchConfigItems(String keyword) {
        return configItemRepository.findByNameContaining(keyword);
    }

    @Override
    public boolean validateConfigItem(ConfigItem configItem) {
        // 基本验证
        if (configItem.getName() == null || configItem.getName().isEmpty()) {
            return false;
        }

        if (configItem.getType() == null || configItem.getType().isEmpty()) {
            return false;
        }

        if (configItem.getValue() == null) {
            return false;
        }

        if (configItem.getEnvironment() == null || configItem.getEnvironment().isEmpty()) {
            return false;
        }

        if (configItem.getApplication() == null || configItem.getApplication().isEmpty()) {
            return false;
        }

        if (configItem.getVersion() == null || configItem.getVersion().isEmpty()) {
            return false;
        }

        // 验证配置项类型
        String typeCode = getTypeCode(configItem.getType());
        if (typeCode == null) {
            return false;
        }

        // 验证配置项状态
        if (configItem.getStatus() != null) {
            if (!configItem.getStatus().equals("草稿") &&
                !configItem.getStatus().equals("待审核") &&
                !configItem.getStatus().equals("已批准") &&
                !configItem.getStatus().equals("已发布") &&
                !configItem.getStatus().equals("已废弃")) {
                return false;
            }
        }

        return true;
    }

    @Override
    public String assessRiskLevel(ConfigItem oldConfigItem, ConfigItem newConfigItem) {
        // 简单的风险评估逻辑
        // 如果是核心配置项变更，风险等级为高
        // 如果是一般配置项变更，风险等级为中
        // 如果是微小配置项变更，风险等级为低

        // 这里只是示例，实际的风险评估可能更复杂
        if (oldConfigItem == null) {
            // 新增配置项，风险较低
            return "低";
        }

        // 检查是否是核心配置
        if (newConfigItem.getName().contains("database") ||
            newConfigItem.getName().contains("redis") ||
            newConfigItem.getName().contains("server") ||
            newConfigItem.getName().contains("port")) {
            return "高";
        }

        // 检查变更范围
        if (!oldConfigItem.getValue().equals(newConfigItem.getValue())) {
            return "中";
        }

        return "低";
    }

    private String getTypeCode(String type) {
        switch (type.toLowerCase()) {
            case "软件配置项":
            case "soft":
                return "SOFT";
            case "环境配置项":
            case "env":
                return "ENV";
            case "数据配置项":
            case "data":
                return "DATA";
            case "系统配置项":
            case "sys":
                return "SYS";
            default:
                return null;
        }
    }
}