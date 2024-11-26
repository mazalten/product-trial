package com.alten.producttrial.services;

import com.alten.producttrial.dtos.TokenResponse;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public TokenResponse generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return new TokenResponse(Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact());
    }

    public String extractEmail(String token) {
        // Supprimer le préfixe "Bearer " s'il existe
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Retirer le préfixe
        }

        try {
            // Parser et extraire l'email du token
            return Jwts.parser()
                    .setSigningKey(secret)  // Assurez-vous que votre secret est correct
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();  // Récupérer l'email stocké dans le 'subject' du JWT
        } catch (JwtException e) {
            // Gestion des exceptions liées au token JWT
            throw new RuntimeException("Invalid token", e);  // Vous pouvez personnaliser le message d'exception
        }
    }


    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    public boolean validateToken(String token, String email) {
        return (email.equals(extractEmail(token)) && !isTokenExpired(token));
    }

    public boolean isAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String email = authentication.getName();
        return "admin@admin.com".equals(email);
    }
}

