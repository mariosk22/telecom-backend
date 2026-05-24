package com.example.project_10.controller;

import com.example.project_10.entity.Post;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @PostMapping
    public String createPost() {
        return "TODO: create post";
    }

    @GetMapping("/user/{userId}")
    public String getUserPosts(@PathVariable Long userId) {
        return "TODO: get posts for user " + userId;
    }

    @GetMapping("/feed")
    public String getFeed() {
        return "TODO: get all posts";
    }
}