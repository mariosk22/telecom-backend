package com.example.project_10.service;

import com.example.project_10.dto.CommentDto;
import com.example.project_10.dto.CommentResponseDto;
import com.example.project_10.entity.Comment;
import com.example.project_10.entity.User;
import com.example.project_10.repository.CommentRepository;
import com.example.project_10.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentResponseDto createComment(CommentDto commentDto, Long userId, Long postId) {
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setPostId(postId);
        comment.setContent(commentDto.getContent());

        Optional<User> user = userRepository.findById(userId);
        String nickname;
        if (user.isPresent()) {
            nickname = user.get().getNickname();
        } else {
            nickname = "Unknown";
        }

        Comment savedComment = commentRepository.save(comment);
        return toResponseDto(savedComment, nickname);
    }

    public List<CommentResponseDto> getComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        List<Long> userIds = new ArrayList<>();
        for (Comment comment : comments) {
            if (!userIds.contains(comment.getUserId())) {
                userIds.add(comment.getUserId());
            }
        }

        List<User> users = userRepository.findAllById(userIds);
        Map<Long, String> nicknames = new HashMap<>();
        for (User user : users) {
            nicknames.put(user.getId(), user.getNickname());
        }

        List<CommentResponseDto> listDto = new ArrayList<>();
        for (Comment comment : comments) {
            String nickname;
            if (nicknames.containsKey(comment.getUserId())) {
                nickname = nicknames.get(comment.getUserId());
            } else {
                nickname = "Unknown";
            }
            listDto.add(toResponseDto(comment, nickname));
        }
        return listDto;
    }

    private CommentResponseDto toResponseDto(Comment comment, String nickname) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        dto.setNickname(nickname);
        dto.setContent(comment.getContent());
        dto.setCreatedDate(comment.getCreatedAt());
        return dto;
    }

    @Transactional
    public CommentResponseDto updateComment(Comment comment, String newContent) {
        comment.setContent(newContent);
        Comment savedComment = commentRepository.save(comment);

        Optional<User> user = userRepository.findById(comment.getUserId());
        String nickname;
        if (user.isPresent()) {
            nickname = user.get().getNickname();
        } else {
            nickname = "Unknown";
        }
        return toResponseDto(savedComment, nickname);
    }

    @Transactional
    public void deleteComment(Comment comment) {
        commentRepository.delete(comment);
    }
}