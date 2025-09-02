package com.example.auth.util;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import javax.net.ssl.*;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.Properties;

/**
 * 独立的邮件测试工具类
 * 不依赖Spring框架，直接使用Java Mail API进行邮件发送测试
 */
public class EmailTester {
    
    public static void main(String[] args) {
        System.out.println("开始独立邮件发送测试...");
        
        // 邮件配置参数
        String mailHost = "smtp.muyacorp.com";
        int mailPort = 25;
        String mailUsername = "system@muyacorp.com";
        String mailPassword = "OGajbH1OhoteFiR8";
        String toEmail = "Jean.xu@muyacorp.com";
        
        try {
            // 创建Properties对象
            Properties props = new Properties();
            props.put("mail.smtp.host", mailHost);
            props.put("mail.smtp.port", mailPort);
            props.put("mail.smtp.auth", "true");
            props.put("mail.debug", "true");
            
            // 创建Session对象
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(mailUsername, mailPassword);
                }
            });
            
            // 创建邮件消息
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(mailUsername));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("邮件服务器配置测试 - 独立测试工具");
            message.setText("这是一封使用独立测试工具发送的测试邮件。\n\n如果您收到此邮件，说明配置已成功！\n\n系统管理员");
            
            // 显示调试信息
            System.out.println("尝试发送邮件到: " + toEmail);
            System.out.println("使用SMTP服务器: " + mailHost + ":" + mailPort + " (SSL)");
            System.out.println("使用账号: " + mailUsername);
            
            // 发送邮件
            Transport.send(message);
            
            System.out.println("邮件发送成功！时间: " + java.time.LocalDateTime.now());
            
        } catch (MessagingException e) {
            System.err.println("邮件发送失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
    

}