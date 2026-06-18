package com.example.project_10.controller;

import com.example.project_10.dto.CommentDto;
import com.example.project_10.dto.CommentResponseDto;
import com.example.project_10.entity.Comment;
import com.example.project_10.entity.User;
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
import java.util.Optional;

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
    public ResponseEntity<?> getComments(@PathVariable("id") Long postId) {
        try {
            List<CommentResponseDto> comments = commentService.getComments(postId);
            return ResponseEntity.status(HttpStatus.OK).body(comments);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loading comments failed!");
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> createComment(@PathVariable("id") Long postId, @Valid @RequestBody CommentDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (!postService.existsById(postId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found!");
            }

            User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Legged user not found in database!"));
            CommentResponseDto created = commentService.createComment(request, currentUser.getId(), postId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Creating comment failed!");
        }
    }

    @PatchMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CommentDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername()).orElse(null);
            if(currentUser == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found!");
            }

            Optional<Comment> findComment = commentService.findByIdAndPostId(commentId, postId);
            if(findComment.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found!");
            }

            Comment comment = findComment.get();

            if(!comment.getUserId().equals(currentUser.getId())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update comment!");
            }

            CommentResponseDto updated = commentService.updateComment(comment, request.getContent());
            return ResponseEntity.status(HttpStatus.OK).body(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Updating comment failed!");
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId, @PathVariable Long commentId,  @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername()).orElse(null);
            if(currentUser == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found!");
            }

            Optional<Comment> findComment = commentService.findByIdAndPostId(commentId, postId);
            if(findComment.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found!");
            }
            Comment comment = findComment.get();

            if(!comment.getUserId().equals(currentUser.getId())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete comment!");
            }

            commentService.deleteComment(comment);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Deleting comment failed!");
        }
    }
}
