package com.example.order.service.impl;

import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import com.example.order.service.OrderService;
import com.example.order.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 支付服务实现类
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    // 模拟支付系统，存储订单编号与支付信息的映射
    private final Map<String, PaymentInfo> paymentStore = new HashMap<>();

    @Value("${order.payment.timeout:300}")
    private Integer paymentTimeout;

    @Autowired
    public PaymentServiceImpl(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @Override
    public String createPayment(Order order) {
        // 验证订单信息
        if (order == null) {
            throw new RuntimeException("订单信息不能为空");
        }

        if (order.getOrderNo() == null || order.getOrderNo().isEmpty()) {
            throw new RuntimeException("订单编号不能为空");
        }

        // 检查订单是否存在
        Order existingOrder = orderRepository.findByOrderNo(order.getOrderNo());
        if (existingOrder == null) {
            throw new RuntimeException("订单不存在，订单编号: " + order.getOrderNo());
        }

        // 检查订单状态是否可支付
        if (existingOrder.getStatus() != 0) {
            throw new RuntimeException("订单状态不支持支付，当前状态: " + existingOrder.getStatus());
        }

        // 生成支付订单号
        String paymentNo = "PAY" + LocalDateTime.now().toString().replaceAll("\\D", "") + UUID.randomUUID().toString().substring(0, 8);

        // 存储支付信息
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setPaymentNo(paymentNo);
        paymentInfo.setOrderNo(order.getOrderNo());
        paymentInfo.setAmount(order.getTotalAmount());
        paymentInfo.setStatus(0); // 0-待支付
        paymentInfo.setCreateTime(LocalDateTime.now());
        paymentInfo.setExpireTime(LocalDateTime.now().plusSeconds(paymentTimeout));

        paymentStore.put(order.getOrderNo(), paymentInfo);

        // 模拟调用支付网关
        System.out.println("调用支付网关，创建支付订单: " + paymentNo);
        System.out.println("订单金额: " + order.getTotalAmount());

        return paymentNo;
    }

    @Override
    public boolean handlePaymentResult(String orderNo, String paymentNo, Integer status) {
        // 验证参数
        if (orderNo == null || orderNo.isEmpty()) {
            throw new RuntimeException("订单编号不能为空");
        }

        if (paymentNo == null || paymentNo.isEmpty()) {
            throw new RuntimeException("支付订单号不能为空");
        }

        if (status == null || (status != 1 && status != 2)) {
            throw new RuntimeException("支付状态无效，必须是1(支付成功)或2(支付失败)");
        }

        // 检查支付信息是否存在
        PaymentInfo paymentInfo = paymentStore.get(orderNo);
        if (paymentInfo == null) {
            throw new RuntimeException("支付信息不存在，订单编号: " + orderNo);
        }

        // 检查支付订单号是否匹配
        if (!paymentInfo.getPaymentNo().equals(paymentNo)) {
            throw new RuntimeException("支付订单号不匹配");
        }

        // 检查支付是否已过期
        if (LocalDateTime.now().isAfter(paymentInfo.getExpireTime())) {
            paymentInfo.setStatus(2); // 支付过期，标记为失败
            throw new RuntimeException("支付已过期");
        }

        // 更新支付状态
        paymentInfo.setStatus(status);
        paymentInfo.setUpdateTime(LocalDateTime.now());

        // 更新订单状态
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order != null) {
            if (status == 1) { // 支付成功
                order.setStatus(1); // 订单状态更新为已支付
            } else if (status == 2) { // 支付失败
                order.setStatus(4); // 订单状态更新为已取消
            }
            order.setUpdatedTime(LocalDateTime.now());
            orderRepository.save(order);
        }

        return true;
    }

    @Override
    public Integer queryPaymentStatus(String orderNo) {
        // 验证参数
        if (orderNo == null || orderNo.isEmpty()) {
            throw new RuntimeException("订单编号不能为空");
        }

        // 检查支付信息是否存在
        PaymentInfo paymentInfo = paymentStore.get(orderNo);
        if (paymentInfo == null) {
            throw new RuntimeException("支付信息不存在，订单编号: " + orderNo);
        }

        // 检查支付是否已过期
        if (LocalDateTime.now().isAfter(paymentInfo.getExpireTime()) && paymentInfo.getStatus() == 0) {
            paymentInfo.setStatus(2); // 支付过期，标记为失败
            // 更新订单状态为已取消
            Order order = orderRepository.findByOrderNo(orderNo);
            if (order != null && order.getStatus() == 0) {
                order.setStatus(4);
                order.setUpdatedTime(LocalDateTime.now());
                orderRepository.save(order);
            }
        }

        return paymentInfo.getStatus();
    }

    @Override
    public boolean cancelPayment(String orderNo) {
        // 验证参数
        if (orderNo == null || orderNo.isEmpty()) {
            throw new RuntimeException("订单编号不能为空");
        }

        // 检查支付信息是否存在
        PaymentInfo paymentInfo = paymentStore.get(orderNo);
        if (paymentInfo == null) {
            throw new RuntimeException("支付信息不存在，订单编号: " + orderNo);
        }

        // 检查支付状态是否可取消
        if (paymentInfo.getStatus() != 0) {
            throw new RuntimeException("支付状态不支持取消，当前状态: " + paymentInfo.getStatus());
        }

        // 更新支付状态为取消
        paymentInfo.setStatus(2); // 标记为支付失败
        paymentInfo.setUpdateTime(LocalDateTime.now());

        // 更新订单状态为已取消
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order != null && order.getStatus() == 0) {
            order.setStatus(4);
            order.setUpdatedTime(LocalDateTime.now());
            orderRepository.save(order);
        }

        return true;
    }

    /**
     * 支付信息内部类
     */
    private static class PaymentInfo {
        private String paymentNo;
        private String orderNo;
        private java.math.BigDecimal amount;
        private Integer status;
        private LocalDateTime createTime;
        private LocalDateTime updateTime;
        private LocalDateTime expireTime;

        // getter and setter methods
        public String getPaymentNo() {
            return paymentNo;
        }

        public void setPaymentNo(String paymentNo) {
            this.paymentNo = paymentNo;
        }

        public String getOrderNo() {
            return orderNo;
        }

        public void setOrderNo(String orderNo) {
            this.orderNo = orderNo;
        }

        public java.math.BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(java.math.BigDecimal amount) {
            this.amount = amount;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }

        public LocalDateTime getCreateTime() {
            return createTime;
        }

        public void setCreateTime(LocalDateTime createTime) {
            this.createTime = createTime;
        }

        public LocalDateTime getUpdateTime() {
            return updateTime;
        }

        public void setUpdateTime(LocalDateTime updateTime) {
            this.updateTime = updateTime;
        }

        public LocalDateTime getExpireTime() {
            return expireTime;
        }

        public void setExpireTime(LocalDateTime expireTime) {
            this.expireTime = expireTime;
        }
    }
}