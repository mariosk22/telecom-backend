package com.example.project_10.controller;

import com.example.project_10.dto.UserSearchDto;
import com.example.project_10.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDto>> search(@RequestParam("q") String query, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.searchByNickname(query, userDetails.getUsername()));
    }
}
