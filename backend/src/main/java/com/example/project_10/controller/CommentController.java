package com.example.project_10.controller;

import com.example.project_10.dto.CommentDto;
import com.example.project_10.dto.CommentResponseDto;
import com.example.project_10.entity.Comment;
import com.example.project_10.entity.User;
import com.example.project_10.repository.CommentRepository;
import com.example.project_10.repository.PostRepository;
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
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

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
            if (!postRepository.existsById(postId)) {
                return ResponseEntity.status(HttpStatusCode.valueOf(404)).body("Post not found!");
            }

            User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Legged user not found in database!"));
            CommentResponseDto created = commentService.createComment(request, currentUser.getId(), postId);
            return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Creating comment failed!");
        }
    }

    @PatchMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CommentDto request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if(currentUser == null){
                return ResponseEntity.status(HttpStatusCode.valueOf(401)).body("User not found!");
            }

            Optional<Comment> findComment = commentRepository.findByIdAndPostId(commentId, postId);
            if(findComment.isEmpty()){
                return ResponseEntity.status(HttpStatusCode.valueOf(404)).body("Comment not found!");
            }

            Comment comment = findComment.get();

            if(!comment.getUserId().equals(currentUser.getId())){
                return ResponseEntity.status(HttpStatusCode.valueOf(403)).body("You are not allowed to update comment!");
            }

            CommentResponseDto updated = commentService.updateComment(comment, request.getContent());
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Updating comment failed!");
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId, @PathVariable Long commentId,  @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if(currentUser == null){
                return ResponseEntity.status(HttpStatusCode.valueOf(401)).body("User not found!");
            }

            Optional<Comment> findComment = commentRepository.findByIdAndPostId(commentId, postId);
            if(findComment.isEmpty()){
                return ResponseEntity.status(HttpStatusCode.valueOf(404)).body("Comment not found!");
            }
            Comment comment = findComment.get();

            if(!comment.getUserId().equals(currentUser.getId())){
                return ResponseEntity.status(HttpStatusCode.valueOf(403)).body("You are not allowed to delete comment!");
            }

            commentService.deleteComment(comment);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body("Deleted comment successfully!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Deleting comment failed!");
        }
    }
}
