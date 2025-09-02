package com.example.auth.controller;

import com.example.auth.entity.PermissionRecommendation;
import com.example.auth.entity.User;
import com.example.auth.service.PermissionRecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permission-recommendations")
public class PermissionRecommendationController {

    private final PermissionRecommendationService permissionRecommendationService;

    public PermissionRecommendationController(PermissionRecommendationService permissionRecommendationService) {
        this.permissionRecommendationService = permissionRecommendationService;
    }

    // 获取当前用户的权限推荐
    @GetMapping
    public ResponseEntity<List<PermissionRecommendation>> getRecommendationsForCurrentUser(
            @RequestParam(defaultValue = "false") boolean includeApplied,
            @AuthenticationPrincipal User currentUser) {
        List<PermissionRecommendation> recommendations = permissionRecommendationService.getRecommendationsForUser(currentUser, includeApplied);
        return ResponseEntity.ok(recommendations);
    }

    // 生成新的权限推荐
    @PostMapping("/generate")
    public ResponseEntity<List<PermissionRecommendation>> generateNewRecommendations(
            @AuthenticationPrincipal User currentUser) {
        List<PermissionRecommendation> newRecommendations = permissionRecommendationService.generateRecommendationsForUser(currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRecommendations);
    }

    // 应用权限推荐
    @PostMapping("/{recommendationId}/apply")
    public ResponseEntity<Void> applyRecommendation(
            @PathVariable Long recommendationId,
            @AuthenticationPrincipal User currentUser) {
        permissionRecommendationService.applyRecommendation(recommendationId);
        return ResponseEntity.ok().build();
    }

    // 拒绝权限推荐
    @PostMapping("/{recommendationId}/decline")
    public ResponseEntity<Void> declineRecommendation(
            @PathVariable Long recommendationId,
            @AuthenticationPrincipal User currentUser) {
        permissionRecommendationService.declineRecommendation(recommendationId);
        return ResponseEntity.ok().build();
    }

    // 预测适合当前用户的权限
    @GetMapping("/predictions")
    public ResponseEntity<List<String>> getPermissionPredictions(
            @AuthenticationPrincipal User currentUser) {
        List<String> predictedPermissionNames = permissionRecommendationService.predictSuitablePermissions(currentUser)
                .stream()
                .map(permission -> permission.getName() + " - " + permission.getDescription())
                .toList();
        return ResponseEntity.ok(predictedPermissionNames);
    }
}