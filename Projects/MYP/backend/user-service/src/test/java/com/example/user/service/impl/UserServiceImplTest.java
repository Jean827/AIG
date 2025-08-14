package com.example.user.service.impl;

import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * UserServiceImpl的单元测试类
 */
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private BCryptPasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        passwordEncoder = new BCryptPasswordEncoder();

        // 初始化测试用户
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setEmail("test@example.com");
        testUser.setPhone("1234567890");
        testUser.setStatus(1);
        testUser.setCreatedAt(new Date());
        testUser.setUpdatedAt(new Date());
        testUser.setTenantId(1L);
    }

    @Test
    void testCreateUser_Success() {
        // 准备数据
        when(userRepository.existsByUsername(testUser.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 执行测试
        User createdUser = userService.createUser(testUser);

        // 验证结果
        assertNotNull(createdUser);
        assertEquals(testUser.getUsername(), createdUser.getUsername());
        assertEquals(testUser.getEmail(), createdUser.getEmail());
        assertTrue(passwordEncoder.matches("password123", createdUser.getPassword()));

        // 验证方法调用
        verify(userRepository, times(1)).existsByUsername(testUser.getUsername());
        verify(userRepository, times(1)).existsByEmail(testUser.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUser_UsernameExists() {
        // 准备数据
        when(userRepository.existsByUsername(testUser.getUsername())).thenReturn(true);

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(testUser);
        });

        assertEquals("用户名已存在", exception.getMessage());

        // 验证方法调用
        verify(userRepository, times(1)).existsByUsername(testUser.getUsername());
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_EmailExists() {
        // 准备数据
        when(userRepository.existsByUsername(testUser.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(true);

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(testUser);
        });

        assertEquals("邮箱已存在", exception.getMessage());

        // 验证方法调用
        verify(userRepository, times(1)).existsByUsername(testUser.getUsername());
        verify(userRepository, times(1)).existsByEmail(testUser.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateUser_Success() {
        // 准备数据
        User updatedUser = new User();
        updatedUser.setUsername("updateduser");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setPhone("9876543210");
        updatedUser.setStatus(0);

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsername(updatedUser.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(updatedUser.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 执行测试
        User result = userService.updateUser(testUser.getId(), updatedUser);

        // 验证结果
        assertNotNull(result);
        assertEquals(updatedUser.getUsername(), result.getUsername());
        assertEquals(updatedUser.getEmail(), result.getEmail());
        assertEquals(updatedUser.getPhone(), result.getPhone());
        assertEquals(updatedUser.getStatus(), result.getStatus());

        // 验证方法调用
        verify(userRepository, times(1)).findById(testUser.getId());
        verify(userRepository, times(1)).existsByUsername(updatedUser.getUsername());
        verify(userRepository, times(1)).existsByEmail(updatedUser.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUser_UserNotFound() {
        // 准备数据
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(testUser.getId(), testUser);
        });

        assertEquals("用户不存在，ID: " + testUser.getId(), exception.getMessage());

        // 验证方法调用
        verify(userRepository, times(1)).findById(testUser.getId());
        verify(userRepository, never()).existsByUsername(anyString());
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testDeleteUser_Success() {
        // 准备数据
        when(userRepository.existsById(testUser.getId())).thenReturn(true);
        doNothing().when(userRepository).deleteById(testUser.getId());

        // 执行测试
        userService.deleteUser(testUser.getId());

        // 验证方法调用
        verify(userRepository, times(1)).existsById(testUser.getId());
        verify(userRepository, times(1)).deleteById(testUser.getId());
    }

    @Test
    void testDeleteUser_UserNotFound() {
        // 准备数据
        when(userRepository.existsById(testUser.getId())).thenReturn(false);

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(testUser.getId());
        });

        assertEquals("用户不存在，ID: " + testUser.getId(), exception.getMessage());

        // 验证方法调用
        verify(userRepository, times(1)).existsById(testUser.getId());
        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    void testGetUserById_Success() {
        // 准备数据
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // 执行测试
        Optional<User> result = userService.getUserById(testUser.getId());

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals(testUser.getId(), result.get().getId());

        // 验证方法调用
        verify(userRepository, times(1)).findById(testUser.getId());
    }

    @Test
    void testGetUserById_NotFound() {
        // 准备数据
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());

        // 执行测试
        Optional<User> result = userService.getUserById(testUser.getId());

        // 验证结果
        assertFalse(result.isPresent());

        // 验证方法调用
        verify(userRepository, times(1)).findById(testUser.getId());
    }

    @Test
    void testGetUserByUsername_Success() {
        // 准备数据
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));

        // 执行测试
        Optional<User> result = userService.getUserByUsername(testUser.getUsername());

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals(testUser.getUsername(), result.get().getUsername());

        // 验证方法调用
        verify(userRepository, times(1)).findByUsername(testUser.getUsername());
    }

    @Test
    void testGetUserByUsername_NotFound() {
        // 准备数据
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.empty());

        // 执行测试
        Optional<User> result = userService.getUserByUsername(testUser.getUsername());

        // 验证结果
        assertFalse(result.isPresent());

        // 验证方法调用
        verify(userRepository, times(1)).findByUsername(testUser.getUsername());
    }

    @Test
    void testGetAllUsers() {
        // 准备数据
        List<User> userList = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(userList);

        // 执行测试
        List<User> result = userService.getAllUsers();

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getId(), result.get(0).getId());

        // 验证方法调用
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetUsersByTenantId() {
        // 准备数据
        List<User> userList = Arrays.asList(testUser);
        when(userRepository.findByTenantId(testUser.getTenantId())).thenReturn(userList);

        // 执行测试
        List<User> result = userService.getUsersByTenantId(testUser.getTenantId());

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getTenantId(), result.get(0).getTenantId());

        // 验证方法调用
        verify(userRepository, times(1)).findByTenantId(testUser.getTenantId());
    }

    @Test
    void testChangeUserStatus_Success() {
        // 准备数据
        Integer newStatus = 0;
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 执行测试
        User result = userService.changeUserStatus(testUser.getId(), newStatus);

        // 验证结果
        assertNotNull(result);
        assertEquals(newStatus, result.getStatus());

        // 验证方法调用
        verify(userRepository, times(1)).findById(testUser.getId());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testChangeUserStatus_InvalidStatus() {
        // 准备数据
        Integer invalidStatus = 2;
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.changeUserStatus(testUser.getId(), invalidStatus);
        });

        assertEquals("状态值无效，必须是0或1", exception.getMessage());

        // 验证方法调用
        verify(userRepository, times(1)).findById(testUser.getId());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testAuthenticate_Success() {
        // 准备数据
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        testUser.setPassword(encodedPassword);

        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));

        // 执行测试
        Optional<User> result = userService.authenticate(testUser.getUsername(), rawPassword);

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals(testUser.getUsername(), result.get().getUsername());

        // 验证方法调用
        verify(userRepository, times(1)).findByUsername(testUser.getUsername());
    }

    @Test
    void testAuthenticate_Failure_WrongPassword() {
        // 准备数据
        String wrongPassword = "wrongpassword";
        String encodedPassword = passwordEncoder.encode("password123");
        testUser.setPassword(encodedPassword);

        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));

        // 执行测试
        Optional<User> result = userService.authenticate(testUser.getUsername(), wrongPassword);

        // 验证结果
        assertFalse(result.isPresent());

        // 验证方法调用
        verify(userRepository, times(1)).findByUsername(testUser.getUsername());
    }

    @Test
    void testAuthenticate_Failure_UserNotFound() {
        // 准备数据
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.empty());

        // 执行测试
        Optional<User> result = userService.authenticate(testUser.getUsername(), "password123");

        // 验证结果
        assertFalse(result.isPresent());

        // 验证方法调用
        verify(userRepository, times(1)).findByUsername(testUser.getUsername());
    }
}