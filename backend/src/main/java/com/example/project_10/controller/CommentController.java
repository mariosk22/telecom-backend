package com.example.project_10.controller;

import com.example.project_10.dto.CommentDto;
import com.example.project_10.dto.CommentResponseDto;
import com.example.project_10.entity.Comment;
import com.example.project_10.entity.User;
import com.example.project_10.exception.ApiException;
import com.example.project_10.service.CommentService;
import com.example.project_10.service.PostService;
import com.example.project_10.service.UserService;
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
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable("id") Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDto> createComment(@PathVariable("id") Long postId, @Valid @RequestBody CommentDto request, @AuthenticationPrincipal UserDetails userDetails) {
        if (!postService.existsById(postId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Post not found!");
        }
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        CommentResponseDto created = commentService.createComment(request, currentUser.getId(), postId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CommentDto request, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        Comment comment = commentService.findByIdAndPostId(commentId, postId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Comment not found!"));
        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to update comment!");
        }
        return ResponseEntity.ok(commentService.updateComment(comment, request.getContent()));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        Comment comment = commentService.findByIdAndPostId(commentId, postId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Comment not found!"));
        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to delete comment!");
        }
        commentService.deleteComment(comment);
        return ResponseEntity.noContent().build();
    }
}
