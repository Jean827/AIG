package com.example.order.repository;

import com.example.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 订单数据访问接口
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * 根据产品ID查询订单
     * @param productId 产品ID
     * @return 订单列表
     */
    List<Order> findByProductId(Long productId);

    /**
     * 根据租户ID查询订单
     * @param tenantId 租户ID
     * @return 订单列表
     */
    List<Order> findByTenantId(Long tenantId);

    /**
     * 根据订单编号查询订单
     * @param orderNo 订单编号
     * @return 订单
     */
    Order findByOrderNo(String orderNo);

    /**
     * 根据状态和租户ID查询订单
     * @param status 订单状态
     * @param tenantId 租户ID
     * @return 订单列表
     */
    List<Order> findByStatusAndTenantId(Integer status, Long tenantId);
}