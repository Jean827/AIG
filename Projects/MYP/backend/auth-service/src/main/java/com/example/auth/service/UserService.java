package com.example.auth.service;

import com.example.auth.dto.UserDTO;
import com.example.auth.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User registerUser(UserDTO userDTO);
    User findByUsername(String username);
    List<User> findAllUsers();
    User updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}