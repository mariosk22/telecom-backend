package com.example.project_10.controller;

import com.example.project_10.dto.LikeStatusDto;
import com.example.project_10.entity.User;
import com.example.project_10.repository.UserRepository;
import com.example.project_10.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
    private UserRepository userRepository;

    @GetMapping("/{id}/likes")
    public ResponseEntity<?> getLikes(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Long userId = getUserId(userDetails);
            LikeStatusDto status = likeService.getStatus(userId,postId);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(status);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Loading likes failed!");
        }
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<?> likePost(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Long userId = getUserId(userDetails);

            if(userId == null){
                return ResponseEntity.status(HttpStatusCode.valueOf(401)).body("Unauthorized!");
            }

            LikeStatusDto status = likeService.likePost(userId,postId);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(status);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Like failed!");
        }
    }

    @DeleteMapping("/{id}/likes")
    public ResponseEntity<?> likeDelete(@PathVariable("id") Long postId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Long userId = getUserId(userDetails);

            if(userId == null){
                return ResponseEntity.status(HttpStatusCode.valueOf(401)).body("Unauthorized!");
            }

            LikeStatusDto status = likeService.unlikePost(userId,postId);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(status);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body("Unlike failed!");
        }
    }


    private Long getUserId(UserDetails userDetails){
        if(userDetails==null){
            return null;
        }

        String email = userDetails.getUsername();
        Optional<User> userNew = userRepository.findByEmail(email);

        if(userNew.isPresent()){
            User user = userNew.get();
            return user.getId();
        } else {
            return null;
        }
    }
}
