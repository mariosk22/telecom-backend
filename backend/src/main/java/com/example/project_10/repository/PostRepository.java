package com.example.project_10.repository;

import com.example.project_10.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Post> findAllByOrderByCreatedAtDesc(); // všetky posty
}
