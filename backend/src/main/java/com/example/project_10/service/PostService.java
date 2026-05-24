package com.example.project_10.service;

import com.example.project_10.dto.PostDto;
import com.example.project_10.dto.PostResponseDto;
import com.example.project_10.entity.Post;
import com.example.project_10.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public PostResponseDto createPost(PostDto postDto, Long userId) {
        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());

        Post savedPost = postRepository.save(post);
        return toResponseDto(savedPost);
    }

    public List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        List<PostResponseDto> listDto = new ArrayList<>();
        for (Post post : posts) {
            listDto.add(toResponseDto(post));
        }
        return listDto;
    }

    public PostResponseDto getPostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found!"));
        return toResponseDto(post);
    }

    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found!"));
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this post!");
        }
        postRepository.delete(post);
    }

    private PostResponseDto toResponseDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUserId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedDate(post.getCreateDate());
        return dto;
    }
}
