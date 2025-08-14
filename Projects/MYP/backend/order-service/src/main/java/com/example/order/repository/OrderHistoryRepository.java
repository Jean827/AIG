package com.example.order.repository;

import com.example.order.model.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 订单历史记录数据访问接口
 */
@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {

    /**
     * 根据订单编号查询历史记录
     * @param orderNo 订单编号
     * @return 历史记录列表
     */
    List<OrderHistory> findByOrderNo(String orderNo);

    /**
     * 根据租户ID和订单编号查询历史记录
     * @param tenantId 租户ID
     * @param orderNo 订单编号
     * @return 历史记录列表
     */
    List<OrderHistory> findByTenantIdAndOrderNo(Long tenantId, String orderNo);

    /**
     * 根据订单编号和状态查询历史记录
     * @param orderNo 订单编号
     * @param toStatus 目标状态
     * @return 历史记录列表
     */
    List<OrderHistory> findByOrderNoAndToStatus(String orderNo, Integer toStatus);
}