package com.uas.backend.controller;

import com.uas.backend.dto.UserWithVideoCount;
import com.uas.backend.model.User;
import com.uas.backend.repository.UserRepository;
import com.uas.backend.repository.VideoRepository;
import com.uas.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.nimbusds.jose.JOSEException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder, VideoRepository videoRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.videoRepository = videoRepository;
    }

    @PostMapping("register")
    public ResponseEntity<User> register(@RequestBody User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRole("user");
            return ResponseEntity.ok(userRepository.save(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("sign-in")
    public ResponseEntity<?> signIn(@RequestParam String surat, @RequestParam String sandi,
                                         HttpServletResponse response) throws JOSEException {
        User user = userRepository.findByEmail(surat);
        if (user != null) {
            if (passwordEncoder.matches(sandi, user.getPassword())) {
                String token = jwtService.create(user.getId().toString());
//                System.out.println(token);

                Cookie cookie = new Cookie("token", token);
                cookie.setHttpOnly(true);
                cookie.setMaxAge(60 * 60 * 24 * 7);
                cookie.setPath("/");
                response.addCookie(cookie);

                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("me")
//    public ResponseEntity<User> me() {
//        var authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.isAuthenticated()) {
//            String email = authentication.getName();
//            User user = userRepository.findByEmail(email);
//            if (user != null) {
//                return ResponseEntity.ok(user);
//            }
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//    }
    @GetMapping("me")
    public User me() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserWithVideoCount> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            long videoCount = videoRepository.countByUserId(user.getId());
            UserWithVideoCount userWithVideoCount = new UserWithVideoCount(user.getId(), user.getName(), user.getEmail(), videoCount);
            return ResponseEntity.ok(userWithVideoCount);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public List<User> getAll(){
        return userRepository.findAll();
    }

    @GetMapping("/countall")
    public ResponseEntity<List<UserWithVideoCount>> getAllUsersWithVideoCount() {
        List<User> users = userRepository.findAll();
        List<UserWithVideoCount> result = users.stream().map(user -> {
            long videoCount = videoRepository.countByUserId(user.getId());
            return new UserWithVideoCount(user.getId(), user.getName(), user.getEmail(), videoCount);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
    @PostMapping("sign-out")
    public ResponseEntity<String> signOut(HttpServletResponse response) {
        try {
            jwtService.signOut(response);
            return ResponseEntity.ok("Berhasil sign out.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Gagal sign out.");
        }
    }

    @PutMapping("/edit/me")
    public ResponseEntity<User> updateUser(@RequestBody User updatedUser) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                if (updatedUser.getName() != null && !updatedUser.getName().isEmpty()) {
                    user.setName(updatedUser.getName());
                }
                if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
                    user.setEmail(updatedUser.getEmail());
                }
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
                userRepository.save(user);
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @DeleteMapping("/delete/me")
    public ResponseEntity<String> deleteUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                userRepository.delete(user);
                return ResponseEntity.ok("User berhasil dihapus.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            userRepository.delete(user);
            return ResponseEntity.ok("User dengan ID " + id + " berhasil dihapus.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllUsers() {
        userRepository.deleteAll();
        return ResponseEntity.ok("Semua akun berhasil dihapus.");
    }


}