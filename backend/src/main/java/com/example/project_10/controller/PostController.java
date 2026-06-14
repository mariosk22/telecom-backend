package com.example.project_10.controller;

import com.example.project_10.dto.PostDto;
import com.example.project_10.dto.PostResponseDto;
import com.example.project_10.entity.User;
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
    public ResponseEntity<?> getAllPosts() {
        try {
            List<PostResponseDto> posts = postService.getAllPosts();
            return ResponseEntity.status(HttpStatus.OK).body(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loading posts failed!");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        try {
            PostResponseDto post = postService.getPostById(id);
            return ResponseEntity.status(HttpStatus.OK).body(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loading post failed!");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable Long userId) {
        try {
            List<PostResponseDto> posts = postService.getPostsByUserId(userId);
            return ResponseEntity.status(HttpStatus.OK).body(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loading user posts failed!");
        }
    }

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Logged user not found in database!"));
            PostResponseDto created = postService.createPost(request, currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Creating post failed!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Logged user not found in database!"));
            postService.deletePost(id, currentUser.getId());
            return ResponseEntity.status(HttpStatus.OK).body("Post deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Deleting post failed!");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @Valid @RequestBody PostDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername()).orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found!");
            }
            PostResponseDto updated = postService.updatePost(id, request, currentUser.getId());
            return ResponseEntity.status(HttpStatus.OK).body(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Updating post failed!");
        }
    }
}
