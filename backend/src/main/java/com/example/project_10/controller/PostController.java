package com.example.project_10.controller;

import com.example.project_10.dto.PostDto;
import com.example.project_10.dto.PostResponseDto;
import com.example.project_10.entity.User;
import com.example.project_10.exception.ApiException;
import com.example.project_10.service.UserService;
import com.example.project_10.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@Valid @RequestBody PostDto request, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(request, currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        postService.deletePost(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PostResponseDto> updatePost(@PathVariable Long id, @Valid @RequestBody PostDto request, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        return ResponseEntity.ok(postService.updatePost(id, request, currentUser.getId()));
    }
}
