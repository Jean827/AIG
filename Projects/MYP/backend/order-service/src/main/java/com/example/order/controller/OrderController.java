package com.example.order.controller;

import com.example.order.model.Order;
import com.example.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建的订单
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    /**
     * 获取订单详情
     * @param id 订单ID
     * @return 订单详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * 更新订单
     * @param id 订单ID
     * @param order 订单信息
     * @return 更新后的订单
     */
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * 删除订单
     * @param id 订单ID
     * @return 响应状态
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * 获取所有订单
     * @return 订单列表
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * 根据产品ID查询订单
     * @param productId 产品ID
     * @return 订单列表
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Order>> getOrdersByProductId(@PathVariable Long productId) {
        List<Order> orders = orderService.getOrdersByProductId(productId);
        return ResponseEntity.ok(orders);
    }

    /**
     * 根据租户ID查询订单
     * @param tenantId 租户ID
     * @return 订单列表
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Order>> getOrdersByTenantId(@PathVariable Long tenantId) {
        List<Order> orders = orderService.getOrdersByTenantId(tenantId);
        return ResponseEntity.ok(orders);
    }

    /**
     * 根据订单编号查询订单
     * @param orderNo 订单编号
     * @return 订单详情
     */
    @GetMapping("/orderNo/{orderNo}")
    public ResponseEntity<Order> getOrderByOrderNo(@PathVariable String orderNo) {
        Order order = orderService.getOrderByOrderNo(orderNo);
        return order != null ? ResponseEntity.ok(order) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * 更新订单状态
     * @param id 订单ID
     * @param status 订单状态
     * @return 更新后的订单
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam Integer status) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 获取指定产品ID的订单数量
     * @param productId 产品ID
     * @return 订单数量
     */
    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> getOrderCountByProductId(@PathVariable Long productId) {
        Long orderCount = orderService.getOrderCountByProductId(productId);
        return ResponseEntity.ok(orderCount);
    }
}