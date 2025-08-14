import com.example.auth.dto.JwtAuthRequest;
import com.example.auth.dto.JwtAuthResponse;
import com.example.auth.dto.RefreshTokenRequest;
import com.example.auth.entity.Role;
import com.example.auth.entity.User;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class AuthIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String BASE_URL = "/api/auth";
    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_PASSWORD = "password";

    @BeforeEach
    void setUp() {
        // 创建测试角色
        Role userRole = new Role();
        userRole.setName("ROLE_USER");
        roleRepository.save(userRole);

        // 创建测试用户
        User user = new User();
        user.setUsername(TEST_USERNAME);
        user.setPassword(passwordEncoder.encode(TEST_PASSWORD));
        user.setEmail("test@example.com");
        user.setActive(true);

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);
    }

    @Test
    void testAuthenticateUser() {
        // 测试用户登录
        JwtAuthRequest loginRequest = new JwtAuthRequest();
        loginRequest.setUsername(TEST_USERNAME);
        loginRequest.setPassword(TEST_PASSWORD);

        ResponseEntity<JwtAuthResponse> response = restTemplate.postForEntity(
                BASE_URL + "/signin", loginRequest, JwtAuthResponse.class);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        assertNotNull(response.getBody().getRefreshToken());
        assertEquals(TEST_USERNAME, response.getBody().getUsername());
        assertTrue(response.getBody().getRoles().contains("ROLE_USER"));
    }

    @Test
    void testRefreshToken() {
        // 先登录获取令牌
        JwtAuthRequest loginRequest = new JwtAuthRequest();
        loginRequest.setUsername(TEST_USERNAME);
        loginRequest.setPassword(TEST_PASSWORD);

        ResponseEntity<JwtAuthResponse> loginResponse = restTemplate.postForEntity(
                BASE_URL + "/signin", loginRequest, JwtAuthResponse.class);

        String refreshToken = loginResponse.getBody().getRefreshToken();

        // 使用刷新令牌获取新的访问令牌
        RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
        refreshRequest.setRefreshToken(refreshToken);

        ResponseEntity<JwtAuthResponse> refreshResponse = restTemplate.postForEntity(
                BASE_URL + "/refresh-token", refreshRequest, JwtAuthResponse.class);

        assertEquals(200, refreshResponse.getStatusCodeValue());
        assertNotNull(refreshResponse.getBody());
        assertNotNull(refreshResponse.getBody().getToken());
        assertNotNull(refreshResponse.getBody().getRefreshToken());
        assertNotEquals(loginResponse.getBody().getToken(), refreshResponse.getBody().getToken());
        assertNotEquals(loginResponse.getBody().getRefreshToken(), refreshResponse.getBody().getRefreshToken());
    }

    @Test
    void testInvalidRefreshToken() {
        // 使用无效的刷新令牌
        RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
        refreshRequest.setRefreshToken("invalid_token");

        ResponseEntity<JwtAuthResponse> response = restTemplate.postForEntity(
                BASE_URL + "/refresh-token", refreshRequest, JwtAuthResponse.class);

        assertEquals(400, response.getStatusCodeValue());
        assertNull(response.getBody());
    }

    @Test
    void testAccessProtectedResource() {
        // 先登录获取令牌
        JwtAuthRequest loginRequest = new JwtAuthRequest();
        loginRequest.setUsername(TEST_USERNAME);
        loginRequest.setPassword(TEST_PASSWORD);

        ResponseEntity<JwtAuthResponse> loginResponse = restTemplate.postForEntity(
                BASE_URL + "/signin", loginRequest, JwtAuthResponse.class);

        String token = loginResponse.getBody().getToken();

        // 使用令牌访问受保护资源
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // 这里假设存在一个受保护的端点
        ResponseEntity<String> response = restTemplate.exchange(
                BASE_URL + "/protected", HttpMethod.GET, entity, String.class);

        // 如果端点不存在，我们期望404而不是401
        assertNotEquals(401, response.getStatusCodeValue());
    }
}