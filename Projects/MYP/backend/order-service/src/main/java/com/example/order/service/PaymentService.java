package com.example.order.service;

import com.example.order.model.Order;

/**
 * 支付服务接口
 */
public interface PaymentService {

    /**
     * 创建支付订单
     * @param order 订单信息
     * @return 支付订单号
     */
    String createPayment(Order order);

    /**
     * 处理支付结果
     * @param orderNo 订单编号
     * @param paymentNo 支付订单号
     * @param status 支付状态（0-待支付，1-支付成功，2-支付失败）
     * @return 处理结果
     */
    boolean handlePaymentResult(String orderNo, String paymentNo, Integer status);

    /**
     * 查询支付状态
     * @param orderNo 订单编号
     * @return 支付状态（0-待支付，1-支付成功，2-支付失败）
     */
    Integer queryPaymentStatus(String orderNo);

    /**
     * 取消支付
     * @param orderNo 订单编号
     * @return 取消结果
     */
    boolean cancelPayment(String orderNo);
}