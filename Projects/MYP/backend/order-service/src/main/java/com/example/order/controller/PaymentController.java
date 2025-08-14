package com.example.order.controller;

import com.example.order.model.Order;
import com.example.order.service.OrderService;
import com.example.order.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 支付控制器
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    @Autowired
    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    /**
     * 创建支付订单
     * @param orderNo 订单编号
     * @return 支付信息
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(@RequestParam String orderNo) {
        // 根据订单编号查询订单
        Order order = orderService.getOrderByOrderNo(orderNo);
        if (order == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // 创建支付订单
        String paymentNo = paymentService.createPayment(order);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("orderNo", orderNo);
        result.put("paymentNo", paymentNo);
        result.put("amount", order.getTotalAmount());
        result.put("status", "PENDING");

        return ResponseEntity.ok(result);
    }

    /**
     * 处理支付结果回调
     * @param orderNo 订单编号
     * @param paymentNo 支付订单号
     * @param status 支付状态（1-支付成功，2-支付失败）
     * @return 处理结果
     */
    @PostMapping("/callback")
    public ResponseEntity<Map<String, Object>> handlePaymentCallback(
            @RequestParam String orderNo,
            @RequestParam String paymentNo,
            @RequestParam Integer status) {

        // 处理支付结果
        boolean success = paymentService.handlePaymentResult(orderNo, paymentNo, status);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("orderNo", orderNo);
        result.put("paymentNo", paymentNo);
        result.put("status", status == 1 ? "SUCCESS" : "FAILED");

        return ResponseEntity.ok(result);
    }

    /**
     * 查询支付状态
     * @param orderNo 订单编号
     * @return 支付状态
     */
    @GetMapping("/{orderNo}")
    public ResponseEntity<Map<String, Object>> queryPaymentStatus(@PathVariable String orderNo) {
        // 查询支付状态
        Integer status = paymentService.queryPaymentStatus(orderNo);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("orderNo", orderNo);
        result.put("statusCode", status);
        result.put("status", status == 0 ? "PENDING" : (status == 1 ? "SUCCESS" : "FAILED"));

        return ResponseEntity.ok(result);
    }

    /**
     * 取消支付
     * @param orderNo 订单编号
     * @return 取消结果
     */
    @PostMapping("/{orderNo}/cancel")
    public ResponseEntity<Map<String, Object>> cancelPayment(@PathVariable String orderNo) {
        // 取消支付
        boolean success = paymentService.cancelPayment(orderNo);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("orderNo", orderNo);
        result.put("status", success ? "CANCELLED" : "FAILED");

        return ResponseEntity.ok(result);
    }
}