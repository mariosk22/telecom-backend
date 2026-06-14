package com.example.project_10.controller;

import com.example.project_10.dto.LoginDto;
import com.example.project_10.dto.RegisterDto;
import com.example.project_10.entity.User;
import com.example.project_10.security.JWTUtil;
import com.example.project_10.security.TokenBlacklistService;
import com.example.project_10.service.UserService;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto request){
        try{
            userService.register(request);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Register successfully!"));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Register failed!"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto request){
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            String token = jwtUtil.createToken(request.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "token", token,
                    "nickname", user.getNickname(),
                    "name", user.getName()
            ));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login failed!"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String header) {
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValidToken(token)) {
                tokenBlacklistService.blacklist(token, jwtUtil.getExpiration(token));
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Logout successfully!"));
    }

}