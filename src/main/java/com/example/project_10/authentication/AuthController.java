package com.example.project_10.authentication;

import com.example.project_10.user.User;
import com.example.project_10.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Register request){
        try{
            userService.register(request);
            return ResponseEntity.ok(Map.of("message", "Register successfully!"));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Register failed!");
        }

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login request){
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            return  ResponseEntity.ok(Map.of("message", "Login successfully!"));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Login failed!");
        }
    }
}
