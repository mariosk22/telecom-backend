package com.example.project_10.service;

import com.example.project_10.dto.CommentDto;
import com.example.project_10.dto.CommentResponseDto;
import com.example.project_10.entity.Comment;
import com.example.project_10.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public CommentResponseDto createComment(CommentDto commentDto, Long userId, Long postId) {
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setPostId(postId);
        comment.setContent(commentDto.getText());

        Comment savedComment = commentRepository.save(comment);
        return toResponseDto(savedComment);
    }

    public List<CommentResponseDto> getComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        List<CommentResponseDto> listDto = new ArrayList<>();
        for (Comment comment : comments) {
            CommentResponseDto dto = toResponseDto(comment);
            listDto.add(dto);
        }
        return listDto;
    }

    private CommentResponseDto toResponseDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        dto.setContent(comment.getContent());
        dto.setCreatedDate(comment.getCreateDate());
        return dto;
    }
}
