package com.example.order.service;

import com.example.order.model.Order;

/**
 * 订单工作流服务接口
 */
public interface OrderWorkflowService {

    /**
     * 流转订单状态
     * @param orderNo 订单编号
     * @param targetStatus 目标状态
     * @return 流转后的订单
     */
    Order transitionOrderStatus(String orderNo, Integer targetStatus);

    /**
     * 验证订单状态流转是否合法
     * @param currentStatus 当前状态
     * @param targetStatus 目标状态
     * @return 是否合法
     */
    boolean validateStatusTransition(Integer currentStatus, Integer targetStatus);

    /**
     * 获取订单状态流转历史
     * @param orderNo 订单编号
     * @return 状态流转历史
     */
    String getOrderStatusHistory(String orderNo);

    /**
     * 自动处理超时订单
     */
    void processTimeoutOrders();
}