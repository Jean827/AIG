package com.example.order.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 订单历史记录实体类
 */
@Data
@Entity
@Table(name = "order_history")
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_no", nullable = false)
    private String orderNo;

    @Column(name = "from_status", nullable = false)
    private Integer fromStatus;

    @Column(name = "to_status", nullable = false)
    private Integer toStatus;

    @Column(name = "operator")
    private String operator;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "remark")
    private String remark;
}