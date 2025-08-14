package com.example.order.service.impl;

import com.example.order.model.Order;
import com.example.order.model.OrderHistory;
import com.example.order.repository.OrderHistoryRepository;
import com.example.order.repository.OrderRepository;
import com.example.order.service.OrderService;
import com.example.order.service.OrderWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 订单工作流服务实现类
 */
@Service
public class OrderWorkflowServiceImpl implements OrderWorkflowService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final OrderHistoryRepository orderHistoryRepository;

    // 订单状态流转规则：当前状态 -> 允许的目标状态
    private final Map<Integer, Set<Integer>> statusTransitionRules = new HashMap<>();

    // 订单状态描述
    private final Map<Integer, String> statusDescriptions = new HashMap<>();

    @Autowired
    public OrderWorkflowServiceImpl(OrderRepository orderRepository, OrderService orderService, OrderHistoryRepository orderHistoryRepository) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.orderHistoryRepository = orderHistoryRepository;

        // 初始化状态流转规则
        initStatusTransitionRules();

        // 初始化状态描述
        initStatusDescriptions();
    }

    /**
     * 初始化状态流转规则
     */
    private void initStatusTransitionRules() {
        // 0-待支付
        Set<Integer> pendingTransitions = new HashSet<>();
        pendingTransitions.add(1); // 待支付 -> 已支付
        pendingTransitions.add(4); // 待支付 -> 已取消
        statusTransitionRules.put(0, pendingTransitions);

        // 1-已支付
        Set<Integer> paidTransitions = new HashSet<>();
        paidTransitions.add(2); // 已支付 -> 已发货
        paidTransitions.add(4); // 已支付 -> 已取消
        statusTransitionRules.put(1, paidTransitions);

        // 2-已发货
        Set<Integer> shippedTransitions = new HashSet<>();
        shippedTransitions.add(3); // 已发货 -> 已完成
        statusTransitionRules.put(2, shippedTransitions);

        // 3-已完成
        Set<Integer> completedTransitions = new HashSet<>();
        // 已完成状态不能再流转
        statusTransitionRules.put(3, completedTransitions);

        // 4-已取消
        Set<Integer> cancelledTransitions = new HashSet<>();
        // 已取消状态不能再流转
        statusTransitionRules.put(4, cancelledTransitions);
    }

    /**
     * 初始化状态描述
     */
    private void initStatusDescriptions() {
        statusDescriptions.put(0, "待支付");
        statusDescriptions.put(1, "已支付");
        statusDescriptions.put(2, "已发货");
        statusDescriptions.put(3, "已完成");
        statusDescriptions.put(4, "已取消");
    }

    @Override
    public Order transitionOrderStatus(String orderNo, Integer targetStatus) {
        // 验证参数
        if (orderNo == null || orderNo.isEmpty()) {
            throw new RuntimeException("订单编号不能为空");
        }

        if (targetStatus == null || targetStatus < 0 || targetStatus > 4) {
            throw new RuntimeException("目标状态无效，必须是0-4之间的整数");
        }

        // 查询订单
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在，订单编号: " + orderNo);
        }

        // 获取当前状态
        Integer currentStatus = order.getStatus();

        // 验证状态流转是否合法
        if (!validateStatusTransition(currentStatus, targetStatus)) {
            throw new RuntimeException("状态流转不合法，当前状态: " + statusDescriptions.get(currentStatus) + ", 目标状态: " + statusDescriptions.get(targetStatus));
        }

        // 更新订单状态
        order.setStatus(targetStatus);
        order.setUpdatedTime(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);

        // 记录状态流转历史
        recordStatusHistory(orderNo, currentStatus, targetStatus);

        return updatedOrder;
    }

    @Override
    public boolean validateStatusTransition(Integer currentStatus, Integer targetStatus) {
        // 验证参数
        if (currentStatus == null || targetStatus == null) {
            return false;
        }

        // 状态相同，无需流转
        if (currentStatus.equals(targetStatus)) {
            return true;
        }

        // 检查是否存在流转规则
        Set<Integer> allowedTransitions = statusTransitionRules.get(currentStatus);
        if (allowedTransitions == null) {
            return false;
        }

        // 检查目标状态是否在允许的流转范围内
        return allowedTransitions.contains(targetStatus);
    }

    @Override
    public String getOrderStatusHistory(String orderNo) {
        // 验证参数
        if (orderNo == null || orderNo.isEmpty()) {
            throw new RuntimeException("订单编号不能为空");
        }

        // 查询订单以获取租户ID
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在，订单编号: " + orderNo);
        }

        // 获取状态流转历史
        List<OrderHistory> historyList = orderHistoryRepository.findByTenantIdAndOrderNo(order.getTenantId(), orderNo);

        // 构建历史描述
        StringBuilder historyBuilder = new StringBuilder();
        for (OrderHistory history : historyList) {
            historyBuilder.append(history.getTimestamp())
                    .append(" - ")
                    .append(statusDescriptions.get(history.getFromStatus()))
                    .append(" -> ")
                    .append(statusDescriptions.get(history.getToStatus()))
                    .append(" (操作人: ")
                    .append(history.getOperator())
                    .append(")\n");
        }

        return historyBuilder.toString();
    }

    @Override
    @Scheduled(fixedRate = 60000) // 每分钟执行一次
    public void processTimeoutOrders() {
        // 查询所有待支付订单
        List<Order> pendingOrders = orderRepository.findByStatusAndTenantId(0, 0L); // 假设0是系统租户ID

        // 当前时间
        LocalDateTime now = LocalDateTime.now();

        // 处理超时订单
        for (Order order : pendingOrders) {
            // 假设订单创建30分钟后超时
            if (order.getCreatedTime().plusMinutes(30).isBefore(now)) {
                // 流转订单状态为已取消
                transitionOrderStatus(order.getOrderNo(), 4);
                System.out.println("订单超时取消，订单编号: " + order.getOrderNo());
            }
        }
    }

    /**
     * 记录状态流转历史
     */
    private void recordStatusHistory(String orderNo, Integer fromStatus, Integer toStatus) {
        // 查询订单以获取租户ID
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("订单不存在，订单编号: " + orderNo);
        }

        // 创建历史记录
        OrderHistory history = new OrderHistory();
        history.setOrderNo(orderNo);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setOperator("system"); // 默认为系统操作
        history.setTimestamp(LocalDateTime.now());
        history.setTenantId(order.getTenantId());
        history.setRemark("状态从" + statusDescriptions.get(fromStatus) + "流转到" + statusDescriptions.get(toStatus));

        // 保存到数据库
        orderHistoryRepository.save(history);
    }
}