package com.example.auth.service.impl;

import com.example.auth.entity.PasswordResetRequest;
import com.example.auth.entity.User;
import com.example.auth.repository.PasswordResetRequestRepository;
import com.example.auth.repository.UserRepository;
import com.example.auth.service.EmailService;
import com.example.auth.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetRequestRepository passwordResetRequestRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Autowired
    public PasswordResetServiceImpl(UserRepository userRepository,
                                    PasswordResetRequestRepository passwordResetRequestRepository,
                                    EmailService emailService,
                                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordResetRequestRepository = passwordResetRequestRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        // 查找用户
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("不存在使用该邮箱的用户"));

        // 生成重置令牌
        String token = generateResetToken();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24); // 令牌有效期24小时

        // 删除用户之前的密码重置请求
        passwordResetRequestRepository.findByUser(user)
                .ifPresent(passwordResetRequestRepository::delete);

        // 创建新的密码重置请求
        PasswordResetRequest resetRequest = new PasswordResetRequest(user, token, expiryDate);
        passwordResetRequestRepository.save(resetRequest);

        // 发送密码重置邮件
        sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    public boolean validatePasswordResetToken(String token) {
        // 查找密码重置请求
        PasswordResetRequest resetRequest = passwordResetRequestRepository.findByToken(token)
                .orElse(null);

        // 检查令牌是否存在、是否已使用、是否已过期
        return resetRequest != null && !resetRequest.isUsed() && !resetRequest.isExpired();
    }

    @Override
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        // 验证令牌
        if (!validatePasswordResetToken(token)) {
            return false;
        }

        // 查找密码重置请求
        PasswordResetRequest resetRequest = passwordResetRequestRepository.findByToken(token)
                .orElse(null);

        if (resetRequest == null) {
            return false;
        }

        // 获取用户并更新密码
        User user = resetRequest.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 标记密码重置请求为已使用
        resetRequest.setUsed(true);
        passwordResetRequestRepository.save(resetRequest);

        return true;
    }

    // 生成密码重置令牌
    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    // 发送密码重置邮件
    private void sendPasswordResetEmail(String to, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "密码重置请求";
        String text = "您收到此邮件是因为有人请求重置您的账户密码。\n" +
                "请点击以下链接重置您的密码：\n" + resetUrl + "\n\n" +
                "如果您没有请求重置密码，请忽略此邮件。\n" +
                "此链接将在24小时后过期。";

        emailService.sendSimpleEmail(to, subject, text);
    }
}