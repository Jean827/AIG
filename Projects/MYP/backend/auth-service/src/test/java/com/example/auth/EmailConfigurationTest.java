package com.example.auth;

import org.junit.jupiter.api.Test;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

public class EmailConfigurationTest {

    @Test
    public void testEmailConfiguration() throws MessagingException, IOException {
        System.out.println("开始邮件服务器配置测试...");
        
        // 硬编码的邮件配置参数（不加密，端口25）
        String mailHost = "smtp.muyacorp.com";
        int mailPort = 25;
        String mailUsername = "system@muyacorp.com";
        String mailPassword = "OGajbH1OhoteFiR8";
        
        // 邮件配置
        Properties props = new Properties();
        props.put("mail.smtp.host", mailHost);
        props.put("mail.smtp.port", mailPort);
        props.put("mail.smtp.auth", "true");
        props.put("mail.debug", "true");
        
        // 创建会话
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailUsername, mailPassword);
            }
        });
        
        // 邮件信息
        String toEmail = "Jean.xu@muyacorp.com";
        String subject = "邮件服务器配置测试 - 不加密端口25";
        String content = "这是一封测试邮件，用于验证邮件服务器配置是否正确。\n\n如果您收到此邮件，说明配置已成功！\n\n系统管理员";
        
        // 创建邮件消息
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(mailUsername));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject(subject);
        message.setText(content);
        
        // 调试信息
        System.out.println("尝试发送邮件到: " + toEmail);
        System.out.println("使用SMTP服务器: " + mailHost + ":" + mailPort + " (不加密)");
        System.out.println("使用账号: " + mailUsername);
        
        // 发送邮件
        Transport.send(message);
        
        // 记录发送成功信息到文件
        String logMessage = "测试邮件已成功发送到: " + toEmail + " 时间: " + java.time.LocalDateTime.now();
        Files.write(Path.of("email_test.log"), logMessage.getBytes());
        
        System.out.println(logMessage);
        System.out.println("邮件配置测试完成！");
    }
    

}