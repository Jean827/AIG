package com.example.order.service.impl;

import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import com.example.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final long orderCacheTtl;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, RedisTemplate<String, Object> redisTemplate, @Value("${order.cache.ttl:3600}") long orderCacheTtl) {
        this.orderRepository = orderRepository;
        this.redisTemplate = redisTemplate;
        this.orderCacheTtl = orderCacheTtl;
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

        Order createdOrder = orderRepository.save(order);

        // 清除相关缓存
        redisTemplate.delete("orders:tenant:" + order.getTenantId());
        redisTemplate.delete("orders:product:" + order.getProductId());

        return createdOrder;
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        // 检查订单是否存在
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在，ID: " + id));

        // 保存旧的产品和租户ID，用于清除缓存
        Long oldProductId = existingOrder.getProductId();
        Long oldTenantId = existingOrder.getTenantId();

        // 更新订单信息
        existingOrder.setProductId(order.getProductId());
        existingOrder.setQuantity(order.getQuantity());
        existingOrder.setTotalAmount(order.getTotalAmount());
        existingOrder.setStatus(order.getStatus());
        existingOrder.setUpdatedTime(LocalDateTime.now());

        // 验证更新后的订单信息
        validateOrder(existingOrder);

        Order updatedOrder = orderRepository.save(existingOrder);

        // 清除相关缓存
        redisTemplate.delete("order:id:" + id);
        redisTemplate.delete("orders:tenant:" + oldTenantId);
        redisTemplate.delete("orders:product:" + oldProductId);
        redisTemplate.delete("order:no:" + existingOrder.getOrderNo());

        // 如果产品或租户ID发生了变化，也清除新的相关缓存
        if (!order.getProductId().equals(oldProductId)) {
            redisTemplate.delete("orders:product:" + order.getProductId());
        }
        if (!order.getTenantId().equals(oldTenantId)) {
            redisTemplate.delete("orders:tenant:" + order.getTenantId());
        }

        return updatedOrder;
    }

    @Override
    public void deleteOrder(Long id) {
        // 检查订单是否存在
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在，ID: " + id));

        // 保存产品和租户ID，用于清除缓存
        Long productId = order.getProductId();
        Long tenantId = order.getTenantId();
        String orderNo = order.getOrderNo();

        orderRepository.deleteById(id);

        // 清除相关缓存
        redisTemplate.delete("order:id:" + id);
        redisTemplate.delete("orders:tenant:" + tenantId);
        redisTemplate.delete("orders:product:" + productId);
        redisTemplate.delete("order:no:" + orderNo);
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        String cacheKey = "order:id:" + id;
        Order order = (Order) redisTemplate.opsForValue().get(cacheKey);
        if (order != null) {
            return Optional.of(order);
        }
        Optional<Order> orderOptional = orderRepository.findById(id);
        orderOptional.ifPresent(o -> redisTemplate.opsForValue().set(cacheKey, o, orderCacheTtl, TimeUnit.SECONDS));
        return orderOptional;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByProductId(Long productId) {
        String cacheKey = "orders:product:" + productId;
        List<Order> orders = (List<Order>) redisTemplate.opsForValue().get(cacheKey);
        if (orders == null) {
            orders = orderRepository.findByProductId(productId);
            redisTemplate.opsForValue().set(cacheKey, orders, orderCacheTtl, TimeUnit.SECONDS);
        }
        return orders;
    }

    @Override
    public List<Order> getOrdersByTenantId(Long tenantId) {
        String cacheKey = "orders:tenant:" + tenantId;
        List<Order> orders = (List<Order>) redisTemplate.opsForValue().get(cacheKey);
        if (orders == null) {
            orders = orderRepository.findByTenantId(tenantId);
            redisTemplate.opsForValue().set(cacheKey, orders, orderCacheTtl, TimeUnit.SECONDS);
        }
        return orders;
    }

    @Override
    public Order getOrderByOrderNo(String orderNo) {
        String cacheKey = "order:no:" + orderNo;
        Order order = (Order) redisTemplate.opsForValue().get(cacheKey);
        if (order != null) {
            return order;
        }
        order = orderRepository.findByOrderNo(orderNo);
        if (order != null) {
            redisTemplate.opsForValue().set(cacheKey, order, orderCacheTtl, TimeUnit.SECONDS);
        }
        return order;
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

        // 保存旧的信息，用于清除缓存
        Long productId = order.getProductId();
        Long tenantId = order.getTenantId();
        String orderNo = order.getOrderNo();

        // 更新状态
        order.setStatus(status);
        order.setUpdatedTime(LocalDateTime.now());

        Order updatedOrder = orderRepository.save(order);

        // 清除相关缓存
        redisTemplate.delete("order:id:" + id);
        redisTemplate.delete("orders:tenant:" + tenantId);
        redisTemplate.delete("orders:product:" + productId);
        redisTemplate.delete("order:no:" + orderNo);

        return updatedOrder;
    }

    /**
     * 生成订单编号
     * @return 订单编号
     */
    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().toString().replaceAll("\\D", "") + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * 根据产品ID获取订单数量
     * @param productId 产品ID
     * @return 订单数量
     */
    @Override
    public Long getOrderCountByProductId(Long productId) {
        String cacheKey = "orders:product:" + productId + ":count";
        Long orderCount = (Long) redisTemplate.opsForValue().get(cacheKey);
        if (orderCount == null) {
            orderCount = orderRepository.countByProductId(productId);
            redisTemplate.opsForValue().set(cacheKey, orderCount, orderCacheTtl, TimeUnit.SECONDS);
        }
        return orderCount;
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