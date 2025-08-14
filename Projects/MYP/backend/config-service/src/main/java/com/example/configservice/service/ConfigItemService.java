package com.example.configservice.service;

import java.util.List;

import com.example.configservice.model.ConfigItem;

public interface ConfigItemService {
    // 创建配置项
    ConfigItem createConfigItem(ConfigItem configItem);

    // 更新配置项
    ConfigItem updateConfigItem(Long id, ConfigItem configItem);

    // 根据ID删除配置项
    void deleteConfigItem(Long id);

    // 根据ID查询配置项
    ConfigItem getConfigItemById(Long id);

    // 根据配置项ID查询
    ConfigItem getConfigItemByConfigId(String configId);

    // 查询所有配置项
    List<ConfigItem> getAllConfigItems();

    // 根据应用名称和环境查询配置项
    List<ConfigItem> getConfigItemsByApplicationAndEnvironment(String application, String environment);

    // 根据状态查询配置项
    List<ConfigItem> getConfigItemsByStatus(String status);

    // 提交配置项审核
    ConfigItem submitForReview(Long id);

    // 批准配置项
    ConfigItem approveConfigItem(Long id);

    // 拒绝配置项
    ConfigItem rejectConfigItem(Long id, String reason);

    // 发布配置项
    ConfigItem publishConfigItem(Long id);

    // 废弃配置项
    ConfigItem deprecateConfigItem(Long id, String reason);

    // 搜索配置项
    List<ConfigItem> searchConfigItems(String keyword);

    // 验证配置项
    boolean validateConfigItem(ConfigItem configItem);

    // 评估配置项变更风险
    String assessRiskLevel(ConfigItem oldConfigItem, ConfigItem newConfigItem);
}