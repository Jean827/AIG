package com.example.auth.dto;

import lombok.Data;

import java.util.Set;

@Data
public class JwtAuthResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
}