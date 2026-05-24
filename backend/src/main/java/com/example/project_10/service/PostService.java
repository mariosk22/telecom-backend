package com.example.project_10.service;

import com.example.project_10.dto.PostDto;
import com.example.project_10.dto.PostResponseDto;
import com.example.project_10.entity.Post;
import com.example.project_10.entity.User;
import com.example.project_10.repository.PostRepository;
import com.example.project_10.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public PostResponseDto createPost(PostDto postDto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Používateľ nebol nájdený!"));
        Post post = new Post();
        post.setUser(user);
        post.setContent(postDto.getContent());

        Post savedPost = postRepository.save(post);
        return toResponseDto(savedPost);
    }

    public List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<PostResponseDto> listDto = new ArrayList<>();
        for (Post post : posts) {
            listDto.add(toResponseDto(post));
        }
        return listDto;
    }

    public List<PostResponseDto> getPostsByUserId(Long userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<PostResponseDto> listDto = new ArrayList<>();
        for (Post post : posts) {
            listDto.add(toResponseDto(post));
        }
        return listDto;
    }

    public PostResponseDto getPostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post nebol nájdený"));
        return toResponseDto(post);
    }

    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post nebol nájdený"));
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Nemáš oprávnenie vymazať tento post");
        }
        postRepository.delete(post);
    }

    private PostResponseDto toResponseDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }
}
