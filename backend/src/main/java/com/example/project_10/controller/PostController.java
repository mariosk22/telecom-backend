package com.example.project_10.controller;

import com.example.project_10.dto.PostDto;
import com.example.project_10.dto.PostResponseDto;
import com.example.project_10.entity.User;
import com.example.project_10.repository.UserRepository;
import com.example.project_10.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<PostResponseDto> posts = postService.getAllPosts();
            return ResponseEntity.status(200).body(posts);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Loading posts failed!");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable("id") Long postId) {
        try {
            PostResponseDto post = postService.getPostById(postId);
            return ResponseEntity.status(200).body(post);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Loading post failed!");
        }
    }

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Logged user not found in database!"));
            PostResponseDto created = postService.createPost(request, currentUser.getId());
            return ResponseEntity.status(200).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Creating post failed!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Logged user not found in database!"));
            postService.deletePost(postId, currentUser.getId());
            return ResponseEntity.status(200).body("Post deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Deleting post failed!");
        }
    }
}
