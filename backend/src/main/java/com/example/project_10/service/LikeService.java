package com.example.project_10.service;

import com.example.project_10.dto.LikeStatusDto;
import com.example.project_10.entity.Like;
import com.example.project_10.repository.LikeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Transactional
    public LikeStatusDto likePost(Long postId, Long userId) {
        if(!likeRepository.existsByPostIdAndUserId(postId,userId)) {
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(userId);
            likeRepository.save(like);
        }
        return status(postId, userId);
    }

    @Transactional
    public LikeStatusDto unlikePost(Long postId, Long userId) {
        likeRepository.deleteByPostIdAndUserId(postId,userId);
        return status(postId, userId);
    }

    public LikeStatusDto getStatus(Long postId, Long userId) {
        return status(postId, userId);
    }

    public LikeStatusDto status(Long postId, Long userId) {
        long count = likeRepository.countByPostId(postId);
        boolean liked;
        if(userId == null) {
            liked = false;
        } else {
            liked = likeRepository.existsByPostIdAndUserId(postId,userId);
        }
        return new LikeStatusDto(count, liked);
    }
}
