package com.example.auth.service;

import com.example.auth.entity.Permission;
import com.example.auth.entity.PermissionRecommendation;
import com.example.auth.entity.User;
import java.util.List;

public interface PermissionRecommendationService {
    // 为用户生成权限推荐
    List<PermissionRecommendation> generateRecommendationsForUser(User user);
    
    // 获取用户的权限推荐列表
    List<PermissionRecommendation> getRecommendationsForUser(User user, boolean includeApplied);
    
    // 应用权限推荐
    void applyRecommendation(Long recommendationId);
    
    // 拒绝权限推荐
    void declineRecommendation(Long recommendationId);
    
    // 记录用户行为数据
    void recordUserActivity(User user, String activityType, String resourceType, Long resourceId, String ipAddress, String userAgent, String result);
    
    // 根据用户角色和行为预测合适的权限
    List<Permission> predictSuitablePermissions(User user);
}