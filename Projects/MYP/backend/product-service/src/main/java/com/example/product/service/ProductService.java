package com.example.product.service;

import com.example.product.model.Product;
import com.example.product.model.Order;

import java.util.List;
import java.util.Optional;

/**
 * 产品服务接口
 */
public interface ProductService {
    /**
     * 创建产品
     * @param product 产品实体
     * @return 创建后的产品
     */
    Product createProduct(Product product);

    /**
     * 更新产品
     * @param id 产品ID
     * @param product 产品实体
     * @return 更新后的产品
     */
    Product updateProduct(Long id, Product product);

    /**
     * 删除产品
     * @param id 产品ID
     */
    void deleteProduct(Long id);

    /**
     * 根据ID查询产品
     * @param id 产品ID
     * @return 产品实体
     */
    Optional<Product> getProductById(Long id);

    /**
     * 查询所有产品
     * @return 产品列表
     */
    List<Product> getAllProducts();

    /**
     * 根据租户ID查询产品
     * @param tenantId 租户ID
     * @return 产品列表
     */
    List<Product> getProductsByTenantId(Long tenantId);

    /**
     * 根据分类ID查询产品
     * @param categoryId 分类ID
     * @return 产品列表
     */
    List<Product> getProductsByCategoryId(Long categoryId);

    /**
     * 更改产品状态
     * @param id 产品ID
     * @param status 状态(0:禁用, 1:启用)
     * @return 更新后的产品
     */
    Product changeProductStatus(Long id, Integer status);

    /**
     * 根据产品ID查询订单
     * @param productId 产品ID
     * @return 订单列表
     */
    List<Order> getOrdersByProductId(Long productId);
}