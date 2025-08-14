package com.example.auth.security;

import com.example.auth.entity.Role;
import com.example.auth.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtTokenProviderTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

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
}