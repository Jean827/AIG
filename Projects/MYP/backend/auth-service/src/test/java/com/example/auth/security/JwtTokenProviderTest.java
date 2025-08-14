package com.example.auth.security;

import com.example.auth.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtTokenProviderTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private UserService userService;

    @InjectMocks
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", "testSecretKeytestSecretKeytestSecretKeytestSecretKey");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", 86400000);
        ReflectionTestUtils.setField(jwtTokenProvider, "refreshTokenExpirationMs", 604800000);
    }

    @Test
    void generateJwtToken() {
        Authentication authentication = createAuthentication();
        String token = jwtTokenProvider.generateJwtToken(authentication);
        assertNotNull(token);
    }

    @Test
    void generateRefreshToken() {
        Authentication authentication = createAuthentication();
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        assertNotNull(refreshToken);
        verify(redisTemplate).opsForValue().set(
                eq("refresh_token:testuser"),
                eq(refreshToken),
                eq(604800000L),
                eq(TimeUnit.MILLISECONDS)
        );
    }

    @Test
    void validateJwtToken() {
        Authentication authentication = createAuthentication();
        String token = jwtTokenProvider.generateJwtToken(authentication);
        assertTrue(jwtTokenProvider.validateJwtToken(token));
    }

    @Test
    void validateJwtToken_blacklisted() {
        Authentication authentication = createAuthentication();
        String token = jwtTokenProvider.generateJwtToken(authentication);
        when(redisTemplate.hasKey("blacklist:" + token)).thenReturn(true);
        assertFalse(jwtTokenProvider.validateJwtToken(token));
    }

    @Test
    void generateMfaJwtToken() {
        Authentication authentication = createAuthentication();
        String mfaCode = "123456";
        String token = jwtTokenProvider.generateMfaJwtToken(authentication, mfaCode);
        assertNotNull(token);
        verify(redisTemplate).opsForValue().set(
                eq("mfa_code:testuser"),
                eq(mfaCode),
                eq(5L),
                eq(TimeUnit.MINUTES)
        );
    }

    @Test
    void verifyMfaAndGenerateToken_success() {
        String username = "testuser";
        String mfaCode = "123456";
        UserDetails userDetails = createUserDetails();

        when(redisTemplate.opsForValue().get("mfa_code:" + username)).thenReturn(mfaCode);
        when(userService.loadUserByUsername(username)).thenReturn(userDetails);

        String token = jwtTokenProvider.verifyMfaAndGenerateToken(username, mfaCode);
        assertNotNull(token);
        verify(redisTemplate).delete("mfa_code:" + username);
    }

    @Test
    void verifyMfaAndGenerateToken_invalidCode() {
        String username = "testuser";
        String mfaCode = "123456";
        String invalidCode = "654321";

        when(redisTemplate.opsForValue().get("mfa_code:" + username)).thenReturn(mfaCode);

        assertThrows(RuntimeException.class, () -> {
            jwtTokenProvider.verifyMfaAndGenerateToken(username, invalidCode);
        });
    }

    @Test
    void verifyMfaAndGenerateToken_expiredCode() {
        String username = "testuser";
        String mfaCode = "123456";

        when(redisTemplate.opsForValue().get("mfa_code:" + username)).thenReturn(null);

        assertThrows(RuntimeException.class, () -> {
            jwtTokenProvider.verifyMfaAndGenerateToken(username, mfaCode);
        });
    }

    @Test
    void getUserNameFromJwtToken() {
        Authentication authentication = createAuthentication();
        String token = jwtTokenProvider.generateJwtToken(authentication);
        String username = jwtTokenProvider.getUserNameFromJwtToken(token);
        assertEquals("testuser", username);
    }

    @Test
    void getUserNameFromRefreshToken() {
        Authentication authentication = createAuthentication();
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        String username = jwtTokenProvider.getUserNameFromRefreshToken(refreshToken);
        assertEquals("testuser", username);
    }

    @Test
    void validateRefreshToken_valid() {
        Authentication authentication = createAuthentication();
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        assertTrue(jwtTokenProvider.validateRefreshToken(refreshToken));
    }

    @Test
    void validateRefreshToken_invalid() {
        String invalidToken = "invalid.token";
        assertFalse(jwtTokenProvider.validateRefreshToken(invalidToken));
    }

    @Test
    void blacklistToken() {
        Authentication authentication = createAuthentication();
        String token = jwtTokenProvider.generateJwtToken(authentication);
        jwtTokenProvider.blacklistToken(token);
        verify(redisTemplate).opsForValue().set(
                startsWith("blacklist:"),
                eq(true),
                anyLong(),
                eq(TimeUnit.MILLISECONDS)
        );
    }

    private Authentication createAuthentication() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new UsernamePasswordAuthenticationToken("testuser", "password", authorities);
    }

    private UserDetails createUserDetails() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new org.springframework.security.core.userdetails.User(
                "testuser",
                "password",
                authorities
        );
    }
}