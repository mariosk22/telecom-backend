package com.example.project_10.controller;

import com.example.project_10.dto.CommentDto;
import com.example.project_10.dto.CommentResponseDto;
import com.example.project_10.entity.User;
import com.example.project_10.repository.UserRepository;
import com.example.project_10.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable("id") Long postId) {
        try {
            List<CommentResponseDto> comments = commentService.getComments(postId);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(comments);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Loading comments failed!");
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> createComment(@PathVariable("id") Long postId, @Valid @RequestBody CommentDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Legged user not found in database!"));
            CommentResponseDto created = commentService.createComment(request, currentUser.getId(), postId);
            return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Creating comment failed!");
        }
    }
}
