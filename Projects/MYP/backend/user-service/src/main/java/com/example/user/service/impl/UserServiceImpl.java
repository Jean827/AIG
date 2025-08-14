package com.example.user.service.impl;

import com.example.user.model.Role;
import com.example.user.model.User;
import com.example.user.repository.RoleRepository;
import com.example.user.repository.UserRepository;
import com.example.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public User createUser(User user) {
        // 验证用户名和邮箱是否已存在
        Assert.isTrue(!userRepository.existsByUsername(user.getUsername()), "用户名已存在");
        Assert.isTrue(!userRepository.existsByEmail(user.getEmail()), "邮箱已存在");

        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 设置创建和更新时间
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        // 默认启用用户
        if (user.getStatus() == null) {
            user.setStatus(1);
        }

        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        // 验证用户是否存在
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + id));

        // 如果修改了用户名，验证新用户名是否已存在
        if (!existingUser.getUsername().equals(user.getUsername())) {
            Assert.isTrue(!userRepository.existsByUsername(user.getUsername()), "用户名已存在");
            existingUser.setUsername(user.getUsername());
        }

        // 如果修改了邮箱，验证新邮箱是否已存在
        if (!existingUser.getEmail().equals(user.getEmail())) {
            Assert.isTrue(!userRepository.existsByEmail(user.getEmail()), "邮箱已存在");
            existingUser.setEmail(user.getEmail());
        }

        // 更新其他用户信息
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        existingUser.setPhone(user.getPhone());
        existingUser.setStatus(user.getStatus());
        existingUser.setTenantId(user.getTenantId());
        existingUser.setUpdatedAt(new Date());

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        // 验证用户是否存在
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("用户不存在，ID: " + id);
        }

        userRepository.deleteById(id);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getUsersByTenantId(Long tenantId) {
        return (List<User>) userRepository.findByTenantId(tenantId);
    }

    @Override
    public User changeUserStatus(Long id, Integer status) {
        // 验证用户是否存在
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + id));

        // 验证状态值是否有效
        Assert.isTrue(status == 0 || status == 1, "状态值无效，必须是0或1");

        // 更新状态
        user.setStatus(status);
        user.setUpdatedAt(new Date());

        return userRepository.save(user);
    }

    @Override
    public Optional<User> authenticate(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }

        return Optional.empty();
    }

    @Override
    public User addRoleToUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("角色不存在，ID: " + roleId));

        user.getRoles().add(role);
        return userRepository.save(user);
    }

    @Override
    public User removeRoleFromUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("角色不存在，ID: " + roleId));

        user.getRoles().remove(role);
        return userRepository.save(user);
    }

    @Override
    public Set<Role> getUserRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + userId));
        return user.getRoles();
    }

    @Override
    public Role createRole(Role role) {
        Assert.isTrue(!roleRepository.existsByName(role.getName()), "角色名称已存在");
        role.setCreatedAt(new Date());
        role.setUpdatedAt(new Date());
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Long id, Role role) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("角色不存在，ID: " + id));

        if (!existingRole.getName().equals(role.getName())) {
            Assert.isTrue(!roleRepository.existsByName(role.getName()), "角色名称已存在");
            existingRole.setName(role.getName());
        }

        existingRole.setDescription(role.getDescription());
        existingRole.setPermissions(role.getPermissions());
        existingRole.setUpdatedAt(new Date());

        return roleRepository.save(existingRole);
    }

    @Override
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("角色不存在，ID: " + id);
        }
        roleRepository.deleteById(id);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }
}