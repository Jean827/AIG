package com.example.configservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.configservice.model.ConfigItem;

@Repository
public interface ConfigItemRepository extends JpaRepository<ConfigItem, Long> {
    // 根据配置项ID查询
    ConfigItem findByConfigId(String configId);

    // 根据应用名称和环境查询
    List<ConfigItem> findByApplicationAndEnvironment(String application, String environment);

    // 根据状态查询
    List<ConfigItem> findByStatus(String status);

    // 根据类型查询
    List<ConfigItem> findByType(String type);

    // 根据名称模糊查询
    List<ConfigItem> findByNameContaining(String name);

    // 根据应用名称、环境和状态查询
    List<ConfigItem> findByApplicationAndEnvironmentAndStatus(String application, String environment, String status);
}