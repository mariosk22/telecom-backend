package com.example.project_10.controller;

import com.example.project_10.dto.LikeStatusDto;
import com.example.project_10.entity.User;
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
    public ResponseEntity<?> getLikes(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Long userId = getUserId(userDetails);
            LikeStatusDto status = likeService.getStatus(postId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loading likes failed!");
        }
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<?> likePost(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Long userId = getUserId(userDetails);

            if(userId == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");
            }

            LikeStatusDto status = likeService.likePost(postId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Like failed!");
        }
    }

    @DeleteMapping("/{id}/likes")
    public ResponseEntity<?> likeDelete(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Long userId = getUserId(userDetails);

            if(userId == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");
            }

            LikeStatusDto status = likeService.unlikePost(postId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unlike failed!");
        }
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
