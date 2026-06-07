package com.example.project_10.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private String image;
    private String nickname;
    private long likes;
    private long comments;
    private LocalDateTime createdAt;
}
