package com.example.order.controller;

import com.example.order.model.Order;
import com.example.order.service.OrderWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 订单工作流控制器
 */
@RestController
@RequestMapping("/api/order/workflow")
public class OrderWorkflowController {

    private final OrderWorkflowService orderWorkflowService;

    @Autowired
    public OrderWorkflowController(OrderWorkflowService orderWorkflowService) {
        this.orderWorkflowService = orderWorkflowService;
    }

    /**
     * 流转订单状态
     * @param orderNo 订单编号
     * @param targetStatus 目标状态
     * @return 流转后的订单
     */
    @PostMapping("/transition/{orderNo}/{targetStatus}")
    public ResponseEntity<Order> transitionOrderStatus(
            @PathVariable String orderNo,
            @PathVariable Integer targetStatus) {
        try {
            Order updatedOrder = orderWorkflowService.transitionOrderStatus(orderNo, targetStatus);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 验证订单状态流转是否合法
     * @param currentStatus 当前状态
     * @param targetStatus 目标状态
     * @return 是否合法
     */
    @GetMapping("/validate/{currentStatus}/{targetStatus}")
    public ResponseEntity<Boolean> validateStatusTransition(
            @PathVariable Integer currentStatus,
            @PathVariable Integer targetStatus) {
        boolean isValid = orderWorkflowService.validateStatusTransition(currentStatus, targetStatus);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }

    /**
     * 获取订单状态流转历史
     * @param orderNo 订单编号
     * @return 状态流转历史
     */
    @GetMapping("/history/{orderNo}")
    public ResponseEntity<String> getOrderStatusHistory(@PathVariable String orderNo) {
        try {
            String history = orderWorkflowService.getOrderStatusHistory(orderNo);
            return new ResponseEntity<>(history, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 手动处理超时订单（测试用）
     * @return 处理结果
     */
    @PostMapping("/process-timeout")
    public ResponseEntity<String> processTimeoutOrders() {
        orderWorkflowService.processTimeoutOrders();
        return new ResponseEntity<>("超时订单处理完成", HttpStatus.OK);
    }
}