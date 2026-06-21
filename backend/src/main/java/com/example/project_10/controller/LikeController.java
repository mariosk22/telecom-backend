package com.example.project_10.controller;

import com.example.project_10.dto.LikeStatusDto;
import com.example.project_10.entity.User;
import com.example.project_10.exception.ApiException;
import com.example.project_10.service.LikeService;
import com.example.project_10.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserService userService;

    @GetMapping("/{id}/likes")
    public ResponseEntity<LikeStatusDto> getLikes(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(likeService.getStatus(postId, userId));
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<LikeStatusDto> likePost(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        if (userId == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized!");
        }
        return ResponseEntity.ok(likeService.likePost(postId, userId));
    }

    @DeleteMapping("/{id}/likes")
    public ResponseEntity<LikeStatusDto> likeDelete(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        if (userId == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized!");
        }
        return ResponseEntity.ok(likeService.unlikePost(postId, userId));
    }


    private Long getUserId(UserDetails userDetails){
        if(userDetails==null){
            return null;
        }

        String email = userDetails.getUsername();
        Optional<User> userNew = userService.findByEmail(email);

        if(userNew.isPresent()){
            User user = userNew.get();
            return user.getId();
        } else {
            return null;
        }
    }
}
