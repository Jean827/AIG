package com.example.user.service;

import com.example.user.model.User;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务接口
 */
public interface UserService {
    /**
     * 创建用户
     * @param user 用户对象
     * @return 创建的用户
     */
    User createUser(User user);

    /**
     * 更新用户
     * @param id 用户ID
     * @param user 更新的用户信息
     * @return 更新后的用户
     */
    User updateUser(Long id, User user);

    /**
     * 删除用户
     * @param id 用户ID
     */
    void deleteUser(Long id);

    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户对象
     */
    Optional<User> getUserById(Long id);

    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户对象
     */
    Optional<User> getUserByUsername(String username);

    /**
     * 根据邮箱查询用户
     * @param email 邮箱
     * @return 用户对象
     */
    Optional<User> getUserByEmail(String email);

    /**
     * 查询所有用户
     * @return 用户列表
     */
    List<User> getAllUsers();

    /**
     * 根据租户ID查询用户
     * @param tenantId 租户ID
     * @return 用户列表
     */
    List<User> getUsersByTenantId(Long tenantId);

    /**
     * 更改用户状态
     * @param id 用户ID
     * @param status 状态值(0:禁用, 1:启用)
     * @return 更新后的用户
     */
    User changeUserStatus(Long id, Integer status);

    /**
     * 验证用户凭据
     * @param username 用户名
     * @param password 密码
     * @return 验证通过的用户
     */
    Optional<User> authenticate(String username, String password);

    /**
     * 为用户分配角色
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 更新后的用户
     */
    User addRoleToUser(Long userId, Long roleId);

    /**
     * 从用户移除角色
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 更新后的用户
     */
    User removeRoleFromUser(Long userId, Long roleId);

    /**
     * 获取用户的角色列表
     * @param userId 用户ID
     * @return 角色列表
     */
    Set<Role> getUserRoles(Long userId);

    /**
     * 创建角色
     * @param role 角色对象
     * @return 创建的角色
     */
    Role createRole(Role role);

    /**
     * 更新角色
     * @param id 角色ID
     * @param role 更新的角色信息
     * @return 更新后的角色
     */
    Role updateRole(Long id, Role role);

    /**
     * 删除角色
     * @param id 角色ID
     */
    void deleteRole(Long id);

    /**
     * 获取所有角色
     * @return 角色列表
     */
    List<Role> getAllRoles();

    /**
     * 根据名称获取角色
     * @param name 角色名称
     * @return 角色对象
     */
    Optional<Role> getRoleByName(String name);
}