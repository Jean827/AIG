package com.example.product.controller;

import com.example.product.model.Product;
import com.example.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

/**
 * 产品控制器
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 创建产品
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    /**
     * 更新产品
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * 删除产品
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 根据ID查询产品
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 查询所有产品（默认分页）
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Product> products = productService.getAllProducts(page, size);
        return ResponseEntity.ok(products);
    }

    /**
     * 查询所有产品（不分页）
     * @deprecated 推荐使用分页查询
     */
    @GetMapping("/all")
    @Deprecated
    public ResponseEntity<List<Product>> getAllProductsWithoutPagination() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * 根据租户ID查询产品
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Product>> getProductsByTenantId(@PathVariable Long tenantId) {
        List<Product> products = productService.getProductsByTenantId(tenantId);
        return ResponseEntity.ok(products);
    }

    /**
     * 根据分类ID查询产品
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    /**
     * 更改产品状态
     */
    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<Product> changeProductStatus(@PathVariable Long id, @PathVariable Integer status) {
        Product updatedProduct = productService.changeProductStatus(id, status);
        return ResponseEntity.ok(updatedProduct);
    }
    
    /**
     * 获取产品关联的订单数量
     */
    @GetMapping("/{id}/orders/count")
    public ResponseEntity<Long> getOrderCountByProductId(@PathVariable Long id) {
        try {
            // 直接调用获取订单数量的服务方法
            Long orderCount = productService.getProductOrderCount(id);
            return ResponseEntity.ok(orderCount);
        } catch (RuntimeException e) {
            // 产品不存在时返回404
            return ResponseEntity.notFound().build();
        }
    }
}