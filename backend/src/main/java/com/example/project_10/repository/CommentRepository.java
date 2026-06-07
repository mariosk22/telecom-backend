package com.example.project_10.repository;

import com.example.project_10.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    Optional<Comment> findByPostIdAndUserId(Long postId, Long userId);
    Optional<Comment> findByIdAndPostId(Long id, Long postId);
    long countByPostId(Long postId);
}
