package com.example.project_10.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDto {

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters long")
    private String title;

    @NotBlank(message = "The content must not be empty")
    @Size(min = 1, max = 1000, message = "Content must be between 1 and 1000 characters")
    private String content;

    private String image;
}
