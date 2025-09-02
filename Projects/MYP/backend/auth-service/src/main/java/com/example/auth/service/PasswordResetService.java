package com.example.auth.service;

/**
 * 密码重置服务接口
 */
public interface PasswordResetService {

    /**
     * 发送密码重置邮件
     * 
     * @param email 用户邮箱
     */
    void requestPasswordReset(String email);
    
    /**
     * 验证密码重置令牌
     * 
     * @param token 重置令牌
     * @return 验证是否成功
     */
    boolean validatePasswordResetToken(String token);
    
    /**
     * 使用令牌重置密码
     * 
     * @param token 重置令牌
     * @param newPassword 新密码
     * @return 重置是否成功
     */
    boolean resetPassword(String token, String newPassword);
}