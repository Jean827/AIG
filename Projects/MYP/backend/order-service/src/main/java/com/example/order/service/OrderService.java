package com.example.order.service;

import com.example.order.model.Order;
import java.util.List;
import java.util.Optional;

/**
 * 订单服务接口
 */
public interface OrderService {

    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建的订单
     */
    Order createOrder(Order order);

    /**
     * 更新订单
     * @param id 订单ID
     * @param order 订单信息
     * @return 更新后的订单
     */
    Order updateOrder(Long id, Order order);

    /**
     * 删除订单
     * @param id 订单ID
     */
    void deleteOrder(Long id);

    /**
     * 根据ID查询订单
     * @param id 订单ID
     * @return 订单详情
     */
    Optional<Order> getOrderById(Long id);

    /**
     * 查询所有订单
     * @return 订单列表
     */
    List<Order> getAllOrders();

    /**
     * 根据产品ID查询订单
     * @param productId 产品ID
     * @return 订单列表
     */
    List<Order> getOrdersByProductId(Long productId);

    /**
     * 根据租户ID查询订单
     * @param tenantId 租户ID
     * @return 订单列表
     */
    List<Order> getOrdersByTenantId(Long tenantId);

    /**
     * 根据订单编号查询订单
     * @param orderNo 订单编号
     * @return 订单详情
     */
    Order getOrderByOrderNo(String orderNo);

    /**
     * 更新订单状态
     * @param id 订单ID
     * @param status 订单状态
     * @return 更新后的订单
     */
    Order updateOrderStatus(Long id, Integer status);
    
    /**
     * 根据产品ID获取订单数量
     * @param productId 产品ID
     * @return 订单数量
     */
    Long getOrderCountByProductId(Long productId);
}