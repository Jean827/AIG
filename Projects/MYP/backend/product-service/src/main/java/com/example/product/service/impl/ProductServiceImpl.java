package com.example.product.service.impl;

import com.example.product.model.Product;
import com.example.product.model.Order;
import com.example.product.repository.ProductRepository;
import com.example.product.service.ProductService;
import com.example.product.feign.OrderServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * 产品服务实现类
 */
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final OrderServiceClient orderServiceClient;
    private final RedisTemplate<String, Object> redisTemplate;
    private final long productCacheTtl;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, OrderServiceClient orderServiceClient, RedisTemplate<String, Object> redisTemplate, @Value("${product.cache.ttl:3600}") long productCacheTtl) {
        this.productRepository = productRepository;
        this.orderServiceClient = orderServiceClient;
        this.redisTemplate = redisTemplate;
        this.productCacheTtl = productCacheTtl;
    }

    @Override
    public Product createProduct(Product product) {
        // 验证产品信息
        validateProduct(product);
        Product createdProduct = productRepository.save(product);

        // 清除相关缓存
        redisTemplate.delete("products:tenant:" + product.getTenantId());
        redisTemplate.delete("products:category:" + product.getCategoryId());

        return createdProduct;
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        // 检查产品是否存在
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("产品不存在，ID: " + id));

        // 保存旧的分类和租户ID，用于清除缓存
        Long oldCategoryId = existingProduct.getCategoryId();
        Long oldTenantId = existingProduct.getTenantId();

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

        Product updatedProduct = productRepository.save(existingProduct);

        // 清除相关缓存
        redisTemplate.delete("product:id:" + id);
        redisTemplate.delete("products:tenant:" + oldTenantId);
        redisTemplate.delete("products:category:" + oldCategoryId);
        
        // 如果分类或租户ID发生了变化，也清除新的相关缓存
        if (!product.getCategoryId().equals(oldCategoryId)) {
            redisTemplate.delete("products:category:" + product.getCategoryId());
        }
        if (!product.getTenantId().equals(oldTenantId)) {
            redisTemplate.delete("products:tenant:" + product.getTenantId());
        }

        return updatedProduct;
    }

    @Override
    public void deleteProduct(Long id) {
        // 检查产品是否存在
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("产品不存在，ID: " + id));

        // 保存分类和租户ID，用于清除缓存
        Long categoryId = product.getCategoryId();
        Long tenantId = product.getTenantId();

        productRepository.deleteById(id);

        // 清除相关缓存
        redisTemplate.delete("product:id:" + id);
        redisTemplate.delete("products:tenant:" + tenantId);
        redisTemplate.delete("products:category:" + categoryId);
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        String cacheKey = "product:id:" + id;
        Product product = (Product) redisTemplate.opsForValue().get(cacheKey);
        if (product != null) {
            return Optional.of(product);
        }
        Optional<Product> productOptional = productRepository.findById(id);
        productOptional.ifPresent(p -> redisTemplate.opsForValue().set(cacheKey, p, productCacheTtl, TimeUnit.SECONDS));
        return productOptional;
    }

    @Override
    public List<Product> getAllProducts() {
        // 默认返回第一页，每页10条记录
        return productRepository.findAll(PageRequest.of(0, 10)).getContent();
    }

    /**
     * 分页查询所有产品
     * @param page 页码（从0开始）
     * @param size 每页记录数
     * @return 产品列表
     */
    public List<Product> getAllProducts(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    public List<Product> getProductsByTenantId(Long tenantId) {
        String cacheKey = "products:tenant:" + tenantId;
        List<Product> products = (List<Product>) redisTemplate.opsForValue().get(cacheKey);
        if (products == null) {
            products = productRepository.findByTenantId(tenantId);
            redisTemplate.opsForValue().set(cacheKey, products, productCacheTtl, TimeUnit.SECONDS);
        }
        return products;
    }

    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        String cacheKey = "products:category:" + categoryId;
        List<Product> products = (List<Product>) redisTemplate.opsForValue().get(cacheKey);
        if (products == null) {
            products = productRepository.findByCategoryId(categoryId);
            redisTemplate.opsForValue().set(cacheKey, products, productCacheTtl, TimeUnit.SECONDS);
        }
        return products;
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
     * 获取产品关联的订单数量
     * @param productId 产品ID
     * @return 订单数量
     */
    public Long getProductOrderCount(Long productId) {
        // 验证产品是否存在
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("产品不存在，ID: " + productId);
        }
        // 调用订单服务获取订单数量
        return orderServiceClient.getOrderCountByProductId(productId);
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