package com.example.auth.controller;

import com.example.auth.dto.JwtAuthRequest;
import com.example.auth.dto.JwtAuthResponse;
import com.example.auth.dto.RefreshTokenRequest;
import com.example.auth.dto.UserDTO;
import com.example.auth.entity.User;
import com.example.auth.security.JwtTokenProvider;
import com.example.auth.service.PasswordResetService;
import com.example.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, 
                         JwtTokenProvider jwtTokenProvider, PasswordResetService passwordResetService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@RequestBody JwtAuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateJwtToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        User user = userService.findByUsername(loginRequest.getUsername());
        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setToken(jwt);
        jwtAuthResponse.setRefreshToken(refreshToken);
        jwtAuthResponse.setId(user.getId());
        jwtAuthResponse.setUsername(user.getUsername());
        jwtAuthResponse.setEmail(user.getEmail());
        jwtAuthResponse.setRoles(roles);

        return ResponseEntity.ok(jwtAuthResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<JwtAuthResponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
            return ResponseEntity.badRequest().body(null);
        }

        String username = jwtTokenProvider.getUserNameFromRefreshToken(refreshToken);
        User user = userService.findByUsername(username);

        // Create authentication token
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(), null, user.getAuthorities());

        // Generate new tokens
        String newJwtToken = jwtTokenProvider.generateJwtToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Blacklist the old refresh token
        jwtTokenProvider.blacklistToken(refreshToken);

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setToken(newJwtToken);
        jwtAuthResponse.setRefreshToken(newRefreshToken);
        jwtAuthResponse.setId(user.getId());
        jwtAuthResponse.setUsername(user.getUsername());
        jwtAuthResponse.setEmail(user.getEmail());
        jwtAuthResponse.setRoles(roles);

        return ResponseEntity.ok(jwtAuthResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@RequestBody UserDTO signUpRequest) {
        // Set default role if not provided
        if (signUpRequest.getRoles() == null || signUpRequest.getRoles().isEmpty()) {
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_USER");
            signUpRequest.setRoles(roles);
        }

        User registeredUser = userService.registerUser(signUpRequest);
        return ResponseEntity.ok(registeredUser);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok("密码重置邮件已发送，请查收邮箱");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("发送重置邮件失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestBody ResetTokenRequest request) {
        boolean isValid = passwordResetService.validatePasswordResetToken(request.getToken());
        if (isValid) {
            return ResponseEntity.ok("令牌有效");
        } else {
            return ResponseEntity.badRequest().body("令牌无效或已过期");
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok("密码重置成功");
        } else {
            return ResponseEntity.badRequest().body("密码重置失败，请检查令牌是否有效");
        }
    }
    
    // 密码重置相关的请求DTO类
    public static class ForgotPasswordRequest {
        private String email;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
    
    public static class ResetTokenRequest {
        private String token;
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
    }
    
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}