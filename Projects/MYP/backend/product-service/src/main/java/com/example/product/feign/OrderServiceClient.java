package com.example.product.feign;

import com.example.product.model.Order;import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * 订单服务Feign客户端
 */
@FeignClient(name = "order-service")
public interface OrderServiceClient {

    /**
     * 根据产品ID查询订单
     * @param productId 产品ID
     * @return 订单列表
     */
    @GetMapping("/api/orders/product/{productId}")
    List<Order> getOrdersByProductId(@PathVariable("productId") Long productId);

    /**
     * 根据订单ID查询订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    @GetMapping("/api/orders/{orderId}")
    Order getOrderById(@PathVariable("orderId") Long orderId);

    /**
     * 根据租户ID查询订单
     * @param tenantId 租户ID
     * @return 订单列表
     */
    @GetMapping("/api/orders/tenant/{tenantId}")
    List<Order> getOrdersByTenantId(@PathVariable("tenantId") Long tenantId);
}