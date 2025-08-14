package com.example.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import com.example.auth.service.UserService;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;

@Component
public class JwtTokenProvider {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserService userService;

    public JwtTokenProvider(RedisTemplate<String, Object> redisTemplate,
                            @Lazy UserService userService) {
        this.redisTemplate = redisTemplate;
        this.userService = userService;
    }

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${app.refreshTokenExpirationMs}")
    private int refreshTokenExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(principal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .claim("auth_type", "standard")
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateMfaJwtToken(Authentication authentication, String mfaCode) {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        // Store MFA code in Redis for verification
        redisTemplate.opsForValue().set("mfa_code:" + principal.getUsername(), mfaCode, 5, TimeUnit.MINUTES);

        return Jwts.builder()
                .setSubject(principal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 5 * 60 * 1000)) // 5 minutes
                .claim("auth_type", "mfa_pending")
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String verifyMfaAndGenerateToken(String username, String mfaCode) {
        // Verify MFA code
        String storedCode = (String) redisTemplate.opsForValue().get("mfa_code:" + username);
        if (storedCode == null || !storedCode.equals(mfaCode)) {
            throw new RuntimeException("Invalid or expired MFA code");
        }

        // Remove verified MFA code
        redisTemplate.delete("mfa_code:" + username);

        // Create authentication token
        org.springframework.security.core.userdetails.UserDetails userDetails = userService.loadUserByUsername(username);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // Generate JWT token
        return generateJwtToken(authentication);
    }

    public String generateRefreshToken(Authentication authentication) {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        String refreshToken = Jwts.builder()
                .setSubject(principal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + refreshTokenExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

        // Store refresh token in Redis
        redisTemplate.opsForValue().set("refresh_token:" + principal.getUsername(), refreshToken,
                refreshTokenExpirationMs, TimeUnit.MILLISECONDS);

        return refreshToken;
    }

    public String getUserNameFromRefreshToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void blacklistToken(String token) {
        // Get expiration time from token
        Claims claims = Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();
        Date expiration = claims.getExpiration();
        long ttl = expiration.getTime() - System.currentTimeMillis();

        // Add to blacklist with TTL
        redisTemplate.opsForValue().set("blacklist:" + token, true, ttl, TimeUnit.MILLISECONDS);
    }

    public boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + token));
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            // Check if token is blacklisted
            if (isTokenBlacklisted(authToken)) {
                System.err.println("JWT token is blacklisted");
                return false;
            }

            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }

        return false;
    }
}