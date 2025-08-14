package com.example.product.repository;

import com.example.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 产品数据访问层接口
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    /**
     * 根据租户ID查询产品列表
     * @param tenantId 租户ID
     * @return 产品列表
     */
    List<Product> findByTenantId(Long tenantId);

    /**
     * 根据分类ID查询产品列表
     * @param categoryId 分类ID
     * @return 产品列表
     */
    List<Product> findByCategoryId(Long categoryId);

    /**
     * 根据状态查询产品列表
     * @param status 状态(0:禁用, 1:启用)
     * @return 产品列表
     */
    List<Product> findByStatus(Integer status);

    /**
     * 根据租户ID和状态查询产品列表
     * @param tenantId 租户ID
     * @param status 状态(0:禁用, 1:启用)
     * @return 产品列表
     */
    List<Product> findByTenantIdAndStatus(Long tenantId, Integer status);
}