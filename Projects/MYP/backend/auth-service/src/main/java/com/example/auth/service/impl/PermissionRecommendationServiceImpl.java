package com.example.auth.service.impl;

import com.example.auth.entity.Permission;
import com.example.auth.entity.PermissionRecommendation;
import com.example.auth.entity.Role;
import com.example.auth.entity.User;
import com.example.auth.entity.UserActivity;
import com.example.auth.repository.PermissionRecommendationRepository;
import com.example.auth.repository.PermissionRepository;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserActivityRepository;
import com.example.auth.service.PermissionRecommendationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PermissionRecommendationServiceImpl implements PermissionRecommendationService {

    private final PermissionRecommendationRepository permissionRecommendationRepository;
    private final PermissionRepository permissionRepository;
    private final UserActivityRepository userActivityRepository;
    private final RoleRepository roleRepository;

    public PermissionRecommendationServiceImpl(PermissionRecommendationRepository permissionRecommendationRepository,
                                             PermissionRepository permissionRepository,
                                             UserActivityRepository userActivityRepository,
                                             RoleRepository roleRepository) {
        this.permissionRecommendationRepository = permissionRecommendationRepository;
        this.permissionRepository = permissionRepository;
        this.userActivityRepository = userActivityRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public List<PermissionRecommendation> generateRecommendationsForUser(User user) {
        // 1. 获取用户已有的角色和权限
        Set<String> existingPermissionNames = new HashSet<>();
        for (Role role : user.getRoles()) {
            for (Permission permission : role.getPermissions()) {
                existingPermissionNames.add(permission.getName());
            }
        }

        // 2. 预测适合用户的权限
        List<Permission> recommendedPermissions = predictSuitablePermissions(user);

        // 3. 过滤掉用户已有的权限和已推荐但未应用的权限
        List<Permission> newRecommendations = recommendedPermissions.stream()
                .filter(permission -> !existingPermissionNames.contains(permission.getName()))
                .filter(permission -> !permissionRecommendationRepository.existsByUserIdAndPermissionId(user.getId(), permission.getId()))
                .collect(Collectors.toList());

        // 4. 创建权限推荐记录
        List<PermissionRecommendation> recommendations = new ArrayList<>();
        for (Permission permission : newRecommendations) {
            PermissionRecommendation recommendation = new PermissionRecommendation();
            recommendation.setUser(user);
            recommendation.setPermission(permission);
            recommendation.setRecommendationScore(calculateRecommendationScore(user, permission));
            recommendation.setRecommendationReason(generateRecommendationReason(user, permission));
            recommendation.setCreatedAt(LocalDateTime.now());
            recommendation.setApplied(false);
            
            recommendations.add(permissionRecommendationRepository.save(recommendation));
        }

        return recommendations;
    }

    @Override
    public List<PermissionRecommendation> getRecommendationsForUser(User user, boolean includeApplied) {
        if (includeApplied) {
            return permissionRecommendationRepository.findByUser(user);
        } else {
            return permissionRecommendationRepository.findByUserAndIsApplied(user, false);
        }
    }

    @Override
    @Transactional
    public void applyRecommendation(Long recommendationId) {
        PermissionRecommendation recommendation = permissionRecommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new RuntimeException("Permission recommendation not found with id: " + recommendationId));
        
        if (recommendation.isApplied()) {
            throw new RuntimeException("Permission recommendation has already been applied");
        }
        
        // 将权限添加到用户的角色中（简化版实现，实际可能需要更复杂的逻辑）
        User user = recommendation.getUser();
        Permission permission = recommendation.getPermission();
        
        // 这里简化处理，将权限添加到用户的第一个角色中
        if (!user.getRoles().isEmpty()) {
            Role firstRole = user.getRoles().iterator().next();
            if (!firstRole.getPermissions().contains(permission)) {
                firstRole.getPermissions().add(permission);
                roleRepository.save(firstRole);
            }
        }
        
        // 标记推荐为已应用
        recommendation.setApplied(true);
        permissionRecommendationRepository.save(recommendation);
    }

    @Override
    @Transactional
    public void declineRecommendation(Long recommendationId) {
        PermissionRecommendation recommendation = permissionRecommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new RuntimeException("Permission recommendation not found with id: " + recommendationId));
        
        if (recommendation.isApplied()) {
            throw new RuntimeException("Cannot decline an already applied recommendation");
        }
        
        // 标记推荐为已拒绝（在这个简化实现中，我们直接删除记录）
        permissionRecommendationRepository.delete(recommendation);
    }

    @Override
    @Transactional
    public void recordUserActivity(User user, String activityType, String resourceType, Long resourceId, 
                                 String ipAddress, String userAgent, String result) {
        UserActivity activity = new UserActivity();
        activity.setUser(user);
        activity.setActivityType(activityType);
        activity.setResourceType(resourceType);
        activity.setResourceId(resourceId);
        activity.setIpAddress(ipAddress);
        activity.setUserAgent(userAgent);
        activity.setActivityResult(result);
        activity.setCreatedAt(LocalDateTime.now());
        
        userActivityRepository.save(activity);
    }

    @Override
    public List<Permission> predictSuitablePermissions(User user) {
        // 获取用户最近的活动记录
        List<UserActivity> recentActivities = userActivityRepository.findByUserOrderByCreatedAtDesc(user);
        
        // 分析用户活动，识别频繁访问的资源类型
        Map<String, Long> resourceTypeCount = new HashMap<>();
        Map<String, Long> activityTypeCount = new HashMap<>();
        
        for (UserActivity activity : recentActivities) {
            resourceTypeCount.put(activity.getResourceType(), 
                    resourceTypeCount.getOrDefault(activity.getResourceType(), 0L) + 1);
            activityTypeCount.put(activity.getActivityType(), 
                    activityTypeCount.getOrDefault(activity.getActivityType(), 0L) + 1);
        }
        
        // 根据用户角色、活动历史和租户上下文预测合适的权限
        List<Permission> predictions = new ArrayList<>();
        
        // 角色基础推荐
        for (Role role : user.getRoles()) {
            // 根据角色推荐相关的扩展权限
            List<Permission> roleBasedRecommendations = getRoleBasedRecommendations(role);
            predictions.addAll(roleBasedRecommendations);
        }
        
        // 活动历史推荐
        List<Permission> activityBasedRecommendations = getActivityBasedRecommendations(resourceTypeCount, activityTypeCount);
        predictions.addAll(activityBasedRecommendations);
        
        // 去重
        return predictions.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    // 辅助方法：计算推荐分数
    private double calculateRecommendationScore(User user, Permission permission) {
        // 简单实现，实际项目中可以使用更复杂的算法
        double baseScore = 0.5;
        
        // 根据用户角色调整分数
        for (Role role : user.getRoles()) {
            if (role.getName().contains("ADMIN")) {
                baseScore += 0.3;
            }
        }
        
        // 根据用户活动历史调整分数
        List<UserActivity> recentActivities = userActivityRepository.findByUserOrderByCreatedAtDesc(user);
        long relevantActivities = recentActivities.stream()
                .filter(activity -> isActivityRelevantToPermission(activity, permission))
                .count();
        
        baseScore += Math.min(relevantActivities * 0.05, 0.2); // 最多增加0.2分
        
        return Math.min(baseScore, 1.0);
    }

    // 辅助方法：生成推荐理由
    private String generateRecommendationReason(User user, Permission permission) {
        StringBuilder reason = new StringBuilder();
        
        // 基于角色的理由
        for (Role role : user.getRoles()) {
            if (role.getName().contains("ADMIN")) {
                reason.append("基于您的管理员角色，");
                break;
            }
        }
        
        // 基于活动的理由
        List<UserActivity> recentActivities = userActivityRepository.findByUserOrderByCreatedAtDesc(user);
        long relevantActivities = recentActivities.stream()
                .filter(activity -> isActivityRelevantToPermission(activity, permission))
                .count();
        
        if (relevantActivities > 0) {
            reason.append("您最近频繁访问相关资源，");
        }
        
        // 添加通用理由
        reason.append("我们推荐您添加此权限以提升工作效率。");
        
        return reason.toString();
    }

    // 辅助方法：判断活动是否与权限相关
    private boolean isActivityRelevantToPermission(UserActivity activity, Permission permission) {
        // 简单实现，实际项目中可以根据具体业务逻辑进行更复杂的判断
        String permissionName = permission.getName().toLowerCase();
        String resourceType = activity.getResourceType() != null ? activity.getResourceType().toLowerCase() : "";
        String activityType = activity.getActivityType() != null ? activity.getActivityType().toLowerCase() : "";
        
        return permissionName.contains(resourceType) || permissionName.contains(activityType);
    }

    // 辅助方法：基于角色的权限推荐
    private List<Permission> getRoleBasedRecommendations(Role role) {
        // 示例实现，可以根据实际业务需求调整
        List<Permission> recommendations = new ArrayList<>();
        
        if (role.getName().equals("ROLE_USER")) {
            // 为普通用户推荐一些常见的权限
            recommendations.addAll(permissionRepository.findAll().stream()
                    .filter(p -> p.getName().contains("VIEW") && !p.getName().contains("SENSITIVE"))
                    .collect(Collectors.toList()));
        } else if (role.getName().equals("ROLE_TENANT_ADMIN")) {
            // 为租户管理员推荐更多管理相关的权限
            recommendations.addAll(permissionRepository.findAll().stream()
                    .filter(p -> p.getName().contains("MANAGE") && p.getName().contains("TENANT"))
                    .collect(Collectors.toList()));
        } else if (role.getName().equals("ROLE_ADMIN")) {
            // 为系统管理员推荐几乎所有权限
            recommendations.addAll(permissionRepository.findAll());
        }
        
        return recommendations;
    }

    // 辅助方法：基于活动的权限推荐
    private List<Permission> getActivityBasedRecommendations(Map<String, Long> resourceTypeCount, Map<String, Long> activityTypeCount) {
        // 示例实现，根据用户经常访问的资源类型和活动类型推荐相应的权限
        List<Permission> recommendations = new ArrayList<>();
        
        // 找出用户最常访问的资源类型
        String mostAccessedResourceType = resourceTypeCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("unknown");
        
        // 找出用户最常进行的活动类型
        String mostCommonActivityType = activityTypeCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("unknown");
        
        // 推荐与最常访问资源相关的权限
        recommendations.addAll(permissionRepository.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(mostAccessedResourceType.toLowerCase()))
                .collect(Collectors.toList()));
        
        // 推荐与最常进行活动相关的权限
        if (mostCommonActivityType.equals("CREATE") || mostCommonActivityType.equals("UPDATE")) {
            recommendations.addAll(permissionRepository.findAll().stream()
                    .filter(p -> p.getName().contains("MANAGE"))
                    .collect(Collectors.toList()));
        } else if (mostCommonActivityType.equals("READ")) {
            recommendations.addAll(permissionRepository.findAll().stream()
                    .filter(p -> p.getName().contains("VIEW"))
                    .collect(Collectors.toList()));
        }
        
        return recommendations;
    }
}