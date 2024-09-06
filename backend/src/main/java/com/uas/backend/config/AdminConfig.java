package com.uas.backend.config;

import com.uas.backend.model.User;
import com.uas.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Check if an admin already exists
        if (userRepository.findByEmail("admin@gmail.com") == null) {
            // Create an admin user
            User admin = new User();
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("adminpassword"));
            admin.setName("Admin User");
            admin.setRole("admin");

            userRepository.save(admin);
        }
    }
}
