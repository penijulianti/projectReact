package com.uas.backend.config;

import java.io.IOException;


import com.uas.backend.model.User;
import com.uas.backend.repository.UserRepository;
import com.uas.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RequestFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public RequestFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws IOException, ServletException {

        Cookie[] cookies = request.getCookies();
        String token = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                }
            }
        }

        if (token != null && !token.isEmpty()) {
            try {
                String subject = jwtService.verify(token); // Verifikasi token
                Long id = Long.parseLong(subject); // Ambil ID dari subject token

                // Cari user berdasarkan ID
                User user = userRepository.findById(id).orElse(null);
                if (user != null) {
                    // Set Authentication di SecurityContextHolder
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
                            user.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("User authenticated: " + user.getEmail());
                } else {
                    System.out.println("User not found, signing out");
                    jwtService.signOut(response);
                }
            } catch (Exception e) {
                System.out.println("Token verification failed: " + e.getMessage());
                jwtService.signOut(response); // Token tidak valid, lakukan signOut
            }
        } else {
            System.out.println("No valid token found, proceeding unauthenticated");
        }

        // Lanjutkan filter chain
        filterChain.doFilter(request, response);
    }
}
