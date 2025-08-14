package com.example.auth.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private String email;
    private Long tenantId;
    private Set<String> roles;
}