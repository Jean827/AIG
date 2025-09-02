package com.example.auth.service.impl;

import com.example.auth.entity.PasswordResetRequest;
import com.example.auth.entity.User;
import com.example.auth.repository.PasswordResetRequestRepository;
import com.example.auth.repository.UserRepository;
import com.example.auth.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PasswordResetServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetRequestRepository passwordResetRequestRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordResetServiceImpl passwordResetService;

    private User testUser;
    private String testEmail = "test@example.com";
    private String testToken = UUID.randomUUID().toString();
    private String newPassword = "newPassword123";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(testEmail);
        testUser.setUsername("testuser");
        testUser.setPassword("oldPassword");
    }

    @Test
    void testRequestPasswordReset_Success() {
        // 模拟用户存在
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        // 模拟之前没有重置请求
        when(passwordResetRequestRepository.findByUser(testUser)).thenReturn(Optional.empty());

        // 执行密码重置请求
        passwordResetService.requestPasswordReset(testEmail);

        // 验证方法调用
        verify(userRepository).findByEmail(testEmail);
        verify(passwordResetRequestRepository).findByUser(testUser);
        verify(passwordResetRequestRepository).save(any(PasswordResetRequest.class));
        verify(emailService).sendSimpleEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testRequestPasswordReset_UserNotFound() {
        // 模拟用户不存在
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());

        // 验证抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            passwordResetService.requestPasswordReset(testEmail);
        });

        assertEquals("不存在使用该邮箱的用户", exception.getMessage());
        verify(userRepository).findByEmail(testEmail);
        verifyNoMoreInteractions(passwordResetRequestRepository, emailService);
    }

    @Test
    void testValidatePasswordResetToken_ValidToken() {
        // 创建有效的密码重置请求
        PasswordResetRequest resetRequest = new PasswordResetRequest(testUser, testToken, LocalDateTime.now().plusHours(1));
        resetRequest.setUsed(false);

        // 模拟找到有效的密码重置请求
        when(passwordResetRequestRepository.findByToken(testToken)).thenReturn(Optional.of(resetRequest));

        // 验证令牌
        boolean isValid = passwordResetService.validatePasswordResetToken(testToken);

        assertTrue(isValid);
        verify(passwordResetRequestRepository).findByToken(testToken);
    }

    @Test
    void testValidatePasswordResetToken_InvalidToken() {
        // 模拟找不到密码重置请求
        when(passwordResetRequestRepository.findByToken(testToken)).thenReturn(Optional.empty());

        // 验证令牌
        boolean isValid = passwordResetService.validatePasswordResetToken(testToken);

        assertFalse(isValid);
        verify(passwordResetRequestRepository).findByToken(testToken);
    }

    @Test
    void testValidatePasswordResetToken_ExpiredToken() {
        // 创建已过期的密码重置请求
        PasswordResetRequest resetRequest = new PasswordResetRequest(testUser, testToken, LocalDateTime.now().minusHours(1));
        resetRequest.setUsed(false);

        // 模拟找到已过期的密码重置请求
        when(passwordResetRequestRepository.findByToken(testToken)).thenReturn(Optional.of(resetRequest));

        // 验证令牌
        boolean isValid = passwordResetService.validatePasswordResetToken(testToken);

        assertFalse(isValid);
        verify(passwordResetRequestRepository).findByToken(testToken);
    }

    @Test
    void testValidatePasswordResetToken_UsedToken() {
        // 创建已使用的密码重置请求
        PasswordResetRequest resetRequest = new PasswordResetRequest(testUser, testToken, LocalDateTime.now().plusHours(1));
        resetRequest.setUsed(true);

        // 模拟找到已使用的密码重置请求
        when(passwordResetRequestRepository.findByToken(testToken)).thenReturn(Optional.of(resetRequest));

        // 验证令牌
        boolean isValid = passwordResetService.validatePasswordResetToken(testToken);

        assertFalse(isValid);
        verify(passwordResetRequestRepository).findByToken(testToken);
    }

    @Test
    void testResetPassword_Success() {
        // 创建有效的密码重置请求
        PasswordResetRequest resetRequest = new PasswordResetRequest(testUser, testToken, LocalDateTime.now().plusHours(1));
        resetRequest.setUsed(false);

        // 模拟找到有效的密码重置请求
        when(passwordResetRequestRepository.findByToken(testToken)).thenReturn(Optional.of(resetRequest));
        // 模拟密码加密
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedPassword");

        // 执行密码重置
        boolean success = passwordResetService.resetPassword(testToken, newPassword);

        assertTrue(success);
        // 验证用户密码是否更新
        assertEquals("encodedPassword", testUser.getPassword());
        // 验证重置请求是否标记为已使用
        assertTrue(resetRequest.isUsed());
        // 验证方法调用 - findByToken会被调用两次，一次在validate，一次在resetPassword
        verify(passwordResetRequestRepository, times(2)).findByToken(testToken);
        verify(userRepository).save(testUser);
        verify(passwordResetRequestRepository).save(resetRequest);
    }

    @Test
    void testResetPassword_InvalidToken() {
        // 模拟找不到密码重置请求
        when(passwordResetRequestRepository.findByToken(testToken)).thenReturn(Optional.empty());

        // 执行密码重置
        boolean success = passwordResetService.resetPassword(testToken, newPassword);

        assertFalse(success);
        verify(passwordResetRequestRepository).findByToken(testToken);
        verifyNoMoreInteractions(userRepository, passwordResetRequestRepository);
    }
}