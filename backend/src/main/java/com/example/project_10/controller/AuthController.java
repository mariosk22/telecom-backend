package com.example.project_10.controller;

import com.example.project_10.dto.LoginDto;
import com.example.project_10.dto.RegisterDto;
import com.example.project_10.entity.User;
import com.example.project_10.security.JWTUtil;
import com.example.project_10.service.UserService;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto request){
        try{
            userService.register(request);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(Map.of("message", "Register successfully!"));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(Map.of("message", "Register failed!"));
        }

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto request){
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            String token = jwtUtil.createToken(request.getEmail());
            return  ResponseEntity.status(HttpStatusCode.valueOf(200)).body(Map.of("token", token));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(401)).body(Map.of("message", "Login failed!"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logout successfully!"));
    }

}