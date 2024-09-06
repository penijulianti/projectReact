package com.uas.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, RequestFilter requestFilter) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/auth/sign-out").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/videos/upload").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/videos/my-videos").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/videos/edit/{id}").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/videos/delete-by/{id}").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/videos/deleteAll").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/comment/add").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/comment/by-video/{videoId}").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/comment/edit/{id}").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/comment/delete-by/{id}").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/comment/deleteAll").authenticated();
                    auth.anyRequest().permitAll();
                })
                .addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Izinkan frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Metode HTTP yang diizinkan
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // Header yang diizinkan
        configuration.setAllowCredentials(true); // Izinkan pengiriman cookie atau kredensial lainnya

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Terapkan ke semua endpoint

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}




////package com.uas.backend.config;
////
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.http.HttpMethod;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
////import org.springframework.security.crypto.factory.PasswordEncoderFactories;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.security.web.SecurityFilterChain;
////import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
////@Configuration
////@EnableWebSecurity
////public class SecurityConfig {
////
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http, RequestFilter requestFilter) throws Exception {
////        return http
////                .csrf(AbstractHttpConfigurer::disable)
////                .authorizeHttpRequests((auth) -> {
////                    auth.requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/auth/sign-out").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/upload").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/my-videos").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/edit/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/delete-by/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/deleteAll").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/add").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/by-video/{videoId}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/edit/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/delete-by/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/deleteAll").authenticated();
////                    auth.anyRequest().permitAll();
////                })
////                .addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
////                .build();
////    }
////
////    @Bean
////    public PasswordEncoder passwordEncoder() {
////        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
////    }
////}
//
//package com.uas.backend.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.crypto.factory.PasswordEncoderFactories;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import java.util.Arrays;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.web.filter.CorsFilter;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//// Import lainnya...
//
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        Logger logger = LoggerFactory.getLogger(SecurityFilterChain.class);
////
////        return http
////                .csrf(AbstractHttpConfigurer::disable)
////                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
////                .authorizeHttpRequests(auth -> {
////                    auth.requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/auth/sign-out").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/upload").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/my-videos").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/edit/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/delete-by/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/videos/deleteAll").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/add").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/by-video/{videoId}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/edit/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/delete-by/{id}").authenticated();
////                    auth.requestMatchers(HttpMethod.GET, "/api/comment/deleteAll").authenticated();
////                    auth.anyRequest().permitAll();
////                    logger.info("Security configuration applied successfully.");
////                })
////                .build();
////    }
//
//@Bean
//public SecurityFilterChain securityFilterChain(HttpSecurity http, RequestFilter requestFilter) throws Exception {
//    return http
//            .csrf(AbstractHttpConfigurer::disable)
//            .authorizeHttpRequests((auth) -> {
//                    auth.requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/auth/sign-out").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/videos/upload").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/videos/my-videos").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/videos/edit/{id}").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/videos/delete-by/{id}").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/videos/deleteAll").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/comment/add").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/comment/by-video/{videoId}").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/comment/edit/{id}").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/comment/delete-by/{id}").authenticated();
//                    auth.requestMatchers(HttpMethod.GET, "/api/comment/deleteAll").authenticated();
//                auth.anyRequest().permitAll();
//            })
//            .addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
//            .build();
//}
//
//
////   @Bean
////    public CorsConfigurationSource corsConfigurationSource() {
////        CorsConfiguration configuration = new CorsConfiguration();
////        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Tambahkan domain frontend Anda
////        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // Metode HTTP yang diizinkan
////        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // Header yang diizinkan
////        configuration.setAllowCredentials(true); // Izinkan kredensial seperti cookies
////
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", configuration); // Terapkan konfigurasi CORS ke semua endpoint
////
////        return source;
////    }
//
//
////    @Bean
////    public CorsFilter corsFilter() {
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        CorsConfiguration configuration = new CorsConfiguration();
////
////        configuration.addAllowedOrigin("http://localhost:5173");
////        configuration.setAllowCredentials(true);
////        configuration.addAllowedHeader("*");
////        configuration.addAllowedMethod("OPTIONS");
////        configuration.addAllowedMethod("GET");
////        configuration.addAllowedMethod("POST");
////        configuration.addAllowedMethod("PUT");
////        configuration.addAllowedMethod("PATCH");
////        configuration.addAllowedMethod("DELETE");
////        source.registerCorsConfiguration("/", configuration);
////
////        return new CorsFilter(source);
////    }
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
//    }
//}
