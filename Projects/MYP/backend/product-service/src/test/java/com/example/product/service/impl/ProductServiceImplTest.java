import com.example.product.model.Product;
import com.example.product.repository.ProductRepository;
import com.example.product.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // 初始化测试产品
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("测试产品");
        testProduct.setDescription("这是一个测试产品");
        testProduct.setPrice(BigDecimal.valueOf(100.00));
        testProduct.setStockQuantity(100);
        testProduct.setStatus(1);
        testProduct.setCategoryId(1L);
        testProduct.setTenantId(1L);
    }

    @Test
    void testCreateProduct() {
        // 配置模拟行为
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行测试
        Product createdProduct = productService.createProduct(testProduct);

        // 验证结果
        assertNotNull(createdProduct);
        assertEquals(testProduct.getId(), createdProduct.getId());
        assertEquals(testProduct.getName(), createdProduct.getName());
        verify(productRepository).save(testProduct);
    }

    @Test
    void testCreateProductWithInvalidName() {
        // 设置无效的产品名称
        testProduct.setName("");

        // 验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.createProduct(testProduct);
        });

        assertEquals("产品名称不能为空", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testUpdateProduct() {
        // 配置模拟行为
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 修改产品信息
        Product updatedProduct = new Product();
        updatedProduct.setName("更新后的产品名称");
        updatedProduct.setDescription("更新后的产品描述");
        updatedProduct.setPrice(BigDecimal.valueOf(150.00));
        updatedProduct.setStockQuantity(50);
        updatedProduct.setStatus(1);
        updatedProduct.setCategoryId(1L);
        updatedProduct.setTenantId(1L);

        // 执行测试
        Product result = productService.updateProduct(1L, updatedProduct);

        // 验证结果
        assertNotNull(result);
        assertEquals("更新后的产品名称", result.getName());
        assertEquals("更新后的产品描述", result.getDescription());
        assertEquals(BigDecimal.valueOf(150.00), result.getPrice());
        verify(productRepository).findById(1L);
        verify(productRepository).save(testProduct);
    }

    @Test
    void testUpdateNonExistentProduct() {
        // 配置模拟行为
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // 验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(1L, testProduct);
        });

        assertEquals("产品不存在，ID: 1", exception.getMessage());
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testDeleteProduct() {
        // 配置模拟行为
        when(productRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);

        // 执行测试
        productService.deleteProduct(1L);

        // 验证结果
        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void testDeleteNonExistentProduct() {
        // 配置模拟行为
        when(productRepository.existsById(1L)).thenReturn(false);

        // 验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.deleteProduct(1L);
        });

        assertEquals("产品不存在，ID: 1", exception.getMessage());
        verify(productRepository).existsById(1L);
        verify(productRepository, never()).deleteById(anyLong());
    }

    @Test
    void testGetProductById() {
        // 配置模拟行为
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // 执行测试
        Optional<Product> result = productService.getProductById(1L);

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals(testProduct.getId(), result.get().getId());
        verify(productRepository).findById(1L);
    }

    @Test
    void testGetAllProducts() {
        // 配置模拟行为
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAll()).thenReturn(products);

        // 执行测试
        List<Product> result = productService.getAllProducts();

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getId(), result.get(0).getId());
        verify(productRepository).findAll();
    }

    @Test
    void testGetProductsByTenantId() {
        // 配置模拟行为
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByTenantId(1L)).thenReturn(products);

        // 执行测试
        List<Product> result = productService.getProductsByTenantId(1L);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getId(), result.get(0).getId());
        verify(productRepository).findByTenantId(1L);
    }

    @Test
    void testGetProductsByCategoryId() {
        // 配置模拟行为
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByCategoryId(1L)).thenReturn(products);

        // 执行测试
        List<Product> result = productService.getProductsByCategoryId(1L);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getId(), result.get(0).getId());
        verify(productRepository).findByCategoryId(1L);
    }

    @Test
    void testChangeProductStatus() {
        // 配置模拟行为
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行测试
        Product result = productService.changeProductStatus(1L, 0);

        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.getStatus());
        verify(productRepository).findById(1L);
        verify(productRepository).save(testProduct);
    }

    @Test
    void testChangeProductStatusWithInvalidStatus() {
        // 验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.changeProductStatus(1L, 2);
        });

        assertEquals("状态值无效，必须是0或1", exception.getMessage());
        verify(productRepository, never()).findById(anyLong());
        verify(productRepository, never()).save(any(Product.class));
    }
}