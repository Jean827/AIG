package com.example.auth.repository;

import com.example.auth.entity.PermissionRecommendation;
import com.example.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRecommendationRepository extends JpaRepository<PermissionRecommendation, Long> {
    List<PermissionRecommendation> findByUser(User user);
    List<PermissionRecommendation> findByUserAndIsApplied(User user, boolean isApplied);
    boolean existsByUserIdAndPermissionId(Long userId, Long permissionId);
}