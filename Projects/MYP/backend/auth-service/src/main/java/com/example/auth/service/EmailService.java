package com.example.auth.service;

/**
 * 邮件服务接口
 */
public interface EmailService {
    
    /**
     * 发送简单文本邮件
     * 
     * @param to 收件人邮箱
     * @param subject 邮件主题
     * @param text 邮件内容
     */
    void sendSimpleEmail(String to, String subject, String text);
}