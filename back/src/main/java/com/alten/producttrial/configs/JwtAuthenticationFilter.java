package com.alten.producttrial.configs;

import com.alten.producttrial.services.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@WebFilter(urlPatterns = "/api/*")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);
        try {
            if (token != null && jwtService.validateToken(token, extractEmail(token))) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(extractEmail(token), null, null);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                if (isSensitiveAction(request) && !jwtService.isAdmin(authentication)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Access denied: Only admin@admin.com can perform this action.");
                    return;
                }
            }
        }
        catch (JwtException jwtException){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Access denied: Invalid Token.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // Enlever "Bearer "
        }
        return null;
    }

    private String extractEmail(String token) {
        return jwtService.extractEmail(token);
    }

    private boolean isSensitiveAction(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getRequestURI();

        return ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method))
                && path.startsWith("/api/products");
    }
}

