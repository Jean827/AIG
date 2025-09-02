package com.example.auth;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailTest {

    public static void main(String[] args) {
        // 邮件服务器配置
        final String username = "system@muyacorp.com";
        final String password = "My1qazxsw2";
        String toEmail = "Jean.xu@muyacorp.com";

        // 设置邮件属性
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.muyacorp.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.muyacorp.com"); // 信任服务器
        props.put("mail.debug", "true"); // 启用调试日志

        // 创建会话
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // 创建邮件消息
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("邮件服务器配置测试");
            message.setText("这是一封测试邮件，用于验证邮件服务器配置是否正确。\n\n如果您收到此邮件，说明配置已成功！\n\n系统管理员");

            // 发送邮件
            Transport.send(message);

            System.out.println("邮件已成功发送到: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("发送邮件失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}