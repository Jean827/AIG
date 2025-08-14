package com.example.product.service.impl;

import com.example.product.model.Product;
import com.example.product.model.Order;
import com.example.product.repository.ProductRepository;
import com.example.product.service.ProductService;
import com.example.product.feign.OrderServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * 产品服务实现类
 */
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final OrderServiceClient orderServiceClient;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, OrderServiceClient orderServiceClient) {
        this.productRepository = productRepository;
        this.orderServiceClient = orderServiceClient;
    }

    @Override
    public Product createProduct(Product product) {
        // 验证产品信息
        validateProduct(product);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        // 检查产品是否存在
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("产品不存在，ID: " + id));

        // 更新产品信息
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setStatus(product.getStatus());
        existingProduct.setCategoryId(product.getCategoryId());
        existingProduct.setTenantId(product.getTenantId());

        // 验证更新后的产品信息
        validateProduct(existingProduct);

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        // 检查产品是否存在
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("产品不存在，ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByTenantId(Long tenantId) {
        return productRepository.findByTenantId(tenantId);
    }

    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public Product changeProductStatus(Long id, Integer status) {
        // 检查状态值是否有效
        if (status != 0 && status != 1) {
            throw new RuntimeException("状态值无效，必须是0或1");
        }

        // 检查产品是否存在
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("产品不存在，ID: " + id));

        // 更新状态
        product.setStatus(status);
        return productRepository.save(product);
    }

    /**
     * 根据产品ID查询订单
     * @param productId 产品ID
     * @return 订单列表
     */
    public List<Order> getOrdersByProductId(Long productId) {
        // 验证产品是否存在
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("产品不存在，ID: " + productId);
        }
        // 调用订单服务查询订单
        return orderServiceClient.getOrdersByProductId(productId);
    }

    /**
     * 验证产品信息
     */
    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new RuntimeException("产品名称不能为空");
        }

        if (product.getName().length() > 100) {
            throw new RuntimeException("产品名称不能超过100个字符");
        }

        if (product.getPrice() == null) {
            throw new RuntimeException("产品价格不能为空");
        }

        if (product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("产品价格不能为负数");
        }

        if (product.getStatus() != null && product.getStatus() != 0 && product.getStatus() != 1) {
            throw new RuntimeException("状态值无效，必须是0或1");
        }

        if (product.getTenantId() == null) {
            throw new RuntimeException("租户ID不能为空");
        }
    }
}