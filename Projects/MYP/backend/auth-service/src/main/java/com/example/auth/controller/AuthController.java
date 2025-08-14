package com.example.auth.controller;

import com.example.auth.dto.JwtAuthRequest;
import com.example.auth.dto.JwtAuthResponse;
import com.example.auth.dto.RefreshTokenRequest;
import com.example.auth.dto.UserDTO;
import com.example.auth.entity.User;
import com.example.auth.security.JwtTokenProvider;
import com.example.auth.service.UserService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

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
}