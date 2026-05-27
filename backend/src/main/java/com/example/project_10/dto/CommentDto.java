package com.example.project_10.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDto {

    @NotBlank(message = "Comment cannot be empty!")
    @Size(min = 1, max = 1000, message = "Comment must be between 1 and 1000 characters")
    private  String content;
}
