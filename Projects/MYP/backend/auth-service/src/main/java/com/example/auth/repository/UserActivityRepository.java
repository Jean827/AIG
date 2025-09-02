package com.example.auth.repository;

import com.example.auth.entity.User;
import com.example.auth.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    List<UserActivity> findByUserAndActivityType(User user, String activityType);
    List<UserActivity> findByUserAndResourceType(User user, String resourceType);
    List<UserActivity> findByUserOrderByCreatedAtDesc(User user);
    List<UserActivity> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a.activityType, COUNT(a) FROM UserActivity a WHERE a.user = :user GROUP BY a.activityType")
    List<Object[]> countActivitiesByType(User user);

    @Query("SELECT a.resourceType, COUNT(a) FROM UserActivity a WHERE a.user = :user GROUP BY a.resourceType")
    List<Object[]> countActivitiesByResourceType(User user);
}