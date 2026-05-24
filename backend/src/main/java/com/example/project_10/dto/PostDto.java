package com.example.project_10.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDto {

    @NotBlank(message = "Title cannot be empty!")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    @NotBlank(message = "Content cannot be empty!")
    @Size(min = 1, max = 5000, message = "Content must be between 1 and 5000 characters")
    private String content;
}
