package com.example.order.service.impl;

import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import com.example.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order createOrder(Order order) {
        // 验证订单信息
        validateOrder(order);

        // 生成订单编号
        String orderNo = generateOrderNo();
        order.setOrderNo(orderNo);

        // 设置创建时间
        order.setCreatedTime(LocalDateTime.now());

        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        // 检查订单是否存在
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在，ID: " + id));

        // 更新订单信息
        existingOrder.setProductId(order.getProductId());
        existingOrder.setQuantity(order.getQuantity());
        existingOrder.setTotalAmount(order.getTotalAmount());
        existingOrder.setStatus(order.getStatus());
        existingOrder.setUpdatedTime(LocalDateTime.now());

        // 验证更新后的订单信息
        validateOrder(existingOrder);

        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        // 检查订单是否存在
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("订单不存在，ID: " + id);
        }
        orderRepository.deleteById(id);
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByProductId(Long productId) {
        return orderRepository.findByProductId(productId);
    }

    @Override
    public List<Order> getOrdersByTenantId(Long tenantId) {
        return orderRepository.findByTenantId(tenantId);
    }

    @Override
    public Order getOrderByOrderNo(String orderNo) {
        return orderRepository.findByOrderNo(orderNo);
    }

    @Override
    public Order updateOrderStatus(Long id, Integer status) {
        // 检查状态值是否有效
        if (status < 0 || status > 4) {
            throw new RuntimeException("状态值无效，必须是0-4之间的整数");
        }

        // 检查订单是否存在
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在，ID: " + id));

        // 更新状态
        order.setStatus(status);
        order.setUpdatedTime(LocalDateTime.now());

        return orderRepository.save(order);
    }

    /**
     * 生成订单编号
     * @return 订单编号
     */
    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().toString().replaceAll("\\D", "") + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * 验证订单信息
     */
    private void validateOrder(Order order) {
        if (order.getProductId() == null) {
            throw new RuntimeException("产品ID不能为空");
        }

        if (order.getQuantity() == null || order.getQuantity() <= 0) {
            throw new RuntimeException("数量必须大于0");
        }

        if (order.getTotalAmount() == null) {
            throw new RuntimeException("总金额不能为空");
        }

        if (order.getStatus() == null || order.getStatus() < 0 || order.getStatus() > 4) {
            throw new RuntimeException("状态值无效，必须是0-4之间的整数");
        }

        if (order.getTenantId() == null) {
            throw new RuntimeException("租户ID不能为空");
        }

        if (order.getCreatedBy() == null) {
            throw new RuntimeException("创建人ID不能为空");
        }
    }
}