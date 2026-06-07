package com.example.project_10.service;

import com.example.project_10.dto.PostDto;
import com.example.project_10.dto.PostResponseDto;
import com.example.project_10.entity.Post;
import com.example.project_10.entity.User;
import com.example.project_10.repository.CommentRepository;
import com.example.project_10.repository.LikeRepository;
import com.example.project_10.repository.PostRepository;
import com.example.project_10.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    public PostResponseDto createPost(PostDto postDto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
        Post post = new Post();
        post.setUser(user);
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setImage(postDto.getImage());

        Post savedPost = postRepository.save(post);
        return toResponseDto(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<PostResponseDto> listDto = new ArrayList<>();
        for (Post post : posts) {
            listDto.add(toResponseDto(post));
        }
        return listDto;
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getPostsByUserId(Long userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<PostResponseDto> listDto = new ArrayList<>();
        for (Post post : posts) {
            listDto.add(toResponseDto(post));
        }
        return listDto;
    }

    @Transactional(readOnly = true)
    public PostResponseDto getPostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found!"));
        return toResponseDto(post);
    }

    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found!"));
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not have permission to delete this post!");
        }
        postRepository.delete(post);
    }

    private PostResponseDto toResponseDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setImage(post.getImage());
        dto.setNickname(post.getUser().getNickname());
        dto.setLikes(likeRepository.countByPostId(post.getId()));
        dto.setComments(commentRepository.countByPostId(post.getId()));
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }

    public PostResponseDto updatePost(Long id, PostDto postDto, Long userId) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            throw new RuntimeException("Post not found!");
        }
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to update this post!");
        }
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        if (postDto.getImage() != null) {
            post.setImage(postDto.getImage());
        }
        Post savedPost = postRepository.save(post);
        return toResponseDto(savedPost);
    }
}
