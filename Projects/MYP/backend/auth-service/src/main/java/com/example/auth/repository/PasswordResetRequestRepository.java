package com.example.auth.repository;

import com.example.auth.entity.PasswordResetRequest;
import com.example.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Long> {
    Optional<PasswordResetRequest> findByToken(String token);
    Optional<PasswordResetRequest> findByUser(User user);
    void deleteByUser(User user);
}